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
] as const;

const BACKUP_DIR = "backup";
const DB_URL = process.env.DATABASE_URL;

// ✅ Helper functions
const importSingleTable = async (
    db: ReturnType<typeof drizzle>,
    tableName: string,
    tableSchema?: any,
) => {
    const filePath = path.join(BACKUP_DIR, `${tableName}.json`);

    if (!fs.existsSync(filePath)) {
        throw new Error(`Backup file not found: ${filePath}`);
    }

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

    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (!Array.isArray(data) || data.length === 0) {
        console.log(`⚠️ ${tableName}: No data to import`);
        return 0;
    }

    // Import data in batches
    const BATCH_SIZE = 100;
    let imported = 0;

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = data.slice(i, i + BATCH_SIZE);

        await db.insert(tableSchema).values(batch).onConflictDoNothing();

        imported += batch.length;

        if (data.length > BATCH_SIZE) {
            const progress = (((i + batch.length) / data.length) * 100).toFixed(
                1,
            );
            process.stdout.write(
                `\r⏳ Progress: ${progress}% (${i + batch.length}/${
                    data.length
                })`,
            );
        }
    }

    if (data.length > BATCH_SIZE) {
        console.log(); // New line after progress
    }

    console.log(`✅ ${tableName}: ${imported} records imported`);
    return imported;
};

const importAllTables = async (db: ReturnType<typeof drizzle>) => {
    console.log("📥 Importing all tables...");

    const results: Record<string, number> = {};

    for (const { table, name } of TABLES_TO_IMPORT) {
        try {
            const count = await importSingleTable(db, name, table);
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
            const results = await importAllTables(db);

            console.log("\n📋 Import Summary:");
            Object.entries(results).forEach(([table, count]) => {
                const status =
                    count === -1 ? "❌ Failed" : `✅ ${count} records`;
                console.log(`  ${table}: ${status}`);
            });
        } else {
            const count = await importSingleTable(db, tableName);
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
