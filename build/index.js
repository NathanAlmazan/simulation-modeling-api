"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
//routes
const authentication_1 = __importDefault(require("./EmployeeAndAccounts/authentication"));
const productRoute_1 = __importDefault(require("./Products/productRoute"));
const salesOrderRoute_1 = __importDefault(require("./OrdersAndSales/salesOrderRoute"));
const cors_1 = __importDefault(require("cors"));
const purchaseRoute_1 = __importDefault(require("./PurchasedAndPayables/purchaseRoute"));
const backupRoute_1 = __importDefault(require("./backup/backupRoute"));
const statisticsRoute_1 = __importDefault(require("./statistics/statisticsRoute"));
const corsOptions = {
    origin: 'https://inventory-system.vercel.app',
};
//initialized express
const app = (0, express_1.default)();
dotenv_1.default.config(); //get environment variables
const port = process.env.PORT || 4000;
//app body parser middleware
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
//employee and account routes
app.use('/users', authentication_1.default);
//product routes
app.use('/product', productRoute_1.default);
//sales and payment routes
app.use('/sales', salesOrderRoute_1.default);
//purchase route
app.use('/payables', purchaseRoute_1.default);
//backup
app.use('/backup', backupRoute_1.default);
//statistics
app.use('/statistics', statisticsRoute_1.default);
//express listen
app.listen(port, () => {
    console.log("Listening on port ", port);
}).on("error", (err) => {
    console.log("Error", err.message);
});
//# sourceMappingURL=index.js.map