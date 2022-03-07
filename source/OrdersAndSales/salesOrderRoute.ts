import express, { response } from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLSchema } from "graphql";
import path from "path";
import { checkCredentials } from "../EmployeeAndAccounts/authentication";
import { RootMutation, RootQuery } from "./rootQueryMutations";
import { addTransaction, 
    deleteOrder, 
    generateInvoicePDF,
    generateReceiptPDF,
    getReceiptPDF,
    getInvoicePDF, 
    holdOrder, 
    NewOrderInterface, 
    OrderProducts, 
    restoreOrder, 
    returnOrder, 
    SalesOrder, 
    UpdateOrderInterface,
    setDelivered,
    updateTransaction
} from "./salesOrderClass";

let salesOrderRoute = express.Router();

const Schema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
})

const paymentTypes = ["Credit", "Cheque", "Cash"];
const UnAuthorized = ["Warehouse Staff", "Delivery Personnel", "Sales Agent"];

//add order
salesOrderRoute.post('/addOrder', checkCredentials, async (req, res) => {
    const newOrder: NewOrderInterface | null = req.body.order;
    const orderProducts: OrderProducts[] | null = req.body.products;

    //check request body
    if (!newOrder || !orderProducts || orderProducts.length == 0) return res.status(400).json({ error: "Sales Order and Products are required." });
    if (!paymentTypes.includes(newOrder.payment_type)) return res.status(400).json({ error: "Invalid payment type." });
    if (newOrder.payment_type == "Credit" && newOrder.terms == null) return res.status(400).json({ error: "Credit type of payment should include terms" });
    
    //initialized class
    const addOrder = new SalesOrder();
    const orderAdded = await addOrder.addNewOrder(newOrder, orderProducts);
    if (!orderAdded?.status || !orderAdded) return res.status(400).json({ error: orderAdded.message });

    //good request
    return res.status(201).json({ data: orderAdded.data });
    
})

//add products to order
salesOrderRoute.post('/add-order-products', checkCredentials, async (req, res) => {
    const orderProducts: OrderProducts[] | null = req.body.products;
    const orderId: number = req.body.orderId;

    //request body validation
    if (!orderId || !orderProducts || orderProducts.length == 0) return res.status(400).json({ error: "Order id and Products are required." });

    //initialized class
    const updateOrder = new SalesOrder();
    const addedProducts = await updateOrder.addProductsToOrder(orderId, orderProducts);
    if (!addedProducts?.status || !addedProducts) return res.status(400).json({ error: addedProducts.message });

    //good request
    return res.status(201).json({ data: addedProducts.data });

})

interface TokenInterface {
    userId: number;
    username: string;
    position: string;
    iat: number;
    exp: number;
};

//update the vat and discount of order
salesOrderRoute.post('/update-order', checkCredentials, async (req, res) => {
    if (UnAuthorized.includes((req.user as TokenInterface).position)) throw new Error("Unauthorized");

    const updateBody: UpdateOrderInterface = req.body.updates;
    const updateProducts: OrderProducts[] = req.body.products;
    if (!updateBody) return res.status(400).json({ error: "Null request body." });

    const updateOrder = new SalesOrder();
    const updatedOrder = await updateOrder.updateOrder(updateBody, updateProducts);
    if (!updatedOrder || !updatedOrder.status) return res.status(400).json({ error: updatedOrder.message });

    return res.status(201).json({ data: updatedOrder.data });

})

//Hold an order
salesOrderRoute.get('/hold-order/:orderId', checkCredentials, async (req, res) => {
    if (UnAuthorized.includes((req.user as TokenInterface).position)) throw new Error("Unauthorized");

    const orderId: number = parseInt(req.params.orderId);

    if (!orderId) return res.status(400).json({ error: "Order id is required." });

    const onHoldOrder = await holdOrder(orderId);
    if (!onHoldOrder || !onHoldOrder.status) return res.status(400).json({ error: onHoldOrder.message });

    return res.status(201).json({ data: onHoldOrder.data });
})

salesOrderRoute.post('/return-order', checkCredentials, async (req, res) => {
    if (UnAuthorized.includes((req.user as TokenInterface).position)) throw new Error("Unauthorized");

    const orderId: number = parseInt(req.body.orderId);
    const orderProducts: OrderProducts[] = req.body.products;

    if (!orderId || !orderProducts || orderProducts.length == 0) return res.status(400).json({ error: "Order id and returning products are required." });

    const onReturnOrder = await returnOrder(orderId, orderProducts);
    if (!onReturnOrder || !onReturnOrder.status) return res.status(400).json({ error: onReturnOrder.message });

    return res.status(201).json({ data: onReturnOrder.data });
})

salesOrderRoute.get('/restore-order/:orderId', checkCredentials, async (req, res) => {
    if (UnAuthorized.includes((req.user as TokenInterface).position)) throw new Error("Unauthorized");

    const orderId: number = parseInt(req.params.orderId);

    if (!orderId) return res.status(400).json({ error: "Order id is required." });

    const onOrderRestore = await restoreOrder(orderId);
    if (!onOrderRestore || !onOrderRestore.status) return res.status(400).json({ error: onOrderRestore.message });

    return res.status(201).json({ data: onOrderRestore.data });
})

salesOrderRoute.get('/delete-order/:orderId', checkCredentials, async (req, res) => {
    if (UnAuthorized.includes((req.user as TokenInterface).position)) throw new Error("Unauthorized");

    const orderId: number = parseInt(req.params.orderId);

    if (!orderId) return res.status(400).json({ error: "Order id is required." });
    const deletedOrder = await deleteOrder(orderId);
    if (!deletedOrder || !deletedOrder.status) return res.status(400).json({ error: deletedOrder.message });

    return res.status(201).json({ data: deletedOrder.data });
})

salesOrderRoute.get("/delivered-order/:id", checkCredentials, async (req, res) => {
    const orderId = parseInt(req.params.id);
    if (isNaN(orderId)) return res.status(400).json({ error: "Invalid Order ID." });

    const deliveredOrder = await setDelivered(orderId);
    if (!deliveredOrder || !deliveredOrder.status) return res.status(400).json({ error: deliveredOrder.message });

    return res.status(201).json({ data: deliveredOrder.message });
})

interface Transaction {
    employee_id: number;
    account_id: number;
    order_id: number;
    amount_paid: number;
    payment_date: Date | null;
}


interface UpdateTransaction {
    payment_id: number;
    amount_paid: number;
}

//add transaction
salesOrderRoute.post('/add-payment', checkCredentials, async (req, res) => {
    if (UnAuthorized.includes((req.user as TokenInterface).position)) throw new Error("Unauthorized");

    const paymentDetails: Transaction = req.body.transaction;

    const addedTransaction = await addTransaction(paymentDetails);
    if (!addedTransaction || !addedTransaction.status) return res.status(400).json({ error: addedTransaction.message });

    return res.status(201).json({ data: addedTransaction.data });

})

salesOrderRoute.post('/update-payment', checkCredentials, async (req, res) => {
    if (UnAuthorized.includes((req.user as TokenInterface).position)) throw new Error("Unauthorized");

    const paymentDetails: UpdateTransaction = req.body.transaction;

    const updatedTransaction = await updateTransaction(paymentDetails);
    if (!updatedTransaction || !updatedTransaction.status) return res.status(400).json({ error: updatedTransaction.message });

    return res.status(201).json({ data: updatedTransaction.data });

})

salesOrderRoute.get('/generate-invoice/:orderId', checkCredentials, async (req, res) => {
    const orderId = parseInt(req.params.orderId);

    if (!orderId || orderId == 0) return res.status(400).json({ error: "Order ID is required." });

    const response = await generateInvoicePDF(orderId);
    if (!response || response.status == false) return res.status(400).json({ error: response.message });
    return res.status(201).json({ data: response.message });
});

salesOrderRoute.get('/generate-receipt/:orderId', checkCredentials, async (req, res) => {
    const orderId = parseInt(req.params.orderId);

    if (!orderId || orderId == 0) return res.status(400).json({ error: "Order ID is required." });

    const response = await generateReceiptPDF(orderId);
    if (!response || response.status == false) return res.status(400).json({ error: response.message });
    return res.status(201).json({ data: response.message });
});

salesOrderRoute.get('/get-invoice/:orderId', checkCredentials, async (req, res) => {
    const orderId = parseInt(req.params.orderId);

    if (!orderId || orderId == 0) return res.status(400).json({ error: "Order ID is required." });

    const response = await getInvoicePDF(orderId);
    if (!response || response.status == false) return res.status(400).json({ error: response.message });
    return res.status(201).json({ data: response.message });
});

salesOrderRoute.get('/get-receipt/:orderId', checkCredentials, async (req, res) => {
    const orderId = parseInt(req.params.orderId);

    if (!orderId || orderId == 0) return res.status(400).json({ error: "Order ID is required." });

    const response = await getReceiptPDF(orderId);
    if (!response || response.status == false) return res.status(400).json({ error: response.message });
    return res.status(201).json({ data: response.message });
});

const mediaDIR = path.join(__dirname, '..', 'media', 'invoices');
const receiptDIR = path.join(__dirname, '..', 'media', 'receipts');
salesOrderRoute.use('/invoices', express.static(mediaDIR));
salesOrderRoute.use('/receipts', express.static(receiptDIR));

salesOrderRoute.use('/graphql', checkCredentials, graphqlHTTP(req => ({ 
    schema: Schema,
    context: (req as express.Request).user,
    graphql: false
})));

export default salesOrderRoute;


