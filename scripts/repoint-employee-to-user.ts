// 📄 scripts/repoint-employee-to-user.ts
import "dotenv/config";
import postgres from "postgres";

/**
 * Repoint time_sheet / salary / work_assignment from employee_id -> user_id.
 *
 * The person a timesheet/salary/work-assignment belongs to is now referenced by
 * user.id (the identity carried in the JWT), not employee.id. `employee` stays
 * as a 1-1 HR detail table of user (salary/hours/name); it just stops being the
 * FK target of the operational tables.
 *
 * Backfill is exact: user_id = employee.user_id joined via the existing
 * employee_id (both are NOT NULL FKs, so coverage is 100%).
 *
 * Everything runs in ONE transaction. If any row is left with a NULL user_id it
 * rolls back and employee_id is preserved.
 *
 * Per table: add user_id (nullable) -> backfill -> verify no NULLs -> add FK ->
 * SET NOT NULL -> drop employee_id. Then swap the time_sheet unique index.
 * The `employee` table is NOT dropped.
 *
 * Run BEFORE `drizzle-kit push`; afterwards the DB matches the committed schema.
 *
 * Usage:
 *   npx tsx scripts/repoint-employee-to-user.ts --dry-run
 *   npx tsx scripts/repoint-employee-to-user.ts
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
        // Idempotency: if employee_id is already gone, there's nothing to do.
        const [{ has_col }] = await sql<{ has_col: boolean }[]>`
            SELECT EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_name = 'time_sheet' AND column_name = 'employee_id'
            ) AS has_col
        `;
        if (!has_col) {
            console.log(
                "✅ time_sheet.employee_id already gone — nothing to do.",
            );
            return;
        }

        // Coverage preview (both modes).
        for (const table of TABLES) {
            const [{ total }] = await sql.unsafe<{ total: number }[]>(
                `SELECT count(*)::int AS total FROM "${table}"`,
            );
            const [{ unmapped }] = await sql.unsafe<{ unmapped: number }[]>(
                `SELECT count(*)::int AS unmapped
                 FROM "${table}" x
                 LEFT JOIN employee e ON e.id = x.employee_id
                 WHERE e.user_id IS NULL`,
            );
            console.log(
                `   ${table.padEnd(16)} rows: ${total}, unmapped: ${unmapped}`,
            );
            if (unmapped > 0 && !DRY_RUN) {
                throw new Error(
                    `${table}: ${unmapped} row(s) whose employee_id has no employee.user_id — aborting.`,
                );
            }
        }

        if (DRY_RUN) {
            console.log("\n🧪 Dry run — no database writes.");
            return;
        }

        await sql.begin(async tx => {
            for (const table of TABLES) {
                await tx.unsafe(
                    `ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "user_id" uuid`,
                );
                await tx.unsafe(
                    `UPDATE "${table}" AS x
                     SET user_id = e.user_id
                     FROM employee e
                     WHERE e.id = x.employee_id`,
                );
                const [{ cnt }] = await tx.unsafe<{ cnt: number }[]>(
                    `SELECT count(*)::int AS cnt FROM "${table}" WHERE user_id IS NULL`,
                );
                if (cnt > 0) {
                    throw new Error(
                        `${table}: ${cnt} row(s) with NULL user_id after backfill — aborting.`,
                    );
                }
                await tx.unsafe(
                    `ALTER TABLE "${table}" ADD CONSTRAINT "${table}_user_id_user_id_fk" ` +
                        `FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade`,
                );
                await tx.unsafe(
                    `ALTER TABLE "${table}" ALTER COLUMN "user_id" SET NOT NULL`,
                );
                await tx.unsafe(
                    `ALTER TABLE "${table}" DROP COLUMN "employee_id"`,
                );
                console.log(`   ✓ repointed ${table}`);
            }

            // Swap the time_sheet dedupe unique index onto user_id.
            await tx.unsafe(
                `DROP INDEX IF EXISTS "unique_employee_target_shift_date"`,
            );
            await tx.unsafe(
                `CREATE UNIQUE INDEX IF NOT EXISTS "unique_user_target_shift_date" ` +
                    `ON "time_sheet" ("user_id","target_shift_id","date","check_in")`,
            );
            console.log("   ✓ swapped time_sheet unique index -> user_id");
        });

        console.log(
            "\n✅ Repoint complete. Run `npx drizzle-kit push` to confirm the schema is in sync.",
        );
    } catch (error) {
        console.error(
            "❌ Repoint failed (transaction rolled back, employee_id preserved):",
            error instanceof Error ? error.message : error,
        );
        process.exit(1);
    } finally {
        await sql.end();
    }
};

main();
