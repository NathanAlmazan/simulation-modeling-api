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
exports.RootQuery = void 0;
const graphql_1 = require("graphql");
const graphqlObjects_1 = require("./graphqlObjects");
const client_1 = require("@prisma/client");
const graphql_scalars_1 = require("graphql-scalars");
const dataPool = new client_1.PrismaClient();
const DateRangeEnum = new graphql_1.GraphQLEnumType({
    name: "DateRanges",
    description: "The date range of entities to show",
    values: {
        DAY: { value: "Day" },
        WEEK: { value: "Week", },
        MONTH: { value: "Month" }
    }
});
exports.RootQuery = new graphql_1.GraphQLObjectType({
    name: 'RootQuery',
    description: "Root query for account payables",
    fields: () => ({
        allActiveSuppliers: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.SupplierObject),
            resolve: () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const suppliers = yield dataPool.supplier.findMany({
                        where: {
                            is_active: true,
                        }
                    });
                    return suppliers;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        allInactiveSuppliers: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.SupplierObject),
            resolve: () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const suppliers = yield dataPool.supplier.findMany({
                        where: {
                            is_active: false,
                        }
                    });
                    return suppliers;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        allInactiveOrders: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.PurchaseObject),
            resolve: () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const archived = yield dataPool.purchase.findMany({
                        where: {
                            is_active: false,
                        }
                    });
                    return archived;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        purchasedOrdersDelivery: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.PurchaseObject),
            resolve: () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const delivery = yield dataPool.purchase.findMany({
                        where: {
                            AND: {
                                is_active: true,
                                delivered: null
                            }
                        }
                    });
                    return delivery;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        purchasedOrderOverdue: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.PurchaseObject),
            resolve: () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const currDate = new Date();
                    const overdueOrders = yield dataPool.purchase.findMany({
                        where: {
                            AND: {
                                due_date: {
                                    lt: currDate.toISOString()
                                },
                                is_active: true,
                                is_paid: false
                            }
                        }
                    });
                    return overdueOrders;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        searchSupplier: {
            type: graphqlObjects_1.SupplierObject,
            args: {
                supplierId: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) }
            },
            resolve: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const supplier = yield dataPool.supplier.findUnique({
                        where: {
                            id: args.supplierId
                        }
                    });
                    return supplier;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        searchPurchasedOrders: {
            type: graphqlObjects_1.PurchaseObject,
            args: {
                purchaseId: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
            },
            resolve: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const purchase = yield dataPool.purchase.findUnique({
                        where: {
                            id: args.purchaseId
                        }
                    });
                    return purchase;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        filteredByDueDate: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.PurchaseObject),
            description: "Filter Orders by Due Date",
            args: {
                date_range: { type: (0, graphql_1.GraphQLNonNull)(DateRangeEnum) },
                date_selected: { type: (0, graphql_1.GraphQLNonNull)(graphql_scalars_1.DateTimeResolver) },
            },
            resolve: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
                const dateRange = args.date_range;
                const dateSelected = args.date_selected;
                switch (dateRange) {
                    case "Day":
                        let finalDate = new Date(dateSelected);
                        finalDate.setDate(finalDate.getDate() + 1);
                        try {
                            const orderList = yield dataPool.purchase.findMany({
                                where: {
                                    due_date: {
                                        gte: dateSelected,
                                        lt: finalDate.toISOString()
                                    },
                                    is_active: true
                                },
                                orderBy: {
                                    due_date: 'desc'
                                }
                            });
                            return orderList;
                        }
                        catch (err) {
                            throw new Error(err.message);
                        }
                    case "Week":
                        const curr = new Date(dateSelected);
                        const firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
                        const lastday = new Date(curr.setDate(firstday.getDate() + 7));
                        try {
                            const orderList = yield dataPool.purchase.findMany({
                                where: {
                                    AND: {
                                        due_date: {
                                            gte: firstday.toISOString(),
                                            lt: lastday.toISOString()
                                        },
                                        is_active: true
                                    }
                                },
                                orderBy: {
                                    due_date: 'desc'
                                }
                            });
                            return orderList;
                        }
                        catch (err) {
                            throw new Error(err.message);
                        }
                    case "Month":
                        const inputMonth = new Date(dateSelected);
                        const currMonth = new Date(inputMonth.getFullYear(), inputMonth.getMonth());
                        const nextMonth = new Date(inputMonth.getFullYear(), inputMonth.getMonth() + 1);
                        try {
                            const orderList = yield dataPool.purchase.findMany({
                                where: {
                                    AND: {
                                        due_date: {
                                            gte: currMonth.toISOString(),
                                            lt: nextMonth.toISOString()
                                        },
                                        is_active: true
                                    }
                                },
                                orderBy: {
                                    due_date: 'desc'
                                }
                            });
                            return orderList;
                        }
                        catch (err) {
                            throw new Error(err.message);
                        }
                    default:
                        const initMonth = new Date(dateSelected);
                        const firstMonth = new Date(initMonth.getFullYear(), initMonth.getMonth() - 3);
                        const lastMonth = new Date(initMonth.getFullYear(), initMonth.getMonth() + 1);
                        try {
                            const orderList = yield dataPool.purchase.findMany({
                                where: {
                                    AND: {
                                        due_date: {
                                            gte: firstMonth.toISOString(),
                                            lt: lastMonth.toISOString()
                                        },
                                        is_active: true
                                    }
                                },
                                orderBy: {
                                    due_date: 'desc'
                                }
                            });
                            return orderList;
                        }
                        catch (err) {
                            throw new Error(err.message);
                        }
                }
            })
        },
        filteredByOrderDate: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.PurchaseObject),
            description: "Filter Orders by Order Date",
            args: {
                date_range: { type: (0, graphql_1.GraphQLNonNull)(DateRangeEnum) },
                date_selected: { type: (0, graphql_1.GraphQLNonNull)(graphql_scalars_1.DateTimeResolver) },
            },
            resolve: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
                const dateRange = args.date_range;
                const dateSelected = args.date_selected;
                switch (dateRange) {
                    case "Day":
                        let finalDate = new Date(dateSelected);
                        finalDate.setDate(finalDate.getDate() + 1);
                        try {
                            const orderList = yield dataPool.purchase.findMany({
                                where: {
                                    AND: {
                                        purchase_date: {
                                            gte: dateSelected,
                                            lt: finalDate.toISOString()
                                        },
                                        is_active: true
                                    }
                                },
                                orderBy: {
                                    purchase_date: 'desc'
                                }
                            });
                            return orderList;
                        }
                        catch (err) {
                            throw new Error(err.message);
                        }
                    case "Week":
                        const curr = new Date(dateSelected);
                        const firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
                        const lastday = new Date(curr.setDate(firstday.getDate() + 7));
                        try {
                            const orderList = yield dataPool.purchase.findMany({
                                where: {
                                    AND: {
                                        purchase_date: {
                                            gte: firstday.toISOString(),
                                            lt: lastday.toISOString()
                                        },
                                        is_active: true
                                    }
                                },
                                orderBy: {
                                    purchase_date: 'desc'
                                }
                            });
                            return orderList;
                        }
                        catch (err) {
                            throw new Error(err.message);
                        }
                    case "Month":
                        const inputMonth = new Date(dateSelected);
                        const currMonth = new Date(inputMonth.getFullYear(), inputMonth.getMonth());
                        const nextMonth = new Date(inputMonth.getFullYear(), inputMonth.getMonth() + 1);
                        try {
                            const orderList = yield dataPool.purchase.findMany({
                                where: {
                                    AND: {
                                        purchase_date: {
                                            gte: currMonth.toISOString(),
                                            lt: nextMonth.toISOString()
                                        },
                                        is_active: true
                                    }
                                },
                                orderBy: {
                                    purchase_date: 'desc'
                                }
                            });
                            return orderList;
                        }
                        catch (err) {
                            throw new Error(err.message);
                        }
                    default:
                        const initMonth = new Date(dateSelected);
                        const firstMonth = new Date(initMonth.getFullYear(), initMonth.getMonth() - 3);
                        const lastMonth = new Date(initMonth.getFullYear(), initMonth.getMonth() + 1);
                        try {
                            const orderList = yield dataPool.purchase.findMany({
                                where: {
                                    AND: {
                                        purchase_date: {
                                            gte: firstMonth.toISOString(),
                                            lt: lastMonth.toISOString()
                                        },
                                        is_active: true
                                    }
                                },
                                orderBy: {
                                    purchase_date: 'desc'
                                }
                            });
                            return orderList;
                        }
                        catch (err) {
                            throw new Error(err.message);
                        }
                }
            })
        },
        filterOrdersBySupplier: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.PurchaseObject),
            args: {
                id: { type: graphql_1.GraphQLInt },
                supplier_name: { type: graphql_1.GraphQLString },
                invoiceId: { type: graphql_1.GraphQLString }
            },
            resolve: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
                if (args.id != null) {
                    try {
                        const order = yield dataPool.purchase.findMany({
                            where: {
                                AND: {
                                    id: args.id,
                                    is_active: true,
                                }
                            }
                        });
                        return order;
                    }
                    catch (err) {
                        throw new Error(err.message);
                    }
                }
                else if (args.invoiceId != null) {
                    try {
                        const order = yield dataPool.purchase.findMany({
                            where: {
                                AND: {
                                    invoice_id: {
                                        contains: args.invoiceId
                                    },
                                    is_active: true,
                                }
                            }
                        });
                        return order;
                    }
                    catch (err) {
                        throw new Error(err.message);
                    }
                }
                else if (args.supplier_name != null) {
                    const supplierName = "%" + args.supplier_name + "%";
                    try {
                        const searchedSupplier = yield dataPool.$queryRaw `SELECT id FROM "public"."Supplier" WHERE CONCAT(first_name, ' ', last_name) LIKE ${supplierName}`;
                        let orderList = [];
                        for (let i = 0; i < searchedSupplier.length; i++) {
                            const currSupplier = searchedSupplier[i];
                            const orders = yield dataPool.purchase.findMany({
                                where: {
                                    AND: {
                                        supplier_id: currSupplier.id,
                                        is_active: true,
                                    }
                                }
                            });
                            orderList.push(...orders);
                        }
                        return orderList;
                    }
                    catch (err) {
                        throw new Error(err.message);
                    }
                }
                else {
                    throw new Error("Invalid arguments.");
                }
            })
        },
        showPayables: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.PayablesObject),
            description: "Filter Orders by Due Date",
            args: {
                date_range: { type: (0, graphql_1.GraphQLNonNull)(DateRangeEnum) },
                date_selected: { type: (0, graphql_1.GraphQLNonNull)(graphql_scalars_1.DateTimeResolver) },
            },
            resolve: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
                const dateRange = args.date_range;
                const dateSelected = args.date_selected;
                switch (dateRange) {
                    case "Day":
                        let finalDate = new Date(dateSelected);
                        finalDate.setDate(finalDate.getDate() + 1);
                        try {
                            const payablesList = yield dataPool.payables.findMany({
                                where: {
                                    payment_date: {
                                        gte: dateSelected,
                                        lt: finalDate.toISOString()
                                    }
                                },
                            });
                            return payablesList;
                        }
                        catch (err) {
                            throw new Error(err.message);
                        }
                    case "Week":
                        const curr = new Date(dateSelected);
                        const firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
                        const lastday = new Date(curr.setDate(firstday.getDate() + 7));
                        try {
                            const payablesList = yield dataPool.payables.findMany({
                                where: {
                                    payment_date: {
                                        gte: firstday.toISOString(),
                                        lt: lastday.toISOString()
                                    }
                                },
                            });
                            return payablesList;
                        }
                        catch (err) {
                            throw new Error(err.message);
                        }
                    case "Month":
                        const inputMonth = new Date(dateSelected);
                        const currMonth = new Date(inputMonth.getFullYear(), inputMonth.getMonth());
                        const nextMonth = new Date(inputMonth.getFullYear(), inputMonth.getMonth() + 1);
                        try {
                            const payablesList = yield dataPool.payables.findMany({
                                where: {
                                    payment_date: {
                                        gte: currMonth.toISOString(),
                                        lt: nextMonth.toISOString()
                                    }
                                },
                            });
                            return payablesList;
                        }
                        catch (err) {
                            throw new Error(err.message);
                        }
                    default:
                        const initMonth = new Date(dateSelected);
                        const firstMonth = new Date(initMonth.getFullYear(), initMonth.getMonth() - 3);
                        const lastMonth = new Date(initMonth.getFullYear(), initMonth.getMonth() + 1);
                        try {
                            const payablesList = yield dataPool.payables.findMany({
                                where: {
                                    payment_date: {
                                        gte: firstMonth.toISOString(),
                                        lt: lastMonth.toISOString()
                                    }
                                },
                            });
                            return payablesList;
                        }
                        catch (err) {
                            throw new Error(err.message);
                        }
                }
            })
        },
    })
});
//# sourceMappingURL=rootQuery.js.map