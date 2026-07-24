// 📄 scripts/migrate-staff-to-employee.ts
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { asc } from "drizzle-orm";
import * as schema from "../src/db/schema";

/**
 * Phase 2 — one-time data migration: staff -> user + employee.
 *
 * For every `staff` row it creates:
 *   - one `user`   (role STAFF, generated username, random temp password,
 *                   is_first_login = true, is_active copied from staff)
 *   - one `employee` (user_id -> the new user, HR fields copied from staff)
 *
 * The old staff.password is intentionally NOT carried over — everyone resets
 * their password on first login.
 *
 * `staff` is never modified: this is a copy, not a move. Undo by deleting the
 * created employee + user rows.
 *
 * It does NOT repoint time_sheet / salary / work_assignment. Those still point
 * at staff.id; a later phase maps them using the staff.id -> employee.id map
 * this script writes to backup/staff-to-employee-map.json.
 *
 * Prerequisite: the `employee` table and `user.is_first_login` must already
 * exist in the DB (applied via `drizzle-kit push` from the committed schema).
 *
 * Usage:
 *   npx tsx scripts/migrate-staff-to-employee.ts --dry-run   # preview only, no writes
 *   npx tsx scripts/migrate-staff-to-employee.ts             # run inside one transaction
 *   npx tsx scripts/migrate-staff-to-employee.ts --force     # run even if employees already exist
 */

const OUTPUT_DIR = "backup";
const CREDENTIALS_FILE = path.join(OUTPUT_DIR, "staff-temp-credentials.csv");
const MAP_FILE = path.join(OUTPUT_DIR, "staff-to-employee-map.json");

const DB_URL = process.env.DATABASE_URL;
const DRY_RUN = process.argv.includes("--dry-run");
const FORCE = process.argv.includes("--force");

// Strip Vietnamese diacritics -> ASCII. "Nguyễn An" -> "Nguyen An".
const removeVietnameseTones = (str: string): string =>
    str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");

// name -> base username: ascii, lowercase, alphanumeric only.
const toBaseUsername = (name: string): string => {
    const base = removeVietnameseTones(name)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
    return base || "employee";
};

// Unambiguous alphabet (no 0/O/1/l/I) for temp passwords.
const PW_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
const genTempPassword = (length = 10): string => {
    const bytes = crypto.randomBytes(length);
    let out = "";
    for (let i = 0; i < length; i++) {
        out += PW_ALPHABET[bytes[i] % PW_ALPHABET.length];
    }
    return out;
};

// Assign a unique username, suffixing with 2,3,4... on collision.
const assignUniqueUsername = (name: string, taken: Set<string>): string => {
    const base = toBaseUsername(name);
    let candidate = base;
    let n = 1;
    while (taken.has(candidate)) {
        n += 1;
        candidate = `${base}${n}`;
    }
    taken.add(candidate);
    return candidate;
};

const csvCell = (value: string): string => `"${value.replace(/"/g, '""')}"`;

const migrate = async () => {
    if (!DB_URL) {
        console.error("❌ DATABASE_URL not found");
        process.exit(1);
    }

    const client = postgres(DB_URL);
    const db = drizzle(client, { schema });

    try {
        // Guard: refuse to run twice (would create duplicate employees).
        const existingEmployees = await db
            .select({ id: schema.employeeTable.id })
            .from(schema.employeeTable)
            .limit(1);

        if (existingEmployees.length > 0 && !FORCE && !DRY_RUN) {
            console.error(
                "❌ employee table is not empty — refusing to run.\n" +
                    "   Re-running would create duplicate accounts. Use --force only if you know what you're doing.",
            );
            process.exit(1);
        }

        // Seed the taken-set with existing usernames (incl. the 3 admins).
        const existingUsers = await db
            .select({ username: schema.userTable.username })
            .from(schema.userTable);
        const taken = new Set(existingUsers.map(u => u.username.toLowerCase()));

        const staffRows = await db
            .select()
            .from(schema.staffTable)
            .orderBy(
                asc(schema.staffTable.createdAt),
                asc(schema.staffTable.name),
            );

        if (staffRows.length === 0) {
            console.log("⚠️ No staff rows to migrate.");
            return;
        }

        // Assign usernames up front (deterministic ordering).
        const plan = staffRows.map(staff => ({
            staff,
            username: assignUniqueUsername(staff.name, taken),
        }));

        console.log(`👥 ${plan.length} staff row(s) to migrate:\n`);
        for (const { staff, username } of plan) {
            console.log(
                `   ${staff.name.padEnd(24)} -> ${username}` +
                    (staff.isActive ? "" : "   (inactive)"),
            );
        }

        if (DRY_RUN) {
            console.log(
                "\n🧪 Dry run — no database writes, no credentials file written.",
            );
            return;
        }

        // Everything below runs in a single transaction.
        const credentials: {
            staffName: string;
            username: string;
            tempPassword: string;
        }[] = [];
        const idMap: Record<
            string,
            { employeeId: string; username: string; staffName: string }
        > = {};

        await db.transaction(async tx => {
            for (const { staff, username } of plan) {
                const tempPassword = genTempPassword();
                const passwordHash = await bcrypt.hash(tempPassword, 10);

                const [user] = await tx
                    .insert(schema.userTable)
                    .values({
                        username,
                        password: passwordHash,
                        email: null,
                        isActive: staff.isActive,
                        isFirstLogin: true,
                        role: "STAFF",
                    })
                    .returning({ id: schema.userTable.id });

                const [employee] = await tx
                    .insert(schema.employeeTable)
                    .values({
                        userId: user.id,
                        name: staff.name,
                        salary: staff.salary,
                        salaryType: staff.salaryType,
                        isTarget: staff.isTarget,
                        isActive: staff.isActive,
                    })
                    .returning({ id: schema.employeeTable.id });

                credentials.push({
                    staffName: staff.name,
                    username,
                    tempPassword,
                });
                idMap[staff.id] = {
                    employeeId: employee.id,
                    username,
                    staffName: staff.name,
                };
            }
        });

        // Write outputs (backup/ is gitignored — plaintext passwords stay local).
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }

        const csv =
            "staff_name,username,temp_password\n" +
            credentials
                .map(c =>
                    [
                        csvCell(c.staffName),
                        csvCell(c.username),
                        csvCell(c.tempPassword),
                    ].join(","),
                )
                .join("\n") +
            "\n";
        fs.writeFileSync(CREDENTIALS_FILE, csv);
        fs.writeFileSync(MAP_FILE, JSON.stringify(idMap, null, 2));

        console.log(
            `\n✅ Migrated ${credentials.length} staff -> user + employee.\n` +
                `   🔑 Temp credentials: ${CREDENTIALS_FILE}\n` +
                `   🗺️  staff.id -> employee.id map (for the later time_sheet/salary repoint): ${MAP_FILE}\n` +
                `   ⚠️  Hand the credentials file out privately, then delete it. Do not commit it.`,
        );
    } catch (error) {
        console.error(
            "❌ Migration failed (transaction rolled back):",
            error instanceof Error ? error.message : error,
        );
        process.exit(1);
    } finally {
        await client.end();
    }
};

migrate();
