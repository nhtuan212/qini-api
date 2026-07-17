// 📄 scripts/cutover-repoint-to-employee.ts
import "dotenv/config";
import postgres from "postgres";

/**
 * Phase 2 cutover — repoint time_sheet / salary / work_assignment from
 * staff.id -> employee.id, then DROP the staff table.
 *
 * The staff->employee link is derived in-DB by matching staff.name to
 * employee.name. This is reliable because migrate-staff-to-employee.ts copied
 * the name verbatim, staff/employee names are unique, and the name-join was
 * verified to cover 100% of rows in all three tables. (The JSON map artifact is
 * NOT used — it turned out to be an incomplete 11/22 snapshot.)
 *
 * Everything runs in ONE transaction (Postgres DDL is transactional): if any
 * table still has a NULL employee_id after the backfill, the whole thing rolls
 * back and staff_id is left untouched — nothing is lost.
 *
 * Per table it: adds employee_id (nullable) -> backfills via the name-join ->
 * verifies no NULLs remain -> adds the FK -> SET NOT NULL -> drops staff_id.
 * Then swaps the time_sheet unique index onto employee_id and drops staff.
 *
 * Run this BEFORE `drizzle-kit push`. Afterwards the DB matches the committed
 * schema, so push should report no (or only cosmetic) changes.
 *
 * Usage:
 *   npx tsx scripts/cutover-repoint-to-employee.ts --dry-run   # preview coverage, no writes
 *   npx tsx scripts/cutover-repoint-to-employee.ts             # run inside one transaction
 */

const DB_URL = process.env.DATABASE_URL;
const DRY_RUN = process.argv.includes("--dry-run");

const TABLES = ["time_sheet", "salary", "work_assignment"] as const;

const main = async () => {
    if (!DB_URL) {
        console.error("❌ DATABASE_URL not found");
        process.exit(1);
    }

    const sql = postgres(DB_URL);

    try {
        const [{ exists }] = await sql<{ exists: boolean }[]>`
            SELECT to_regclass('public.staff') IS NOT NULL AS exists
        `;
        if (!exists) {
            console.log("✅ staff table already dropped — nothing to do.");
            return;
        }

        // Preview coverage per table (works in both modes). A row is
        // "unmapped" when its staff_id has no employee with the same name.
        for (const table of TABLES) {
            const [{ total }] = await sql.unsafe<{ total: number }[]>(
                `SELECT count(*)::int AS total FROM "${table}"`,
            );
            const [{ unmapped }] = await sql.unsafe<{ unmapped: number }[]>(
                `SELECT count(*)::int AS unmapped
                 FROM "${table}" x
                 JOIN staff s ON s.id = x.staff_id
                 LEFT JOIN employee e ON e.name = s.name
                 WHERE e.id IS NULL`,
            );
            console.log(
                `   ${table.padEnd(16)} rows: ${total}, unmapped staff_id: ${unmapped}`,
            );
            if (unmapped > 0 && !DRY_RUN) {
                throw new Error(
                    `${table} has ${unmapped} row(s) with no employee matched by name — aborting before any writes.`,
                );
            }
        }

        if (DRY_RUN) {
            console.log("\n🧪 Dry run — no database writes.");
            return;
        }

        await sql.begin(async tx => {
            for (const table of TABLES) {
                // 1. Add the new column (nullable for the backfill).
                await tx.unsafe(
                    `ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "employee_id" uuid`,
                );

                // 2. Backfill employee_id via the staff.name = employee.name join.
                await tx.unsafe(
                    `UPDATE "${table}" AS x
                     SET employee_id = e.id
                     FROM staff s
                     JOIN employee e ON e.name = s.name
                     WHERE x.staff_id = s.id`,
                );

                // 3. Guard: refuse to continue if anything is still unmapped.
                const [{ cnt }] = await tx.unsafe<{ cnt: number }[]>(
                    `SELECT count(*)::int AS cnt FROM "${table}" WHERE employee_id IS NULL`,
                );
                if (cnt > 0) {
                    throw new Error(
                        `${table}: ${cnt} row(s) with NULL employee_id after backfill — aborting.`,
                    );
                }

                // 4. FK -> employee, then enforce NOT NULL.
                await tx.unsafe(
                    `ALTER TABLE "${table}" ADD CONSTRAINT "${table}_employee_id_employee_id_fk" ` +
                        `FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE cascade`,
                );
                await tx.unsafe(
                    `ALTER TABLE "${table}" ALTER COLUMN "employee_id" SET NOT NULL`,
                );

                // 5. Drop the old staff_id column (its FK drops with it).
                await tx.unsafe(
                    `ALTER TABLE "${table}" DROP COLUMN "staff_id"`,
                );

                console.log(`   ✓ repointed ${table}`);
            }

            // Swap the time_sheet dedupe unique index onto employee_id.
            await tx.unsafe(
                `DROP INDEX IF EXISTS "unique_staff_target_shift_date"`,
            );
            await tx.unsafe(
                `CREATE UNIQUE INDEX IF NOT EXISTS "unique_employee_target_shift_date" ` +
                    `ON "time_sheet" ("employee_id","target_shift_id","date","check_in")`,
            );
            console.log("   ✓ swapped time_sheet unique index -> employee_id");

            // Finally drop the staff table (no inbound FKs remain).
            await tx.unsafe(`DROP TABLE "staff"`);
            console.log("   ✓ dropped staff table");
        });

        console.log(
            "\n✅ Cutover complete. Run `npx drizzle-kit push` to confirm the schema is in sync.",
        );
    } catch (error) {
        console.error(
            "❌ Cutover failed (transaction rolled back, staff_id preserved):",
            error instanceof Error ? error.message : error,
        );
        process.exit(1);
    } finally {
        await sql.end();
    }
};

main();
