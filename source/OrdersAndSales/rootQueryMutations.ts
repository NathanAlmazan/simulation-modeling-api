import { GraphQLBoolean, GraphQLEnumType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { CustomerObject, OrderObject, SalesObject, TransactionObject } from "./graphqlObjects";
import { Customer, Order, prisma, PrismaClient } from '@prisma/client';
import { DateTimeResolver, EmailAddressResolver } from "graphql-scalars";

const dataPool = new PrismaClient();    //database pool

const UnAuthorized = ["Warehouse Staff", "Delivery Personnel", "Sales Agent"];

interface TokenInterface {
    userId: number;
    username: string;
    position: string;
    iat: number;
    exp: number;
};

interface SearchedName {
    id: number;
}

const DateRangeEnum = new GraphQLEnumType({
    name: "DateRanges",
    description: "The date range of entities to show",
    values: {
        DAY: { value: "Day" },
        WEEK: { value: "Week", },
        MONTH: { value: "Month" }
    }
});

export const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    description: "Queries to all sales orders",
    fields: () => ({
        showCustomerOrders: {
            type: GraphQLList(OrderObject),
            description: "Return all customer orders",
            args: {
                customer_id: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: async (parent, args) => {
                try { 
                    const customerOrders = await dataPool.order.findMany({
                        where: {
                            customer_id: args.customer_id,
                            is_active: true
                        },
                        orderBy: {
                            order_date: 'desc'
                        }
                    });
                    return customerOrders;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        searchOrder: {
            type: OrderObject,
            description: "Find order by ID",
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: async (parent, args) => {
                try {
                    const order = await dataPool.order.findUnique({
                        where: {
                            id: args.id
                        }
                    });
                    return order;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        searchManyOrders: {
            type: GraphQLList(OrderObject),
            description: "Find orders by id, customer or agent",
            args: {
                id: { type: GraphQLInt },
                customer_name: { type: GraphQLString },
                agent_name: { type: GraphQLString }
            },
            resolve: async (parent, args) => {
                if (args.id != null) {
                    try {
                        const order = await dataPool.order.findMany({
                            where: {
                                AND: { 
                                    id: args.id,
                                    is_active: true,
                                }
                                
                            }
                        });
                        return order;
                    } catch (err) {
                        throw new Error((err as Error).message);
                    }
                }
                else if (args.customer_name != null) {
                    const customerName = "%" + args.customer_name + "%"
                    try {
                        const searchedCustomers = await dataPool.$queryRaw`SELECT id FROM "public"."Customer" WHERE CONCAT(first_name, ' ', last_name) LIKE ${customerName}`;
                        let orderList: Order[] = [];
                        for (let i = 0; i < (searchedCustomers as SearchedName[]).length; i++) {
                            const currCustomer = (searchedCustomers as SearchedName[])[i];
                            const orders = await dataPool.order.findMany({
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
                    } catch (err) {
                        throw new Error((err as Error).message);
                    }
                }
                else if (args.agent_name != null) {
                    const agentName = "%" + args.agent_name + "%"
                    try {
                        const searchedAgents = await dataPool.$queryRaw`SELECT id FROM "public"."Employee" WHERE CONCAT(first_name, ' ', last_name) LIKE ${agentName}`;
                        let orderList: Order[] = [];
                        for (let i = 0; i < (searchedAgents as SearchedName[]).length; i++) {
                            const currAgent = (searchedAgents as SearchedName[])[i];
                            const orders = await dataPool.order.findMany({
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
                    } catch (err) {
                        throw new Error((err as Error).message);
                    }
                } else {
                    throw new Error("Invalid arguments.");
                }
            }
        },


        showOnHoldOrders: {
            type: GraphQLList(OrderObject),
            description: "Return all Orders that are on hold",
            resolve: async () => {
                try {
                    const holdOrders = await dataPool.order.findMany({
                        where: { 
                            is_active: false
                        },
                        orderBy: {
                            order_date: 'desc'
                        }
                    });
                    return holdOrders;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        showOverdueOrders: {
            type: GraphQLList(OrderObject),
            description: "Return all Orders that are overdue",
            resolve: async () => {
                try {
                    const overdueOrders = await dataPool.order.findMany({
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
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        showOrdersToBeDelivered: { 
            type: GraphQLList(OrderObject),
            description: "Return all Orders that are overdue",
            resolve: async () => {
                try {
                    const toBeDelivered = await dataPool.order.findMany({
                        where: { 
                            AND: { 
                                delivered: null,
                                is_active: true
                            } 
                        }
                    });
                    return toBeDelivered;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        showSales: {
            type: GraphQLList(SalesObject),
            description: "Return all sales with or without given date",
            args: {
                startDate: { type: DateTimeResolver },
                endDate: { type: DateTimeResolver }
            },
            resolve: async (parent, args) => {
                if (args.startDate && args.endDate) {
                    try {
                        const salesOrder = await dataPool.sales.findMany({
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
                    } catch (err) { 
                        throw new Error((err as Error).message);
                    }
                }
                else if (!args.startDate && !args.endDate) {
                    try {
                        const salesOrder = await dataPool.sales.findMany({
                            where: {
                                date_paid: {
                                    lte: new Date()
                                }
                            },
                            take: 20
                        });
                        return salesOrder;
                    } catch (err) { 
                        throw new Error((err as Error).message);
                    }
                }
                else throw new Error("Invalid arguments.")
            }
        },

        showAllCustomers: {
            type: GraphQLList(CustomerObject),
            description: "Return all comany customers",
            resolve: async () => {
                try {
                    const allCustomers = await dataPool.customer.findMany({
                        where: { 
                            is_active: true
                        },
                        orderBy: {
                            id: 'asc'
                        }
                    });
                    return allCustomers;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        showArchivedCustomers: {
            type: GraphQLList(CustomerObject),
            description: "Return all comany customers",
            resolve: async () => {
                try {
                    const allCustomers = await dataPool.customer.findMany({
                        where: { 
                            is_active: false
                        },
                        orderBy: {
                            id: 'asc'
                        }
                    });
                    return allCustomers;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        searchCustomer: {
            type: CustomerObject,
            description: "Search customer by id, name, email, contact number, company name, city and Province",
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: async (parent, args) => {
                if (!args) throw new Error("Invalid arguments.");
                try {
                    const resultCustomer = await dataPool.customer.findUnique({
                        where: { 
                            id: args.id
                        },
                    });
                    return resultCustomer;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        filteredByDueDate: {
            type: GraphQLList(OrderObject),
            description: "Filter Orders by Due Date",
            args: { 
                date_range: { type: GraphQLNonNull(DateRangeEnum) },
                date_selected: { type: GraphQLNonNull(DateTimeResolver) },
            },
            resolve: async (parent, args) => {
                const dateRange = args.date_range;
                const dateSelected = args.date_selected;

                switch (dateRange) {
                    case "Day":
                        let finalDate = new Date(dateSelected);
                        finalDate.setDate(finalDate.getDate() + 1);
                        try {
                            const orderList = await dataPool.order.findMany({ 
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
                        } catch (err) {
                            throw new Error((err as Error).message);
                        }
                    
                    case "Week":
                        const curr = new Date(dateSelected); 
                        const firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
                        const lastday = new Date(curr.setDate(firstday.getDate() + 7));

                        try { 
                            const orderList = await dataPool.order.findMany({ 
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
                        } catch (err) {
                            throw new Error((err as Error).message);
                        }

                    case "Month":
                        const inputMonth = new Date(dateSelected);
                        const currMonth = new Date(inputMonth.getFullYear(), inputMonth.getMonth());
                        const nextMonth = new Date(inputMonth.getFullYear(), inputMonth.getMonth() + 1);

                        try {
                            const orderList = await dataPool.order.findMany({ 
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
                        } catch (err) {
                            throw new Error((err as Error).message);
                        }
                    default: 
                        const initMonth = new Date(dateSelected);
                        const firstMonth = new Date(initMonth.getFullYear(), initMonth.getMonth() - 3);
                        const lastMonth = new Date(initMonth.getFullYear(), initMonth.getMonth() + 1);

                        try {
                            const orderList = await dataPool.order.findMany({ 
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
                        } catch (err) {
                            throw new Error((err as Error).message);
                        }
                }

            }
        },

        filteredByOrderDate: {
            type: GraphQLList(OrderObject),
            description: "Filter Orders by Order Date",
            args: { 
                date_range: { type: GraphQLNonNull(DateRangeEnum) },
                date_selected: { type: GraphQLNonNull(DateTimeResolver) },
            },
            resolve: async (parent, args) => {
                const dateRange = args.date_range;
                const dateSelected = args.date_selected;

                switch (dateRange) {
                    case "Day":
                        let finalDate = new Date(dateSelected);
                        finalDate.setDate(finalDate.getDate() + 1);
                        try {
                            const orderList = await dataPool.order.findMany({ 
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
                        } catch (err) {
                            throw new Error((err as Error).message);
                        }
                    
                    case "Week":
                        const curr = new Date(dateSelected); 
                        const firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
                        const lastday = new Date(curr.setDate(firstday.getDate() + 7));

                        try { 
                            const orderList = await dataPool.order.findMany({ 
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
                        } catch (err) {
                            throw new Error((err as Error).message);
                        }

                    case "Month":
                        const inputMonth = new Date(dateSelected);
                        const currMonth = new Date(inputMonth.getFullYear(), inputMonth.getMonth());
                        const nextMonth = new Date(inputMonth.getFullYear(), inputMonth.getMonth() + 1);

                        try {
                            const orderList = await dataPool.order.findMany({ 
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
                        } catch (err) {
                            throw new Error((err as Error).message);
                        }
                    default: 
                        const initMonth = new Date(dateSelected);
                        const firstMonth = new Date(initMonth.getFullYear(), initMonth.getMonth() - 3);
                        const lastMonth = new Date(initMonth.getFullYear(), initMonth.getMonth() + 1);

                        try {
                            const orderList = await dataPool.order.findMany({ 
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
                        } catch (err) {
                            throw new Error((err as Error).message);
                        }
                }

            }
        },

        showTransactions: {
            type: GraphQLList(TransactionObject),
            description: "Show the transations in a specific range of time",
            args: { 
                date_range: { type: GraphQLNonNull(DateRangeEnum) },
                date_selected: { type: GraphQLNonNull(DateTimeResolver) },
            },
            resolve: async (parent, args) => {
                const dateRange = args.date_range;
                const dateSelected = args.date_selected;

                switch (dateRange) {
                    case "Day":
                        let finalDate = new Date(dateSelected);
                        finalDate.setDate(finalDate.getDate() + 1);
                        try {
                            const transactionList = await dataPool.transaction.findMany({ 
                                where: { 
                                    payment_date: {
                                        gte: dateSelected,
                                        lt: finalDate.toISOString()
                                    },   
                                }
                            });

                            return transactionList;
                        } catch (err) {
                            throw new Error((err as Error).message);
                        }
                    
                    case "Week":
                        const curr = new Date(dateSelected); 
                        const firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
                        const lastday = new Date(curr.setDate(firstday.getDate() + 7));

                        try { 
                            const transactionList = await dataPool.transaction.findMany({ 
                                where: { 
                                    payment_date: {
                                        gte: firstday.toISOString(),
                                        lt: lastday.toISOString()
                                    },   
                                }
                            });

                            return transactionList;
                        } catch (err) {
                            throw new Error((err as Error).message);
                        }

                    case "Month":
                        const inputMonth = new Date(dateSelected);
                        const currMonth = new Date(inputMonth.getFullYear(), inputMonth.getMonth());
                        const nextMonth = new Date(inputMonth.getFullYear(), inputMonth.getMonth() + 1);

                        try {
                            const transactionList = await dataPool.transaction.findMany({ 
                                where: { 
                                    payment_date: {
                                        gte: currMonth.toISOString(),
                                        lt: nextMonth.toISOString()
                                    },   
                                }
                            });

                            return transactionList;
                        } catch (err) {
                            throw new Error((err as Error).message);
                        }
                    default: 
                        const initMonth = new Date(dateSelected);
                        const firstMonth = new Date(initMonth.getFullYear(), initMonth.getMonth() - 3);
                        const lastMonth = new Date(initMonth.getFullYear(), initMonth.getMonth() + 1);

                        try {
                            const transactionList = await dataPool.transaction.findMany({ 
                                where: { 
                                    payment_date: {
                                        gte: firstMonth.toISOString(),
                                        lt: lastMonth.toISOString()
                                    },   
                                }
                            });

                            return transactionList;
                        } catch (err) {
                            throw new Error((err as Error).message);
                        }
                }
            }
        },
    })
})

export const RootMutation = new GraphQLObjectType({
    name: "RootMutation",
    description: "Root Mutation for Customers",
    fields: () => ({
        addCustomer: {
            type: CustomerObject,
            description: "Add a customer",
            args: { 
                company_name: { type: GraphQLString },
                first_name: { type: GraphQLNonNull(GraphQLString) },
                last_name: { type: GraphQLNonNull(GraphQLString) },
                contact_number: { type: GraphQLString },
                email: { type: EmailAddressResolver },
                website: { type: GraphQLString },
                address: { type: GraphQLString },
                city: { type: GraphQLNonNull(GraphQLString) },
                province: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parent, args) => {
                if (!args.contact_number && !args.email && !args.website) throw new Error("Need at least one contact information.");
                try {
                    const newCustomer = await dataPool.customer.create({
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
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        updateCustomer: {
            type: CustomerObject,
            description: "Update Customer Profile",
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
                company_name: { type: GraphQLString },
                first_name: { type: GraphQLString },
                last_name: { type: GraphQLString },
                contact_number: { type: GraphQLString },
                email: { type: EmailAddressResolver },
                website: { type: GraphQLString },
                address: { type: GraphQLString },
                city: { type: GraphQLString },
                province: { type: GraphQLString },
                is_active: { type: GraphQLBoolean }
            },
            resolve: async (parent, args) => {
                try {
                    const updatedCustomer = await dataPool.customer.update({
                        where: {
                            id: args.id
                        },
                        data: {
                            company_name: (args as Customer).company_name != null ? (args as Customer).company_name : undefined,
                            first_name: (args as Customer).first_name != null ? (args as Customer).first_name : undefined,
                            last_name: (args as Customer).last_name != null ? (args as Customer).last_name : undefined,
                            contact_number: (args as Customer).contact_number != null ? (args as Customer).contact_number : undefined,
                            email: (args as Customer).email != null ? (args as Customer).email : undefined,
                            website: (args as Customer).website != null ? (args as Customer).website : undefined,
                            address: (args as Customer).address != null ? (args as Customer).address : undefined,
                            city: (args as Customer).city != null ? (args as Customer).city : undefined,
                            province: (args as Customer).province != null ? (args as Customer).province : undefined,
                            is_active: (args as Customer).is_active != null ? (args as Customer).is_active : undefined
                        },
                    });
                    return updatedCustomer;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        removeCustomer: {
            type: CustomerObject,
            description: "Set Custoemr to inactive",
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: async (parent, args, context: TokenInterface) => {
                if (UnAuthorized.includes(context.position)) throw new Error("Unauthorized");
                try {
                    const removedCustomer = await dataPool.customer.update({
                        where: {
                            id: args.id
                        },
                        data: {
                            is_active: false
                        }
                    });
                    return removedCustomer;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        permaDeleteCustomer: {
            type: CustomerObject,
            description: "Delete a Customer Permanently",
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: async (parent, args, context: TokenInterface) => {
                if (UnAuthorized.includes(context.position)) throw new Error("Unauthorized");
                try {
                    const deletedCustomer = await dataPool.customer.delete({
                        where: {
                            id: args.id
                        }
                    });
                    
                    return deletedCustomer;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        }
    })
})