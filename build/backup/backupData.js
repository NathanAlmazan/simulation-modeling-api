"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg = __importStar(require("pg"));
const fastcsv = __importStar(require("fast-csv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Pool = pg.Pool;
const client = new Pool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT)
});
function CreateBackup() {
    client.connect((err, client, done) => {
        if (err)
            throw new Error(err.message);
    });
    const sqlQuery = [
        { query: `SELECT * FROM "public"."OrderWithProduct" INNER JOIN "public"."Order" ON id=order_id`, name: "Order" },
        { query: `SELECT * FROM "public"."Transaction"`, name: "Transaction" },
        { query: `SELECT * FROM "public"."PurcahseWithProduct" INNER JOIN "public"."Purchase" ON id=purchase_id`, name: "Purchase" },
        { query: `SELECT * FROM "public"."Payables"`, name: "Payables" },
        { query: `SELECT * FROM "public"."Customer"`, name: "Customer" },
        { query: `SELECT * FROM "public"."ProductDetails" INNER JOIN "public"."Product" ON "Product"."id"="ProductDetails"."product_id";`, name: "Product" },
        { query: `SELECT * FROM "public"."Product" INNER JOIN "public"."Category" ON "Category"."id"="Product"."category_id"`, name: "Category" },
        { query: `SELECT * FROM "public"."Supplier"`, name: "Supplier" },
        { query: `SELECT * FROM "public"."Employee"`, name: "Employee" },
        { query: `SELECT * FROM "public"."Account"`, name: "Account" }
    ];
    for (let i = 0; i < sqlQuery.length; i++) {
        const currQuery = sqlQuery[i].query;
        const currTable = sqlQuery[i].name;
        const backupDIR = path_1.default.join(__dirname, '..', 'media', 'backups', currTable, 'backupFile.csv');
        try {
            fs_1.default.unlinkSync(backupDIR);
        }
        catch (err) {
            console.log("Error occured while deleting prior backups.");
        }
        const ws = fs_1.default.createWriteStream(backupDIR);
        client.query(currQuery, (err, res) => {
            if (err) {
                console.log(err.message);
            }
            if (res) {
                const jsonData = JSON.parse(JSON.stringify(res.rows));
                fastcsv.write(jsonData, { headers: true }).on("finish", function () {
                    console.log(`Postgres table ${currTable} exported to CSV file successfully.`);
                }).pipe(ws);
            }
        });
    }
}
exports.default = CreateBackup;
//# sourceMappingURL=backupData.js.map