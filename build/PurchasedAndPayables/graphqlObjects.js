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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayablesObject = exports.PurcahseWithProductObject = exports.PurchaseObject = exports.SupplierObject = void 0;
const client_1 = require("@prisma/client");
const graphql_1 = require("graphql");
const graphql_scalars_1 = require("graphql-scalars");
const graphqlObjects_1 = require("../EmployeeAndAccounts/graphqlObjects");
const graphqlObjects_2 = require("../Products/graphqlObjects");
const dataPool = new client_1.PrismaClient();
exports.SupplierObject = new graphql_1.GraphQLObjectType({
    name: 'Supplieers',
    description: 'Suppliers that supply products',
    fields: () => ({
        id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        first_name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        last_name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        full_name: {
            type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString),
            resolve: (supplier) => {
                return supplier.first_name + " " + supplier.last_name;
            }
        },
        company_name: { type: graphql_1.GraphQLString },
        contact_number: { type: graphql_1.GraphQLString },
        email: { type: graphql_scalars_1.EmailAddressResolver },
        website: { type: graphql_1.GraphQLString },
        address: { type: graphql_1.GraphQLString },
        city: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        province: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        is_active: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLBoolean) },
        supplied_orders: {
            type: (0, graphql_1.GraphQLList)(exports.PurchaseObject),
            args: {
                date: { type: graphql_scalars_1.DateTimeResolver }
            },
            resolve: (supplier, args) => __awaiter(void 0, void 0, void 0, function* () {
                if (!args.date) {
                    try {
                        const currYear = new Date().getFullYear();
                        const startDate = new Date(currYear, 0, 1);
                        const endDate = new Date((currYear + 1), 0, 1);
                        const suppOrders = yield dataPool.purchase.findMany({
                            where: {
                                supplier_id: supplier.id,
                                purchase_date: {
                                    gte: startDate,
                                    lt: endDate
                                }
                            }
                        });
                        return suppOrders;
                    }
                    catch (err) {
                        throw new Error(err.message);
                    }
                }
                else {
                    try {
                        const currYear = new Date(args.date).getFullYear();
                        const startDate = new Date(currYear, 0, 1);
                        const endDate = new Date((currYear + 1), 0, 1);
                        const suppOrders = yield dataPool.purchase.findMany({
                            where: {
                                supplier_id: supplier.id,
                                purchase_date: {
                                    gte: startDate,
                                    lt: endDate
                                }
                            }
                        });
                        return suppOrders;
                    }
                    catch (err) {
                        throw new Error(err.message);
                    }
                }
            })
        },
        total_collecting: {
            type: graphql_1.GraphQLInt,
            resolve: (supplier) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const totalCollect = yield dataPool.purchase.aggregate({
                        where: {
                            AND: {
                                supplier_id: supplier.id,
                                is_paid: false
                            }
                        },
                        _count: {
                            id: true
                        }
                    });
                    return totalCollect._count.id;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        total_supplied: {
            type: graphql_1.GraphQLInt,
            resolve: (supplier) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const totalSupplied = yield dataPool.purchase.aggregate({
                        where: {
                            AND: {
                                supplier_id: supplier.id,
                                is_paid: true
                            }
                        },
                        _count: {
                            id: true
                        }
                    });
                    return totalSupplied._count.id;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        }
    })
});
exports.PurchaseObject = new graphql_1.GraphQLObjectType({
    name: "PurchasedOrders",
    description: "Orders purchased by the company",
    fields: () => ({
        id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        supplier: {
            type: exports.SupplierObject,
            resolve: (purchase) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const purchSupplier = yield dataPool.supplier.findUnique({
                        where: {
                            id: purchase.supplier_id
                        }
                    });
                    return purchSupplier;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        account: {
            type: graphqlObjects_1.AccountObject,
            resolve: (purchase) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const account = yield dataPool.account.findUnique({
                        where: {
                            id: purchase.account_id
                        }
                    });
                    return account;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        total_amount: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLFloat) },
        payment_type: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        invoice_id: { type: graphql_1.GraphQLString },
        discount: { type: graphql_1.GraphQLFloat },
        add_charge: { type: graphql_1.GraphQLFloat },
        is_paid: { type: graphql_1.GraphQLBoolean },
        delivered: { type: graphql_scalars_1.DateTimeResolver },
        purchase_date: { type: graphql_scalars_1.DateTimeResolver },
        due_date: { type: graphql_scalars_1.DateTimeResolver },
        inv_fileName: { type: graphql_1.GraphQLString },
        is_active: { type: graphql_1.GraphQLBoolean },
        purchased_products: {
            type: (0, graphql_1.GraphQLList)(exports.PurcahseWithProductObject),
            resolve: (purchase) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const purchased = yield dataPool.purcahseWithProduct.findMany({
                        where: {
                            purchase_id: purchase.id
                        }
                    });
                    return purchased;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        payment_history: {
            type: (0, graphql_1.GraphQLList)(exports.PayablesObject),
            resolve: (purchase) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const payments = yield dataPool.payables.findMany({
                        where: {
                            purchase_id: purchase.id
                        }
                    });
                    return payments;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        total_paid: {
            type: graphql_1.GraphQLFloat,
            resolve: (purchase) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const totalPaid = yield dataPool.payables.aggregate({
                        where: {
                            purchase_id: purchase.id
                        },
                        _sum: {
                            amount_paid: true
                        }
                    });
                    if (!totalPaid._sum.amount_paid) {
                        return 0;
                    }
                    return parseFloat(totalPaid._sum.amount_paid.toFixed(2));
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        days_left: {
            type: graphql_1.GraphQLFloat,
            resolve: (purchase) => {
                const dateToday = new Date();
                const difference = Math.abs(purchase.due_date.valueOf() - dateToday.valueOf());
                if (purchase.due_date.valueOf() > dateToday.valueOf()) {
                    const daysLeft = difference / (1000 * 3600 * 24);
                    return parseFloat(daysLeft.toFixed(2));
                }
                else {
                    const daysLeft = 0 - (difference / (1000 * 3600 * 24));
                    return parseFloat(daysLeft.toFixed(2));
                }
            }
        },
        terms: {
            type: graphql_1.GraphQLFloat,
            resolve: (purchase) => {
                const difference = Math.abs(purchase.due_date.valueOf() - purchase.purchase_date.valueOf());
                if (purchase.due_date.valueOf() > purchase.purchase_date.valueOf()) {
                    const daysLeft = difference / (1000 * 3600 * 24);
                    return parseFloat(daysLeft.toFixed(2));
                }
                else {
                    const daysLeft = 0 - (difference / (1000 * 3600 * 24));
                    return parseFloat(daysLeft.toFixed(2));
                }
            }
        },
        purchase_balance: {
            type: graphql_1.GraphQLFloat,
            resolve: (purchase) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const totalPaid = yield dataPool.payables.aggregate({
                        where: {
                            purchase_id: purchase.id
                        },
                        _sum: {
                            amount_paid: true
                        }
                    });
                    const totalAmount = parseFloat(purchase.total_amount.toFixed(2));
                    if (!totalPaid._sum.amount_paid) {
                        return totalAmount;
                    }
                    const totalPayment = parseFloat(totalPaid._sum.amount_paid.toFixed(2));
                    return totalAmount - totalPayment;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        }
    })
});
exports.PurcahseWithProductObject = new graphql_1.GraphQLObjectType({
    name: 'PurcahseWithProduct',
    description: 'Purchased Products',
    fields: () => ({
        product: {
            type: (0, graphql_1.GraphQLNonNull)(graphqlObjects_2.ProductObject),
            resolve: (productPurchased) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const product = yield dataPool.product.findUnique({
                        where: {
                            id: productPurchased.product_id
                        }
                    });
                    return product;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        purchase_order: {
            type: (0, graphql_1.GraphQLNonNull)(exports.PurchaseObject),
            resolve: (productPurchased) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const purchase = yield dataPool.purchase.findUnique({
                        where: {
                            id: productPurchased.purchase_id
                        }
                    });
                    return purchase;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        quantity: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        total_price: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLFloat) }
    })
});
exports.PayablesObject = new graphql_1.GraphQLObjectType({
    name: "Payables",
    description: "Purchase Orders payment",
    fields: () => ({
        id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        purchase_order: {
            type: (0, graphql_1.GraphQLNonNull)(exports.PurchaseObject),
            resolve: (payables) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const purchase = yield dataPool.purchase.findUnique({
                        where: {
                            id: payables.purchase_id
                        }
                    });
                    return purchase;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        account: {
            type: graphqlObjects_1.AccountObject,
            resolve: (payables) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const account = yield dataPool.account.findUnique({
                        where: {
                            id: payables.account_id
                        }
                    });
                    return account;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        receipt_file: { type: graphql_1.GraphQLString },
        amount_paid: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLFloat) },
        payment_date: { type: graphql_scalars_1.DateTimeResolver }
    })
});
//# sourceMappingURL=graphqlObjects.js.map