// 📄 scripts/export-data.ts
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import fs from "fs";
import path from "path";
import * as schema from "../src/db/schema";

/**
 * Usage:
 * npx tsx scripts/export-data.ts all
 * npx tsx scripts/export-data.ts <table_name>
 */

// ✅ Config tables to export
const TABLES_TO_EXPORT = [
    { table: schema.userTable, name: "users" },
    { table: schema.staffTable, name: "staff" },
    { table: schema.shiftTable, name: "shifts" },
    { table: schema.targetTable, name: "targets" },
    { table: schema.targetShiftTable, name: "target_shifts" },
    { table: schema.timeSheetTable, name: "time_sheets" },
];

const BACKUP_DIR = "backup";

const DB_URL = process.env.DATABASE_URL;

// ✅ Helper functions
const ensureBackupDir = () => {
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
};

const exportAllTables = async (db: ReturnType<typeof drizzle>) => {
    console.log("📤 Starting data export...");
    ensureBackupDir();

    const results: Record<string, number> = {};

    for (const { table, name } of TABLES_TO_EXPORT) {
        try {
            console.log(`📊 Exporting ${name}...`);

            const data = await db.select().from(table);
            const filePath = path.join(BACKUP_DIR, `${name}.json`);

            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            results[name] = data.length;

            console.log(`✅ ${name}: ${data.length} records`);
        } catch (error) {
            console.error(
                `❌ Failed to export ${name}:`,
                error.message || error,
            );
            results[name] = -1;
        }
    }

    return results;
};

const exportSingleTable = async (
    db: ReturnType<typeof drizzle>,
    tableName: string,
) => {
    const tableConfig = TABLES_TO_EXPORT.find(t => t.name === tableName);
    if (!tableConfig) {
        const availableTables = TABLES_TO_EXPORT.map(t => t.name).join(", ");
        throw new Error(
            `Table ${tableName} not found. Available: ${availableTables}`,
        );
    }

    ensureBackupDir();

    console.log(`📊 Exporting ${tableName}...`);
    const data = await db.select().from(tableConfig.table);

    const filePath = path.join(BACKUP_DIR, `${tableName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log(`✅ ${tableName}: ${data.length} records exported`);
    return data.length;
};

const exportData = async () => {
    if (!DB_URL) {
        console.error("❌ DATABASE_URL not found");
        process.exit(1);
    }

    const client = postgres(DB_URL);
    const db = drizzle(client, { schema });
    const tableName = process.argv[2] || "all";

    try {
        if (tableName === "all") {
            const results = await exportAllTables(db);

            console.log("\n📋 Export Summary:");
            Object.entries(results).forEach(([table, count]) => {
                const status =
                    count === -1 ? "❌ Failed" : `✅ ${count} records`;
                console.log(`  ${table}: ${status}`);
            });
        } else {
            const count = await exportSingleTable(db, tableName);
            console.log(`✅ ${tableName}: ${count} records exported`);
        }

        console.log(`\n🎉 Export completed! Files saved in ./${BACKUP_DIR}/`);
    } catch (error) {
        console.error("❌ Export failed:", error.message || error);
        process.exit(1);
    } finally {
        await client.end();
    }
};

exportData();
