import * as pg from 'pg';
import * as fastcsv from 'fast-csv';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config(); 
const Pool = pg.Pool;
const client = new Pool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT as string)
});

export default function CreateBackup() {

    client.connect((err, client, done) => {
        if (err) throw new Error((err as Error).message);
    })

    const sqlQuery = [
        { query: `SELECT * FROM "public"."OrderWithProduct" INNER JOIN "public"."Order" ON id=order_id`, name: "Order" }, 
        { query: `SELECT * FROM "public"."Transaction"`, name: "Transaction" }, 
        { query: `SELECT * FROM "public"."PurcahseWithProduct" INNER JOIN "public"."Purchase" ON id=purchase_id`, name: "Purchase" }, 
        { query: `SELECT * FROM "public"."Payables"`, name: "Payables" }, 
        { query: `SELECT * FROM "public"."Customer"`, name: "Customer" }, 
        { query: `SELECT * FROM "public"."ProductDetails" INNER JOIN "public"."Product" ON "Product"."id"="ProductDetails"."product_id";`, name: "Product" }, 
        { query: `SELECT * FROM "public"."Product" INNER JOIN "public"."Category" ON "Category"."id"="Product"."category_id"`, name: "Category" }, 
        { query:  `SELECT * FROM "public"."Supplier"`, name: "Supplier" },
        { query:  `SELECT * FROM "public"."Employee"`, name: "Employee" },
        { query:  `SELECT * FROM "public"."Account"`, name: "Account" }
    ];

    for (let i = 0; i < sqlQuery.length; i++) {
        const currQuery = sqlQuery[i].query;
        const currTable = sqlQuery[i].name;
        const backupDIR = path.join(__dirname, '..', 'media', 'backups', currTable, 'backupFile.csv');

        try { 
            fs.unlinkSync(backupDIR);
        } catch (err) {
            console.log("Error occured while deleting prior backups.");
        }

        
        const ws = fs.createWriteStream(backupDIR);

        client.query(currQuery, (err, res) => {
            if (err) {
                console.log((err as Error).message);
            }
    
            if (res) {
                const jsonData = JSON.parse(JSON.stringify(res.rows));
                fastcsv.write(jsonData, { headers: true }).on("finish", function() {
                    console.log(`Postgres table ${currTable} exported to CSV file successfully.`);
                }).pipe(ws);
            }
        })

    }
}
