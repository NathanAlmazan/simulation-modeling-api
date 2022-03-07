import express from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLSchema } from "graphql";
import multer from "multer";
import path from "path";
import { checkCredentials } from "../EmployeeAndAccounts/authentication";
import { addPayment, ProductArgs, PurchaseArgs, PurchaseModify, PurchaseOrders, updatePayment } from "./PurchaseClass";
import { RootMutation } from "./rootMutation";
import { RootQuery } from "./rootQuery";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebaseStorage from "../firebaseConfig";

let purchaseRoute = express.Router();

const Schema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
});

//initialize multer
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
});

purchaseRoute.post('/record', checkCredentials, async (req, res) => {
    const purchaseInfo: PurchaseArgs | null = req.body.purchaseInfo;
    const purchasedProducts: ProductArgs[] | null = req.body.products;

    if (!purchaseInfo || !purchasedProducts) return res.status(400).json({ error: "Incomplete purchase information." });

    const recordOrder = new PurchaseOrders(purchaseInfo, purchasedProducts);
    const result = await recordOrder.addPurchase();
    if (!result || !result.status) return res.status(400).json({ error: result.message });

    return res.status(201).json({ data: result.data });
});

purchaseRoute.post('/update/:purchaseId', checkCredentials, async (req, res) => {
    const purchaseInfo: PurchaseArgs | null = req.body.purchaseInfo;
    const purchasedProducts: ProductArgs[] | null = req.body.products;
    const purchaseId: number = parseInt(req.params.purchaseId);

    if (!purchaseId || isNaN(purchaseId)) return res.status(400).json({ error: "Invalid purchase id." });
    if (!purchaseInfo || !purchasedProducts) return res.status(400).json({ error: "Incomplete purchase information." });

    const recordOrder = new PurchaseOrders(purchaseInfo, purchasedProducts);
    const result = await recordOrder.updatePurchase(purchaseId);
    if (!result || !result.status) return res.status(400).json({ error: result.message });

    return res.status(201).json({ data: result.data });
});

purchaseRoute.get('/delivered/:purchaseId', checkCredentials, async (req, res) => {
    const purchaseId: number = parseInt(req.params.purchaseId);

    if (!purchaseId || isNaN(purchaseId)) return res.status(400).json({ error: "Invalid purchase id." });
    const deliverOrder = new PurchaseModify(purchaseId);
    const result = await deliverOrder.setDelivered();

    if (!result || !result.status) return res.status(400).json({ error: result.message });

    return res.status(201).json({ data: result.data });
});

purchaseRoute.get('/cancel/:purchaseId', checkCredentials, async (req, res) => {
    const purchaseId: number = parseInt(req.params.purchaseId);

    if (!purchaseId || isNaN(purchaseId)) return res.status(400).json({ error: "Invalid purchase id." });
    const deliverOrder = new PurchaseModify(purchaseId);
    const result = await deliverOrder.setInactive();

    if (!result || !result.status) return res.status(400).json({ error: result.message });

    return res.status(201).json({ data: result.data });
});

purchaseRoute.get('/restore/:purchaseId', checkCredentials, async (req, res) => {
    const purchaseId: number = parseInt(req.params.purchaseId);

    if (!purchaseId || isNaN(purchaseId)) return res.status(400).json({ error: "Invalid purchase id." });
    const deliverOrder = new PurchaseModify(purchaseId);
    const result = await deliverOrder.setActive();

    if (!result || !result.status) return res.status(400).json({ error: result.message });

    return res.status(201).json({ data: result.data });
});

purchaseRoute.get('/delete/:purchaseId', checkCredentials ,async (req, res) => {
    const purchaseId: number = parseInt(req.params.purchaseId);

    if (!purchaseId || isNaN(purchaseId)) return res.status(400).json({ error: "Invalid purchase id." });
    const deliverOrder = new PurchaseModify(purchaseId);
    const result = await deliverOrder.deletePurchase();

    if (!result || !result.status) return res.status(400).json({ error: result.message });

    return res.status(201).json({ data: result.data });
});

purchaseRoute.post('/payment/:purchaseId', checkCredentials, async (req, res) => {
    const purchaseId: number = parseInt(req.params.purchaseId);
    const paymentBody: { account_id: number, amount_paid: number } = req.body.paymentInfo;

    if (!purchaseId || isNaN(purchaseId)) return res.status(400).json({ error: "Invalid purchase id." });
    const result = await addPayment(purchaseId, paymentBody.account_id, paymentBody.amount_paid);

    if (!result || !result.status) return res.status(400).json({ error: result.message });

    return res.status(201).json({ data: result.data });
})

purchaseRoute.post('/payment/update/:paymentId', checkCredentials, async (req, res) => {
    const paymentId: number = parseInt(req.params.paymentId);
    const paymentBody: { amount_paid: number } = req.body.paymentInfo;

    if (!paymentId || isNaN(paymentId)) return res.status(400).json({ error: "Invalid purchase id." });
    const result = await updatePayment(paymentId, paymentBody.amount_paid);

    if (!result || !result.status) return res.status(400).json({ error: result.message });

    return res.status(201).json({ data: result.data });
})

purchaseRoute.post('/upload/invoice/:purchaseId', checkCredentials, upload.single('file'), async (req, res) => {
    const purchaseId: number = parseInt(req.params.purchaseId);

    if (!purchaseId || isNaN(purchaseId)) return res.status(400).json({ error: "Invalid purchase id." });
    if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Failed to upload file."
        });
    } else {
        const profileImage = req.file;
        const profileRef = ref(firebaseStorage, 'purchases/' + profileImage.originalname);
        const uploadRef = await uploadBytes(profileRef, profileImage.buffer);
        const url = await getDownloadURL(uploadRef.ref);

        const upload = new PurchaseModify(purchaseId);
        const result = await upload.uploadInvoice(url);
        if (!result || !result.status) return res.status(400).json({ error: result.message });

        return res.status(201).json({ data: result.data });
    }
});

purchaseRoute.post('/upload/receipt/:purchaseId', checkCredentials, upload.single('file'), async (req, res) => {
    const purchaseId: number = parseInt(req.params.purchaseId);

    if (!purchaseId || isNaN(purchaseId)) return res.status(400).json({ error: "Invalid purchase id." });
    if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Failed to upload file."
        });
    } else {
        const profileImage = req.file;
        const profileRef = ref(firebaseStorage, 'payables/' + profileImage.originalname);
        const uploadRef = await uploadBytes(profileRef, profileImage.buffer);
        const url = await getDownloadURL(uploadRef.ref);

        const upload = new PurchaseModify(purchaseId);
        const result = await upload.uploadReceipt(url);
        if (!result || !result.status) return res.status(400).json({ error: result.message });

        return res.status(201).json({ data: result.data });
    }
});

purchaseRoute.use('/graphql', graphqlHTTP(req => ({ 
    schema: Schema,
    graphql: false
})));

export default purchaseRoute;