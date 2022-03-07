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
exports.RootMutation = exports.RootQuery = void 0;
const graphql_1 = require("graphql");
const graphqlObjects_1 = require("./graphqlObjects");
const client_1 = require("@prisma/client");
const graphql_scalars_1 = require("graphql-scalars");
const dataPool = new client_1.PrismaClient(); //database pool
const UnAuthorized = ["Warehouse Staff", "Delivery Personnel", "Sales Agent"];
;
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
    name: "RootQuery",
    description: "Queries to all sales orders",
    fields: () => ({
        showCustomerOrders: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.OrderObject),
            description: "Return all customer orders",
            args: {
                customer_id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) }
            },
            resolve: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const customerOrders = yield dataPool.order.findMany({
                        where: {
                            customer_id: args.customer_id,
                            is_active: true
                        },
                        orderBy: {
                            order_date: 'desc'
                        }
                    });
                    return customerOrders;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        searchOrder: {
            type: graphqlObjects_1.OrderObject,
            description: "Find order by ID",
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) }
            },
            resolve: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const order = yield dataPool.order.findUnique({
                        where: {
                            id: args.id
                        }
                    });
                    return order;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        searchManyOrders: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.OrderObject),
            description: "Find orders by id, customer or agent",
            args: {
                id: { type: graphql_1.GraphQLInt },
                customer_name: { type: graphql_1.GraphQLString },
                agent_name: { type: graphql_1.GraphQLString }
            },
            resolve: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
                if (args.id != null) {
                    try {
                        const order = yield dataPool.order.findMany({
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
                else if (args.customer_name != null) {
                    const customerName = "%" + args.customer_name + "%";
                    try {
                        const searchedCustomers = yield dataPool.$queryRaw `SELECT id FROM "public"."Customer" WHERE CONCAT(first_name, ' ', last_name) LIKE ${customerName}`;
                        let orderList = [];
                        for (let i = 0; i < searchedCustomers.length; i++) {
                            const currCustomer = searchedCustomers[i];
                            const orders = yield dataPool.order.findMany({
                                where: {
                                    AND: {
                                        customer_id: currCustomer.id,
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
                else if (args.agent_name != null) {
                    const agentName = "%" + args.agent_name + "%";
                    try {
                        const searchedAgents = yield dataPool.$queryRaw `SELECT id FROM "public"."Employee" WHERE CONCAT(first_name, ' ', last_name) LIKE ${agentName}`;
                        let orderList = [];
                        for (let i = 0; i < searchedAgents.length; i++) {
                            const currAgent = searchedAgents[i];
                            const orders = yield dataPool.order.findMany({
                                where: {
                                    AND: {
                                        employee_id: currAgent.id,
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
        showOnHoldOrders: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.OrderObject),
            description: "Return all Orders that are on hold",
            resolve: () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const holdOrders = yield dataPool.order.findMany({
                        where: {
                            is_active: false
                        },
                        orderBy: {
                            order_date: 'desc'
                        }
                    });
                    return holdOrders;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        showOverdueOrders: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.OrderObject),
            description: "Return all Orders that are overdue",
            resolve: () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const overdueOrders = yield dataPool.order.findMany({
                        where: {
                            AND: {
                                due_date: {
                                    lt: new Date().toISOString()
                                },
                                is_active: true,
                                sold: null
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
        showOrdersToBeDelivered: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.OrderObject),
            description: "Return all Orders that are overdue",
            resolve: () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const toBeDelivered = yield dataPool.order.findMany({
                        where: {
                            AND: {
                                delivered: null,
                                is_active: true
                            }
                        }
                    });
                    return toBeDelivered;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        showSales: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.SalesObject),
            description: "Return all sales with or without given date",
            args: {
                startDate: { type: graphql_scalars_1.DateTimeResolver },
                endDate: { type: graphql_scalars_1.DateTimeResolver }
            },
            resolve: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
                if (args.startDate && args.endDate) {
                    try {
                        const salesOrder = yield dataPool.sales.findMany({
                            where: {
                                date_paid: {
                                    gte: args.startDate,
                                    lte: args.endDate
                                }
                            },
                            orderBy: {
                                date_paid: 'desc'
                            }
                        });
                        return salesOrder;
                    }
                    catch (err) {
                        throw new Error(err.message);
                    }
                }
                else if (!args.startDate && !args.endDate) {
                    try {
                        const salesOrder = yield dataPool.sales.findMany({
                            where: {
                                date_paid: {
                                    lte: new Date()
                                }
                            },
                            take: 20
                        });
                        return salesOrder;
                    }
                    catch (err) {
                        throw new Error(err.message);
                    }
                }
                else
                    throw new Error("Invalid arguments.");
            })
        },
        showAllCustomers: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.CustomerObject),
            description: "Return all comany customers",
            resolve: () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const allCustomers = yield dataPool.customer.findMany({
                        where: {
                            is_active: true
                        },
                        orderBy: {
                            id: 'asc'
                        }
                    });
                    return allCustomers;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        showArchivedCustomers: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.CustomerObject),
            description: "Return all comany customers",
            resolve: () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const allCustomers = yield dataPool.customer.findMany({
                        where: {
                            is_active: false
                        },
                        orderBy: {
                            id: 'asc'
                        }
                    });
                    return allCustomers;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        searchCustomer: {
            type: graphqlObjects_1.CustomerObject,
            description: "Search customer by id, name, email, contact number, company name, city and Province",
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) }
            },
            resolve: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
                if (!args)
                    throw new Error("Invalid arguments.");
                try {
                    const resultCustomer = yield dataPool.customer.findUnique({
                        where: {
                            id: args.id
                        },
                    });
                    return resultCustomer;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        filteredByDueDate: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.OrderObject),
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
                            const orderList = yield dataPool.order.findMany({
                                where: {
                                    AND: {
                                        due_date: {
                                            gte: dateSelected,
                                            lt: finalDate.toISOString()
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
                    case "Week":
                        const curr = new Date(dateSelected);
                        const firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
                        const lastday = new Date(curr.setDate(firstday.getDate() + 7));
                        try {
                            const orderList = yield dataPool.order.findMany({
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
                            const orderList = yield dataPool.order.findMany({
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
                            const orderList = yield dataPool.order.findMany({
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
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.OrderObject),
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
                            const orderList = yield dataPool.order.findMany({
                                where: {
                                    AND: {
                                        order_date: {
                                            gte: dateSelected,
                                            lt: finalDate.toISOString()
                                        },
                                        is_active: true
                                    }
                                },
                                orderBy: {
                                    order_date: 'desc'
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
                            const orderList = yield dataPool.order.findMany({
                                where: {
                                    AND: {
                                        order_date: {
                                            gte: firstday.toISOString(),
                                            lt: lastday.toISOString()
                                        },
                                        is_active: true
                                    }
                                },
                                orderBy: {
                                    order_date: 'desc'
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
                            const orderList = yield dataPool.order.findMany({
                                where: {
                                    AND: {
                                        order_date: {
                                            gte: currMonth.toISOString(),
                                            lt: nextMonth.toISOString()
                                        },
                                        is_active: true
                                    }
                                },
                                orderBy: {
                                    order_date: 'desc'
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
                            const orderList = yield dataPool.order.findMany({
                                where: {
                                    AND: {
                                        order_date: {
                                            gte: firstMonth.toISOString(),
                                            lt: lastMonth.toISOString()
                                        },
                                        is_active: true
                                    }
                                },
                                orderBy: {
                                    order_date: 'desc'
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
        showTransactions: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.TransactionObject),
            description: "Show the transations in a specific range of time",
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
                            const transactionList = yield dataPool.transaction.findMany({
                                where: {
                                    payment_date: {
                                        gte: dateSelected,
                                        lt: finalDate.toISOString()
                                    },
                                }
                            });
                            return transactionList;
                        }
                        catch (err) {
                            throw new Error(err.message);
                        }
                    case "Week":
                        const curr = new Date(dateSelected);
                        const firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
                        const lastday = new Date(curr.setDate(firstday.getDate() + 7));
                        try {
                            const transactionList = yield dataPool.transaction.findMany({
                                where: {
                                    payment_date: {
                                        gte: firstday.toISOString(),
                                        lt: lastday.toISOString()
                                    },
                                }
                            });
                            return transactionList;
                        }
                        catch (err) {
                            throw new Error(err.message);
                        }
                    case "Month":
                        const inputMonth = new Date(dateSelected);
                        const currMonth = new Date(inputMonth.getFullYear(), inputMonth.getMonth());
                        const nextMonth = new Date(inputMonth.getFullYear(), inputMonth.getMonth() + 1);
                        try {
                            const transactionList = yield dataPool.transaction.findMany({
                                where: {
                                    payment_date: {
                                        gte: currMonth.toISOString(),
                                        lt: nextMonth.toISOString()
                                    },
                                }
                            });
                            return transactionList;
                        }
                        catch (err) {
                            throw new Error(err.message);
                        }
                    default:
                        const initMonth = new Date(dateSelected);
                        const firstMonth = new Date(initMonth.getFullYear(), initMonth.getMonth() - 3);
                        const lastMonth = new Date(initMonth.getFullYear(), initMonth.getMonth() + 1);
                        try {
                            const transactionList = yield dataPool.transaction.findMany({
                                where: {
                                    payment_date: {
                                        gte: firstMonth.toISOString(),
                                        lt: lastMonth.toISOString()
                                    },
                                }
                            });
                            return transactionList;
                        }
                        catch (err) {
                            throw new Error(err.message);
                        }
                }
            })
        },
    })
});
exports.RootMutation = new graphql_1.GraphQLObjectType({
    name: "RootMutation",
    description: "Root Mutation for Customers",
    fields: () => ({
        addCustomer: {
            type: graphqlObjects_1.CustomerObject,
            description: "Add a customer",
            args: {
                company_name: { type: graphql_1.GraphQLString },
                first_name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                last_name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                contact_number: { type: graphql_1.GraphQLString },
                email: { type: graphql_scalars_1.EmailAddressResolver },
                website: { type: graphql_1.GraphQLString },
                address: { type: graphql_1.GraphQLString },
                city: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                province: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) }
            },
            resolve: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
                if (!args.contact_number && !args.email && !args.website)
                    throw new Error("Need at least one contact information.");
                try {
                    const newCustomer = yield dataPool.customer.create({
                        data: {
                            company_name: args.company_name,
                            first_name: args.first_name,
                            last_name: args.last_name,
                            contact_number: args.contact_number,
                            email: args.email,
                            website: args.website,
                            address: args.address,
                            city: args.city,
                            province: args.province
                        }
                    });
                    return newCustomer;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        updateCustomer: {
            type: graphqlObjects_1.CustomerObject,
            description: "Update Customer Profile",
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
                company_name: { type: graphql_1.GraphQLString },
                first_name: { type: graphql_1.GraphQLString },
                last_name: { type: graphql_1.GraphQLString },
                contact_number: { type: graphql_1.GraphQLString },
                email: { type: graphql_scalars_1.EmailAddressResolver },
                website: { type: graphql_1.GraphQLString },
                address: { type: graphql_1.GraphQLString },
                city: { type: graphql_1.GraphQLString },
                province: { type: graphql_1.GraphQLString },
                is_active: { type: graphql_1.GraphQLBoolean }
            },
            resolve: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const updatedCustomer = yield dataPool.customer.update({
                        where: {
                            id: args.id
                        },
                        data: {
                            company_name: args.company_name != null ? args.company_name : undefined,
                            first_name: args.first_name != null ? args.first_name : undefined,
                            last_name: args.last_name != null ? args.last_name : undefined,
                            contact_number: args.contact_number != null ? args.contact_number : undefined,
                            email: args.email != null ? args.email : undefined,
                            website: args.website != null ? args.website : undefined,
                            address: args.address != null ? args.address : undefined,
                            city: args.city != null ? args.city : undefined,
                            province: args.province != null ? args.province : undefined,
                            is_active: args.is_active != null ? args.is_active : undefined
                        },
                    });
                    return updatedCustomer;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        removeCustomer: {
            type: graphqlObjects_1.CustomerObject,
            description: "Set Custoemr to inactive",
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) }
            },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                if (UnAuthorized.includes(context.position))
                    throw new Error("Unauthorized");
                try {
                    const removedCustomer = yield dataPool.customer.update({
                        where: {
                            id: args.id
                        },
                        data: {
                            is_active: false
                        }
                    });
                    return removedCustomer;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        permaDeleteCustomer: {
            type: graphqlObjects_1.CustomerObject,
            description: "Delete a Customer Permanently",
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) }
            },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                if (UnAuthorized.includes(context.position))
                    throw new Error("Unauthorized");
                try {
                    const deletedCustomer = yield dataPool.customer.delete({
                        where: {
                            id: args.id
                        }
                    });
                    return deletedCustomer;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        }
    })
});
//# sourceMappingURL=rootQueryMutations.js.map