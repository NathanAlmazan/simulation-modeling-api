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
exports.TransactionObject = exports.SalesObject = exports.CustomerObject = exports.OrderObject = exports.OrderWithProducts = exports.PaymentTypeEnum = void 0;
const client_1 = require("@prisma/client");
const graphql_1 = require("graphql");
const graphql_scalars_1 = require("graphql-scalars");
const graphqlObjects_1 = require("../EmployeeAndAccounts/graphqlObjects");
const graphqlObjects_2 = require("../Products/graphqlObjects");
const dataPool = new client_1.PrismaClient();
exports.PaymentTypeEnum = new graphql_1.GraphQLEnumType({
    name: "PaymentTypes",
    description: "Different payment method the company accepts",
    values: {
        CREDIT: { value: "Credit" },
        CHEQUE: { value: "Cheque" },
        CASH: { value: "Cash" }
    }
});
exports.OrderWithProducts = new graphql_1.GraphQLObjectType({
    name: "OrderWithProducts",
    description: "Products detail inside orders",
    fields: () => ({
        product: {
            type: (0, graphql_1.GraphQLNonNull)(graphqlObjects_2.ProductObject),
            resolve: (parent) => __awaiter(void 0, void 0, void 0, function* () {
                return parent.product;
            })
        },
        quantity: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        total_price: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLFloat) }
    })
});
exports.OrderObject = new graphql_1.GraphQLObjectType({
    name: "Orders",
    description: "Customer orders",
    fields: () => ({
        id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        employee: {
            type: (0, graphql_1.GraphQLNonNull)(graphqlObjects_1.EmployeeObject),
            resolve: (order) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const employee = yield dataPool.employee.findUnique({
                        where: {
                            id: order.employee_id
                        }
                    });
                    return employee;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        account: {
            type: (0, graphql_1.GraphQLNonNull)(graphqlObjects_1.AccountObject),
            resolve: (order) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const account = yield dataPool.account.findUnique({
                        where: {
                            id: order.account_id
                        }
                    });
                    return account;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        customer: {
            type: (0, graphql_1.GraphQLNonNull)(exports.CustomerObject),
            resolve: (order) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const customer = yield dataPool.customer.findUnique({
                        where: {
                            id: order.customer_id
                        }
                    });
                    return customer;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        products: {
            type: (0, graphql_1.GraphQLList)(exports.OrderWithProducts),
            resolve: (order) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const orderProducts = yield dataPool.orderWithProduct.findMany({
                        where: {
                            order_id: order.id
                        },
                        include: {
                            product: true
                        }
                    });
                    return orderProducts;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        payment_type: { type: (0, graphql_1.GraphQLNonNull)(exports.PaymentTypeEnum) },
        vat: { type: graphql_1.GraphQLFloat },
        discount: { type: graphql_1.GraphQLFloat },
        total_price: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLFloat) },
        amount_due: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLFloat) },
        order_date: { type: graphql_scalars_1.DateTimeResolver },
        due_date: { type: (0, graphql_1.GraphQLNonNull)(graphql_scalars_1.DateTimeResolver) },
        delivered: { type: graphql_scalars_1.DateTimeResolver },
        inv_fileName: { type: graphql_1.GraphQLString },
        receipt_file: { type: graphql_1.GraphQLString },
        is_active: { type: graphql_1.GraphQLBoolean },
        paid: {
            type: graphql_1.GraphQLBoolean,
            resolve: (order) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const sold = yield dataPool.sales.findUnique({
                        where: {
                            order_id: order.id
                        }
                    });
                    return sold !== null ? true : false;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        transactions: {
            type: (0, graphql_1.GraphQLList)(exports.TransactionObject),
            resolve: (order) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const orderTransaction = yield dataPool.transaction.findMany({
                        where: {
                            order_id: order.id,
                        },
                        orderBy: {
                            payment_date: 'desc',
                        },
                    });
                    return orderTransaction;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        days_left: {
            type: graphql_1.GraphQLFloat,
            resolve: (order) => {
                const dateToday = new Date();
                const difference = Math.abs(order.due_date.valueOf() - dateToday.valueOf());
                if (order.due_date.valueOf() > dateToday.valueOf()) {
                    const daysLeft = difference / (1000 * 3600 * 24);
                    return parseFloat(daysLeft.toFixed(2));
                }
                else {
                    const daysLeft = 0 - (difference / (1000 * 3600 * 24));
                    return parseFloat(daysLeft.toFixed(2));
                }
            }
        },
        order_balance: {
            type: graphql_1.GraphQLFloat,
            resolve: (order) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const paymentHistory = yield dataPool.transaction.findMany({
                        where: {
                            order_id: order.id
                        },
                        select: {
                            id: true,
                            amount_paid: true
                        }
                    });
                    let totalPaid = 0;
                    paymentHistory.forEach(payment => totalPaid += parseFloat((payment.amount_paid).toFixed(2)));
                    const currBalance = parseFloat((order.amount_due).toFixed(2)) - totalPaid;
                    return currBalance;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        }
    })
});
exports.CustomerObject = new graphql_1.GraphQLObjectType({
    name: "Customer",
    description: "Company Customers",
    fields: () => ({
        id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        company_name: { type: graphql_1.GraphQLString },
        first_name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        last_name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        full_name: {
            type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString),
            resolve: (customer) => {
                return customer.first_name + " " + customer.last_name;
            }
        },
        contact_number: { type: graphql_1.GraphQLString },
        email: { type: graphql_scalars_1.EmailAddressResolver },
        website: { type: graphql_1.GraphQLString },
        address: { type: graphql_1.GraphQLString },
        city: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        province: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        is_active: { type: graphql_1.GraphQLBoolean },
        total_credits: {
            type: graphql_1.GraphQLInt,
            resolve: (customer) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const totalOrders = yield dataPool.order.aggregate({
                        _count: {
                            id: true
                        },
                        where: {
                            AND: {
                                customer_id: customer.id,
                                is_active: true,
                                sold: null
                            },
                        },
                    });
                    return totalOrders._count.id;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        total_bought: {
            type: graphql_1.GraphQLInt,
            resolve: (customer, args) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const totalBought = yield dataPool.sales.aggregate({
                        _count: {
                            id: true
                        },
                        where: {
                            order: {
                                customer_id: customer.id,
                            },
                        },
                    });
                    return totalBought._count != null ? totalBought._count.id : 0;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        all_orders: {
            type: (0, graphql_1.GraphQLList)(exports.OrderObject),
            args: {
                date: { type: graphql_scalars_1.DateTimeResolver }
            },
            resolve: (customer, args) => __awaiter(void 0, void 0, void 0, function* () {
                if (!args.date) {
                    const currYear = new Date().getFullYear();
                    const startDate = new Date(currYear, 0, 1);
                    const endDate = new Date((currYear + 1), 0, 1);
                    try {
                        const orderList = yield dataPool.order.findMany({
                            where: {
                                AND: {
                                    customer_id: customer.id,
                                    order_date: {
                                        gte: startDate.toISOString(),
                                        lt: endDate.toISOString()
                                    }
                                }
                            },
                        });
                        return orderList;
                    }
                    catch (err) {
                        throw new Error(err.message);
                    }
                }
                else {
                    const currYear = new Date(args.date).getFullYear();
                    const startDate = new Date(currYear, 0, 1);
                    const endDate = new Date((currYear + 1), 0, 1);
                    try {
                        const orderList = yield dataPool.order.findMany({
                            where: {
                                AND: {
                                    customer_id: customer.id,
                                    order_date: {
                                        gte: startDate.toISOString(),
                                        lt: endDate.toISOString()
                                    }
                                }
                            },
                        });
                        return orderList;
                    }
                    catch (err) {
                        throw new Error(err.message);
                    }
                }
            })
        }
    })
});
exports.SalesObject = new graphql_1.GraphQLObjectType({
    name: "CompanySales",
    description: "All order sold.",
    fields: () => ({
        id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        date_paid: { type: (0, graphql_1.GraphQLNonNull)(graphql_scalars_1.DateTimeResolver) },
        order: {
            type: exports.OrderObject,
            resolve: (sales) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const salesOrder = yield dataPool.order.findUnique({
                        where: {
                            id: sales.id
                        }
                    });
                    return salesOrder;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        }
    })
});
exports.TransactionObject = new graphql_1.GraphQLObjectType({
    name: "Transactions",
    description: "Account Receivables",
    fields: () => ({
        id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        employee: {
            type: graphqlObjects_1.EmployeeObject,
            resolve: (transaction) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const employee = yield dataPool.employee.findUnique({
                        where: {
                            id: transaction.employee_id
                        },
                    });
                    return employee;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        account: {
            type: (0, graphql_1.GraphQLNonNull)(graphqlObjects_1.AccountObject),
            resolve: (transaction) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const account = yield dataPool.account.findUnique({
                        where: {
                            id: transaction.account_id
                        }
                    });
                    return account;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        order: {
            type: exports.OrderObject,
            resolve: (transaction) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const salesOrder = yield dataPool.order.findUnique({
                        where: {
                            id: transaction.order_id
                        }
                    });
                    return salesOrder;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        amount_paid: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLFloat) },
        payment_date: { type: (0, graphql_1.GraphQLNonNull)(graphql_scalars_1.DateTimeResolver) }
    })
});
//# sourceMappingURL=graphqlObjects.js.map