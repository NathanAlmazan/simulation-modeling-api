"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const graphql_1 = require("graphql");
const path_1 = __importDefault(require("path"));
const authentication_1 = require("../EmployeeAndAccounts/authentication");
const rootQueryMutations_1 = require("./rootQueryMutations");
const salesOrderClass_1 = require("./salesOrderClass");
let salesOrderRoute = express_1.default.Router();
const Schema = new graphql_1.GraphQLSchema({
    query: rootQueryMutations_1.RootQuery,
    mutation: rootQueryMutations_1.RootMutation
});
const paymentTypes = ["Credit", "Cheque", "Cash"];
const UnAuthorized = ["Warehouse Staff", "Delivery Personnel", "Sales Agent"];
//add order
salesOrderRoute.post('/addOrder', authentication_1.checkCredentials, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newOrder = req.body.order;
    const orderProducts = req.body.products;
    //check request body
    if (!newOrder || !orderProducts || orderProducts.length == 0)
        return res.status(400).json({ error: "Sales Order and Products are required." });
    if (!paymentTypes.includes(newOrder.payment_type))
        return res.status(400).json({ error: "Invalid payment type." });
    if (newOrder.payment_type == "Credit" && newOrder.terms == null)
        return res.status(400).json({ error: "Credit type of payment should include terms" });
    //initialized class
    const addOrder = new salesOrderClass_1.SalesOrder();
    const orderAdded = yield addOrder.addNewOrder(newOrder, orderProducts);
    if (!(orderAdded === null || orderAdded === void 0 ? void 0 : orderAdded.status) || !orderAdded)
        return res.status(400).json({ error: orderAdded.message });
    //good request
    return res.status(201).json({ data: orderAdded.data });
}));
//add products to order
salesOrderRoute.post('/add-order-products', authentication_1.checkCredentials, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderProducts = req.body.products;
    const orderId = req.body.orderId;
    //request body validation
    if (!orderId || !orderProducts || orderProducts.length == 0)
        return res.status(400).json({ error: "Order id and Products are required." });
    //initialized class
    const updateOrder = new salesOrderClass_1.SalesOrder();
    const addedProducts = yield updateOrder.addProductsToOrder(orderId, orderProducts);
    if (!(addedProducts === null || addedProducts === void 0 ? void 0 : addedProducts.status) || !addedProducts)
        return res.status(400).json({ error: addedProducts.message });
    //good request
    return res.status(201).json({ data: addedProducts.data });
}));
;
//update the vat and discount of order
salesOrderRoute.post('/update-order', authentication_1.checkCredentials, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (UnAuthorized.includes(req.user.position))
        throw new Error("Unauthorized");
    const updateBody = req.body.updates;
    const updateProducts = req.body.products;
    if (!updateBody)
        return res.status(400).json({ error: "Null request body." });
    const updateOrder = new salesOrderClass_1.SalesOrder();
    const updatedOrder = yield updateOrder.updateOrder(updateBody, updateProducts);
    if (!updatedOrder || !updatedOrder.status)
        return res.status(400).json({ error: updatedOrder.message });
    return res.status(201).json({ data: updatedOrder.data });
}));
//Hold an order
salesOrderRoute.get('/hold-order/:orderId', authentication_1.checkCredentials, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (UnAuthorized.includes(req.user.position))
        throw new Error("Unauthorized");
    const orderId = parseInt(req.params.orderId);
    if (!orderId)
        return res.status(400).json({ error: "Order id is required." });
    const onHoldOrder = yield (0, salesOrderClass_1.holdOrder)(orderId);
    if (!onHoldOrder || !onHoldOrder.status)
        return res.status(400).json({ error: onHoldOrder.message });
    return res.status(201).json({ data: onHoldOrder.data });
}));
salesOrderRoute.post('/return-order', authentication_1.checkCredentials, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (UnAuthorized.includes(req.user.position))
        throw new Error("Unauthorized");
    const orderId = parseInt(req.body.orderId);
    const orderProducts = req.body.products;
    if (!orderId || !orderProducts || orderProducts.length == 0)
        return res.status(400).json({ error: "Order id and returning products are required." });
    const onReturnOrder = yield (0, salesOrderClass_1.returnOrder)(orderId, orderProducts);
    if (!onReturnOrder || !onReturnOrder.status)
        return res.status(400).json({ error: onReturnOrder.message });
    return res.status(201).json({ data: onReturnOrder.data });
}));
salesOrderRoute.get('/restore-order/:orderId', authentication_1.checkCredentials, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (UnAuthorized.includes(req.user.position))
        throw new Error("Unauthorized");
    const orderId = parseInt(req.params.orderId);
    if (!orderId)
        return res.status(400).json({ error: "Order id is required." });
    const onOrderRestore = yield (0, salesOrderClass_1.restoreOrder)(orderId);
    if (!onOrderRestore || !onOrderRestore.status)
        return res.status(400).json({ error: onOrderRestore.message });
    return res.status(201).json({ data: onOrderRestore.data });
}));
salesOrderRoute.get('/delete-order/:orderId', authentication_1.checkCredentials, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (UnAuthorized.includes(req.user.position))
        throw new Error("Unauthorized");
    const orderId = parseInt(req.params.orderId);
    if (!orderId)
        return res.status(400).json({ error: "Order id is required." });
    const deletedOrder = yield (0, salesOrderClass_1.deleteOrder)(orderId);
    if (!deletedOrder || !deletedOrder.status)
        return res.status(400).json({ error: deletedOrder.message });
    return res.status(201).json({ data: deletedOrder.data });
}));
salesOrderRoute.get("/delivered-order/:id", authentication_1.checkCredentials, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = parseInt(req.params.id);
    if (isNaN(orderId))
        return res.status(400).json({ error: "Invalid Order ID." });
    const deliveredOrder = yield (0, salesOrderClass_1.setDelivered)(orderId);
    if (!deliveredOrder || !deliveredOrder.status)
        return res.status(400).json({ error: deliveredOrder.message });
    return res.status(201).json({ data: deliveredOrder.message });
}));
//add transaction
salesOrderRoute.post('/add-payment', authentication_1.checkCredentials, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (UnAuthorized.includes(req.user.position))
        throw new Error("Unauthorized");
    const paymentDetails = req.body.transaction;
    const addedTransaction = yield (0, salesOrderClass_1.addTransaction)(paymentDetails);
    if (!addedTransaction || !addedTransaction.status)
        return res.status(400).json({ error: addedTransaction.message });
    return res.status(201).json({ data: addedTransaction.data });
}));
salesOrderRoute.post('/update-payment', authentication_1.checkCredentials, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (UnAuthorized.includes(req.user.position))
        throw new Error("Unauthorized");
    const paymentDetails = req.body.transaction;
    const updatedTransaction = yield (0, salesOrderClass_1.updateTransaction)(paymentDetails);
    if (!updatedTransaction || !updatedTransaction.status)
        return res.status(400).json({ error: updatedTransaction.message });
    return res.status(201).json({ data: updatedTransaction.data });
}));
salesOrderRoute.get('/generate-invoice/:orderId', authentication_1.checkCredentials, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = parseInt(req.params.orderId);
    if (!orderId || orderId == 0)
        return res.status(400).json({ error: "Order ID is required." });
    const response = yield (0, salesOrderClass_1.generateInvoicePDF)(orderId);
    if (!response || response.status == false)
        return res.status(400).json({ error: response.message });
    return res.status(201).json({ data: response.message });
}));
salesOrderRoute.get('/generate-receipt/:orderId', authentication_1.checkCredentials, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = parseInt(req.params.orderId);
    if (!orderId || orderId == 0)
        return res.status(400).json({ error: "Order ID is required." });
    const response = yield (0, salesOrderClass_1.generateReceiptPDF)(orderId);
    if (!response || response.status == false)
        return res.status(400).json({ error: response.message });
    return res.status(201).json({ data: response.message });
}));
salesOrderRoute.get('/get-invoice/:orderId', authentication_1.checkCredentials, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = parseInt(req.params.orderId);
    if (!orderId || orderId == 0)
        return res.status(400).json({ error: "Order ID is required." });
    const response = yield (0, salesOrderClass_1.getInvoicePDF)(orderId);
    if (!response || response.status == false)
        return res.status(400).json({ error: response.message });
    return res.status(201).json({ data: response.message });
}));
salesOrderRoute.get('/get-receipt/:orderId', authentication_1.checkCredentials, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = parseInt(req.params.orderId);
    if (!orderId || orderId == 0)
        return res.status(400).json({ error: "Order ID is required." });
    const response = yield (0, salesOrderClass_1.getReceiptPDF)(orderId);
    if (!response || response.status == false)
        return res.status(400).json({ error: response.message });
    return res.status(201).json({ data: response.message });
}));
const mediaDIR = path_1.default.join(__dirname, '..', 'media', 'invoices');
const receiptDIR = path_1.default.join(__dirname, '..', 'media', 'receipts');
salesOrderRoute.use('/invoices', express_1.default.static(mediaDIR));
salesOrderRoute.use('/receipts', express_1.default.static(receiptDIR));
salesOrderRoute.use('/graphql', authentication_1.checkCredentials, (0, express_graphql_1.graphqlHTTP)(req => ({
    schema: Schema,
    context: req.user,
    graphql: false
})));
exports.default = salesOrderRoute;
//# sourceMappingURL=salesOrderRoute.js.map