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
exports.LocationObject = exports.AccountObject = exports.EmployeeObject = exports.ExecutivePosition = exports.PositionEnumType = void 0;
const graphql_1 = require("graphql");
const graphql_scalars_1 = require("graphql-scalars");
const client_1 = require("@prisma/client");
const graphqlObjects_1 = require("../OrdersAndSales/graphqlObjects");
const graphqlObjects_2 = require("../PurchasedAndPayables/graphqlObjects");
const dataPool = new client_1.PrismaClient(); //database pool
exports.PositionEnumType = new graphql_1.GraphQLEnumType({
    name: "PositionTypes",
    description: "Company available positions",
    values: {
        PRESIDENT: { value: "President" },
        VICE_PRES: { value: "Vice President" },
        MANAGER: { value: "Manager" },
        ACCOUNTANT: { value: "Accountant" },
        CASHIER: { value: "Cashier" },
        WSTAFF: { value: "Warehouse Staff" },
        DELIVERY: { value: "Delivery Personnel" },
        AGENT: { value: "Sales Agent" }
    }
});
exports.ExecutivePosition = ["President", "Vice President", "Manager"];
exports.EmployeeObject = new graphql_1.GraphQLObjectType({
    name: "Employee",
    description: "Company Employees",
    fields: () => ({
        id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        first_name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        last_name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        full_name: {
            type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString),
            resolve: (employee) => {
                return employee.first_name + " " + employee.last_name;
            }
        },
        contact_number: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        email: { type: (0, graphql_1.GraphQLNonNull)(graphql_scalars_1.EmailAddressResolver) },
        address: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        city: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        province: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        zip_code: { type: graphql_1.GraphQLInt },
        position: { type: (0, graphql_1.GraphQLNonNull)(exports.PositionEnumType) },
        profile_image: { type: graphql_1.GraphQLString },
        is_active: { type: graphql_1.GraphQLBoolean },
        user_account: { type: exports.AccountObject,
            resolve: (employee) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const account = yield dataPool.account.findUnique({
                        where: {
                            employee_id: employee.id
                        }
                    });
                    return account;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        total_sold: {
            type: graphql_1.GraphQLFloat,
            args: {
                date: { type: graphql_scalars_1.DateTimeResolver }
            },
            resolve: (employee, args) => __awaiter(void 0, void 0, void 0, function* () {
                if (!args.date) {
                    const currYear = new Date().getFullYear();
                    const startDate = new Date(currYear, 0, 1);
                    const endDate = new Date(currYear, 12, 0);
                    const totalSold = yield dataPool.order.aggregate({
                        where: {
                            AND: {
                                employee_id: employee.id,
                                order_date: {
                                    gte: startDate.toISOString(),
                                    lte: endDate.toISOString()
                                },
                                is_active: true
                            }
                        },
                        _sum: {
                            amount_due: true
                        }
                    }).catch(err => {
                        throw new Error(err.message);
                    });
                    const result = totalSold._sum.amount_due != null ? totalSold._sum.amount_due : 0;
                    return parseFloat(result.toFixed(2));
                }
                else {
                    const currYear = new Date(args.date).getFullYear();
                    const startDate = new Date(currYear, 0, 1);
                    const endDate = new Date(currYear, 12, 0);
                    const totalSold = yield dataPool.order.aggregate({
                        where: {
                            AND: {
                                employee_id: employee.id,
                                order_date: {
                                    gte: startDate.toISOString(),
                                    lte: endDate.toISOString()
                                },
                                is_active: true
                            }
                        },
                        _sum: {
                            amount_due: true
                        }
                    }).catch(err => {
                        throw new Error(err.message);
                    });
                    const result = totalSold._sum.amount_due != null ? totalSold._sum.amount_due : 0;
                    return parseFloat(result.toFixed(2));
                }
            })
        },
        sales_report: {
            type: (0, graphql_1.GraphQLList)(graphql_1.GraphQLFloat),
            args: {
                date: { type: graphql_scalars_1.DateTimeResolver }
            },
            resolve: (employee, args) => __awaiter(void 0, void 0, void 0, function* () {
                if (!args.date) {
                    const currYear = new Date().getFullYear();
                    let salesHistory = [];
                    for (let x = 0; x < 12; x++) {
                        const startDate = new Date(currYear, x, 1);
                        const endDate = new Date(currYear, (x + 1), 0);
                        const totalSold = yield dataPool.order.aggregate({
                            where: {
                                AND: {
                                    employee_id: employee.id,
                                    order_date: {
                                        gte: startDate.toISOString(),
                                        lte: endDate.toISOString()
                                    },
                                    is_active: true
                                }
                            },
                            _sum: {
                                amount_due: true
                            }
                        }).catch(err => {
                            throw new Error(err.message);
                        });
                        const result = totalSold._sum.amount_due != null ? totalSold._sum.amount_due : 0;
                        const amount = parseFloat(result.toFixed(2));
                        salesHistory.push(amount);
                    }
                    return salesHistory;
                }
                else {
                    const currYear = new Date(args.date).getFullYear();
                    let salesHistory = [];
                    for (let x = 0; x < 12; x++) {
                        const startDate = new Date(currYear, x, 1);
                        const endDate = new Date(currYear, (x + 1), 0);
                        const totalSold = yield dataPool.order.aggregate({
                            where: {
                                AND: {
                                    employee_id: employee.id,
                                    order_date: {
                                        gte: startDate.toISOString(),
                                        lte: endDate.toISOString()
                                    },
                                    is_active: true
                                }
                            },
                            _sum: {
                                amount_due: true
                            }
                        }).catch(err => {
                            throw new Error(err.message);
                        });
                        const result = totalSold._sum.amount_due != null ? totalSold._sum.amount_due : 0;
                        const amount = parseFloat(result.toFixed(2));
                        salesHistory.push(amount);
                    }
                    return salesHistory;
                }
            })
        },
        all_sales: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.OrderObject),
            args: {
                date: { type: graphql_scalars_1.DateTimeResolver }
            },
            resolve: (employee, args) => __awaiter(void 0, void 0, void 0, function* () {
                if (!args.date) {
                    const currYear = new Date().getFullYear();
                    const startDate = new Date(currYear, 0, 1);
                    const endDate = new Date((currYear + 1), 0, 1);
                    try {
                        const orderList = yield dataPool.order.findMany({
                            where: {
                                AND: {
                                    employee_id: employee.id,
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
                                    employee_id: employee.id,
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
exports.AccountObject = new graphql_1.GraphQLObjectType({
    name: "Account",
    description: "Employee Acoounts",
    fields: () => ({
        id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        employee: { type: (0, graphql_1.GraphQLNonNull)(exports.EmployeeObject),
            resolve: (account) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const employee = yield dataPool.employee.findFirst({
                        where: {
                            user_account: {
                                id: account.id
                            }
                        }
                    });
                    return employee;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        encoded_orders: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.OrderObject),
            resolve: (account) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const orders = yield dataPool.order.findMany({
                        where: {
                            account_id: account.id,
                        }
                    });
                    return orders;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        encoded_purchase: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_2.PurchaseObject),
            resolve: (account) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const purchase = yield dataPool.purchase.findMany({
                        where: {
                            account_id: account.id
                        }
                    });
                    return purchase;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        }
    })
});
exports.LocationObject = new graphql_1.GraphQLObjectType({
    name: "locations",
    description: "Location scope of the Company",
    fields: () => ({
        id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        province: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        city: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) }
    })
});
//# sourceMappingURL=graphqlObjects.js.map