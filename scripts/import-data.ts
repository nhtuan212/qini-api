// 📄 scripts/import-data.ts
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import fs from "fs";
import path from "path";
import * as schema from "../src/db/schema";

/**
 * Usage:
 * npx tsx scripts/import-data.ts all
 * npx tsx scripts/import-data.ts <table_name>
 */

const TABLES_TO_IMPORT = [
    { table: schema.userTable, name: "users" },
    { table: schema.staffTable, name: "staff" },
    { table: schema.shiftTable, name: "shifts" },
    { table: schema.targetTable, name: "targets" },
    { table: schema.targetShiftTable, name: "target_shifts" },
    { table: schema.timeSheetTable, name: "time_sheets" },
    { table: schema.salaryTable, name: "salary" },
] as const;

const BACKUP_DIR = "backup";
const DB_URL = process.env.DATABASE_URL;

type Sql = ReturnType<typeof postgres>;

const fmtDate = (v: unknown) =>
    v instanceof Date
        ? v.toISOString().slice(0, 10)
        : String(v).slice(0, 10);

const loadBackup = (tableName: string) => {
    const filePath = path.join(BACKUP_DIR, `${tableName}.json`);

    if (!fs.existsSync(filePath)) {
        throw new Error(`Backup file not found: ${filePath}`);
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return Array.isArray(data) ? data : [];
};

const logProgress = (done: number, total: number) => {
    if (total <= 10) return;
    const progress = ((done / total) * 100).toFixed(1);
    process.stdout.write(`\r⏳ Progress: ${progress}% (${done}/${total})`);
};

/**
 * The target DB may have auto-created its own `target` rows for the same
 * dates as the backup (unique constraint on target_at, different uuids).
 * Those backup rows are skipped by onConflictDoNothing, so every backup
 * uuid that is absent from the DB must be remapped to the DB uuid that
 * owns the same target_at date.
 */
const buildTargetRemap = async (sql: Sql) => {
    const targetsBackup = loadBackup("targets");
    const dbTargets = await sql`select id, target_at from target`;
    const dbIds = new Set(dbTargets.map(r => r.id));
    const dbIdByDate = new Map(
        dbTargets.map(r => [fmtDate(r.target_at), r.id]),
    );

    const remap = new Map<string, string>();
    for (const t of targetsBackup) {
        if (dbIds.has(t.id)) continue;
        const dbId = dbIdByDate.get(fmtDate(t.targetAt));
        if (dbId) remap.set(t.id, dbId);
    }
    return remap;
};

/**
 * Backup target_shift id -> DB target_shift id, for backup rows whose
 * (target, shift) pair already exists in the DB under a different uuid.
 * Only valid after target_shifts have been imported.
 */
const buildTargetShiftRemap = async (sql: Sql) => {
    const tsBackup = loadBackup("target_shifts");
    const targetRemap = await buildTargetRemap(sql);
    const dbTs = await sql`select id, target_id, shift_id from target_shift`;
    const dbIds = new Set(dbTs.map(r => r.id));
    const dbIdByPair = new Map(
        dbTs.map(r => [`${r.target_id}|${r.shift_id}`, r.id]),
    );

    const remap = new Map<string, string>();
    for (const r of tsBackup) {
        if (dbIds.has(r.id)) continue;
        const targetId = targetRemap.get(r.targetId) ?? r.targetId;
        const dbId = dbIdByPair.get(`${targetId}|${r.shiftId}`);
        if (dbId) remap.set(r.id, dbId);
    }
    return remap;
};

const importTargetShifts = async (sql: Sql) => {
    console.log("📊 Importing target_shifts...");

    const data = loadBackup("target_shifts");
    if (data.length === 0) {
        console.log("⚠️ target_shifts: No data to import");
        return 0;
    }

    const targetRemap = await buildTargetRemap(sql);
    const dbTs = await sql`select id, target_id, shift_id from target_shift`;
    const dbIds = new Set(dbTs.map(r => r.id));
    const dbIdByPair = new Map(
        dbTs.map(r => [`${r.target_id}|${r.shift_id}`, r.id]),
    );

    const toInsert: Record<string, unknown>[] = [];
    const toUpdate: { dbId: string; row: any }[] = [];
    let skipped = 0;

    for (const r of data) {
        if (dbIds.has(r.id)) {
            skipped++;
            continue;
        }
        const targetId = targetRemap.get(r.targetId) ?? r.targetId;
        const dbId = dbIdByPair.get(`${targetId}|${r.shiftId}`);
        if (dbId) {
            // Same (target, shift) pair already exists under another uuid:
            // update it in place so DB children keep their foreign keys.
            toUpdate.push({ dbId, row: r });
        } else {
            toInsert.push({
                id: r.id,
                target_id: targetId,
                shift_id: r.shiftId,
                cash: r.cash,
                transfer: r.transfer,
                point: r.point,
                deduction: r.deduction,
                revenue: r.revenue,
                description: r.description,
                is_collect_money: r.isCollectMoney,
                created_at: r.createdAt,
                updated_at: r.updatedAt,
            });
        }
    }

    const BATCH_SIZE = 50;
    let imported = 0;

    for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
        const batch = toInsert.slice(i, i + BATCH_SIZE);
        await sql`insert into target_shift ${sql(batch)} on conflict do nothing`;
        imported += batch.length;
        logProgress(imported, toInsert.length);
    }
    if (toInsert.length > 10) console.log();

    for (const { dbId, row } of toUpdate) {
        await sql`update target_shift set
            cash = ${row.cash},
            transfer = ${row.transfer},
            point = ${row.point},
            deduction = ${row.deduction},
            revenue = ${row.revenue},
            description = ${row.description},
            is_collect_money = ${row.isCollectMoney},
            updated_at = ${row.updatedAt ?? row.createdAt}
            where id = ${dbId}`;
    }

    console.log(
        `✅ target_shifts: ${imported} inserted, ${toUpdate.length} updated in place, ${skipped} already present`,
    );
    return imported + toUpdate.length;
};

const importTimeSheets = async (sql: Sql) => {
    console.log("📊 Importing time_sheets...");

    const data = loadBackup("time_sheets");
    if (data.length === 0) {
        console.log("⚠️ time_sheets: No data to import");
        return 0;
    }

    const tsRemap = await buildTargetShiftRemap(sql);

    const rows = data.map((s: any) => ({
        id: s.id,
        target_shift_id: tsRemap.get(s.targetShiftId) ?? s.targetShiftId,
        staff_id: s.staffId,
        check_in: s.checkIn,
        check_out: s.checkOut,
        working_hours: s.workingHours,
        date: s.date,
        created_at: s.createdAt,
        updated_at: s.updatedAt,
    }));

    const BATCH_SIZE = 50;
    let imported = 0;

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const batch = rows.slice(i, i + BATCH_SIZE);
        await sql`insert into time_sheet ${sql(batch)} on conflict do nothing`;
        imported += batch.length;
        logProgress(imported, rows.length);
    }
    if (rows.length > 10) console.log();

    console.log(`✅ time_sheets: ${imported} records imported`);
    return imported;
};

// ✅ Helper functions
const importSingleTable = async (
    db: ReturnType<typeof drizzle>,
    sql: Sql,
    tableName: string,
    tableSchema?: any,
) => {
    // Tables whose backup uuids can collide with rows the DB created on
    // its own need remap-aware imports instead of plain inserts.
    if (tableName === "target_shifts") return importTargetShifts(sql);
    if (tableName === "time_sheets") return importTimeSheets(sql);

    // Find table schema if not provided
    if (!tableSchema) {
        const tableConfig = TABLES_TO_IMPORT.find(t => t.name === tableName);
        if (!tableConfig) {
            const availableTables = TABLES_TO_IMPORT.map(t => t.name).join(
                ", ",
            );
            throw new Error(
                `Table ${tableName} not found. Available: ${availableTables}`,
            );
        }
        tableSchema = tableConfig.table;
    }

    console.log(`📊 Importing ${tableName}...`);

    const data = loadBackup(tableName);

    if (data.length === 0) {
        console.log(`⚠️ ${tableName}: No data to import`);
        return 0;
    }

    // Import data in batches
    const BATCH_SIZE = 10;
    let imported = 0;
    let failed = 0;

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = data.slice(i, i + BATCH_SIZE);

        try {
            await db.insert(tableSchema).values(batch).onConflictDoNothing();
            imported += batch.length;
        } catch {
            // One bad row must not abort the whole table: retry row by row.
            for (const row of batch) {
                try {
                    await db
                        .insert(tableSchema)
                        .values(row)
                        .onConflictDoNothing();
                    imported++;
                } catch (rowError: any) {
                    failed++;
                    console.error(
                        `\n⚠️ ${tableName}: skipped row id=${row.id}: ${
                            rowError.message?.split("\n")[0] ?? rowError
                        }`,
                    );
                }
            }
        }

        logProgress(Math.min(i + BATCH_SIZE, data.length), data.length);
    }

    if (data.length > 10) console.log(); // New line after progress

    console.log(
        `✅ ${tableName}: ${imported} records imported` +
            (failed ? `, ${failed} rows skipped` : ""),
    );
    return imported;
};

const importAllTables = async (db: ReturnType<typeof drizzle>, sql: Sql) => {
    console.log("📥 Importing all tables...");

    const results: Record<string, number> = {};

    for (const { table, name } of TABLES_TO_IMPORT) {
        try {
            const count = await importSingleTable(db, sql, name, table);
            results[name] = count;
        } catch (error) {
            console.error(
                `❌ Failed to import ${name}:`,
                error.message || error,
            );
            results[name] = -1;
        }
    }

    return results;
};

const importData = async () => {
    if (!DB_URL) {
        console.error("❌ DATABASE_URL not found");
        process.exit(1);
    }

    const client = postgres(DB_URL);
    const db = drizzle(client, { schema });
    const tableName = process.argv[2] || "all";

    try {
        if (tableName === "all") {
            const results = await importAllTables(db, client);

            console.log("\n📋 Import Summary:");
            Object.entries(results).forEach(([table, count]) => {
                const status =
                    count === -1 ? "❌ Failed" : `✅ ${count} records`;
                console.log(`  ${table}: ${status}`);
            });
        } else {
            const count = await importSingleTable(db, client, tableName);
            console.log(`✅ ${tableName}: ${count} records imported`);
        }

        console.log("\n🎉 Import completed!");
    } catch (error) {
        console.error("❌ Import failed:", error.message || error);
        process.exit(1);
    } finally {
        await client.end();
    }
};

importData();
