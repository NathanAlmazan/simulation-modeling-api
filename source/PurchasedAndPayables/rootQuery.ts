import { GraphQLEnumType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { PayablesObject, PurchaseObject, SupplierObject } from "./graphqlObjects";
import { PrismaClient, Purchase, Supplier } from "@prisma/client";
import { DateTimeResolver } from "graphql-scalars";

const dataPool = new PrismaClient();

const DateRangeEnum = new GraphQLEnumType({
    name: "DateRanges",
    description: "The date range of entities to show",
    values: {
        DAY: { value: "Day" },
        WEEK: { value: "Week", },
        MONTH: { value: "Month" }
    }
});

interface SearchedName {
    id: number;
}


export const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    description: "Root query for account payables",
    fields: () => ({
        allActiveSuppliers: {
            type: GraphQLList(SupplierObject),
            resolve: async () => {
                try {
                    const suppliers = await dataPool.supplier.findMany({
                        where: { 
                            is_active: true,
                        }
                    });

                    return suppliers;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        allInactiveSuppliers: {
            type: GraphQLList(SupplierObject),
            resolve: async () => {
                try {
                    const suppliers = await dataPool.supplier.findMany({
                        where: { 
                            is_active: false,
                        }
                    });

                    return suppliers;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        allInactiveOrders: {
            type: GraphQLList(PurchaseObject),
            resolve: async () => {
                try {
                    const archived = await dataPool.purchase.findMany({
                        where: { 
                            is_active: false,
                        }
                    });

                    return archived;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        purchasedOrdersDelivery: {
            type: GraphQLList(PurchaseObject),
            resolve: async () => {
                try {
                    const delivery = await dataPool.purchase.findMany({
                        where: {
                            AND: {
                                is_active: true,
                                delivered: null
                            }
                        }
                    });

                    return delivery;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        purchasedOrderOverdue: {
            type: GraphQLList(PurchaseObject),
            resolve: async () => {
                try {
                    const currDate = new Date();
                    const overdueOrders = await dataPool.purchase.findMany({
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
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        searchSupplier: {
            type: SupplierObject,
            args: {
                supplierId: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: async (parent, args) => {
                try {
                    const supplier = await dataPool.supplier.findUnique({
                        where: { 
                            id: args.supplierId
                        }
                    });

                    return supplier;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        searchPurchasedOrders: { 
            type: PurchaseObject,
            args: {
                purchaseId: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: async (parent, args) => {
                try {
                    const purchase = await dataPool.purchase.findUnique({
                        where: {
                            id: args.purchaseId
                        }
                    });

                    return purchase;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        filteredByDueDate: {
            type: GraphQLList(PurchaseObject),
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
                            const orderList = await dataPool.purchase.findMany({ 
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
                        } catch (err) {
                            throw new Error((err as Error).message);
                        }
                    
                    case "Week":
                        const curr = new Date(dateSelected); 
                        const firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
                        const lastday = new Date(curr.setDate(firstday.getDate() + 7));

                        try { 
                            const orderList = await dataPool.purchase.findMany({ 
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
                            const orderList = await dataPool.purchase.findMany({ 
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
                            const orderList = await dataPool.purchase.findMany({ 
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
            type: GraphQLList(PurchaseObject),
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
                            const orderList = await dataPool.purchase.findMany({ 
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
                        } catch (err) {
                            throw new Error((err as Error).message);
                        }
                    
                    case "Week":
                        const curr = new Date(dateSelected); 
                        const firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
                        const lastday = new Date(curr.setDate(firstday.getDate() + 7));

                        try { 
                            const orderList = await dataPool.purchase.findMany({ 
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
                        } catch (err) {
                            throw new Error((err as Error).message);
                        }

                    case "Month":
                        const inputMonth = new Date(dateSelected);
                        const currMonth = new Date(inputMonth.getFullYear(), inputMonth.getMonth());
                        const nextMonth = new Date(inputMonth.getFullYear(), inputMonth.getMonth() + 1);

                        try {
                            const orderList = await dataPool.purchase.findMany({ 
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
                        } catch (err) {
                            throw new Error((err as Error).message);
                        }
                    default: 
                        const initMonth = new Date(dateSelected);
                        const firstMonth = new Date(initMonth.getFullYear(), initMonth.getMonth() - 3);
                        const lastMonth = new Date(initMonth.getFullYear(), initMonth.getMonth() + 1);

                        try {
                            const orderList = await dataPool.purchase.findMany({ 
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
                        } catch (err) {
                            throw new Error((err as Error).message);
                        }
                }

            }
        },
        filterOrdersBySupplier: {
            type: GraphQLList(PurchaseObject),
            args: {
                id: { type: GraphQLInt },
                supplier_name: { type: GraphQLString },
                invoiceId: { type: GraphQLString }
            },
            resolve: async (parent, args) => {
                if (args.id != null) {
                    try {
                        const order = await dataPool.purchase.findMany({
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
                else if (args.invoiceId != null) {
                    try {
                        const order = await dataPool.purchase.findMany({
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
                    } catch (err) {
                        throw new Error((err as Error).message);
                    }
                }
                else if (args.supplier_name != null) {
                    const supplierName = "%" + args.supplier_name + "%"
                    try {
                        const searchedSupplier = await dataPool.$queryRaw`SELECT id FROM "public"."Supplier" WHERE CONCAT(first_name, ' ', last_name) LIKE ${supplierName}`;
                        let orderList: Purchase[] = [];
                        for (let i = 0; i < (searchedSupplier as SearchedName[]).length; i++) {
                            const currSupplier = (searchedSupplier as SearchedName[])[i];
                            const orders = await dataPool.purchase.findMany({
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
                    } catch (err) {
                        throw new Error((err as Error).message);
                    }
                } else {
                    throw new Error("Invalid arguments.");
                }
            }
        },

        showPayables: {
            type: GraphQLList(PayablesObject),
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
                            const payablesList = await dataPool.payables.findMany({ 
                                where: { 
                                    payment_date: { 
                                        gte: dateSelected,
                                        lt: finalDate.toISOString()
                                    }           
                                },
                            });

                            return payablesList;
                        } catch (err) {
                            throw new Error((err as Error).message);
                        }
                    
                    case "Week":
                        const curr = new Date(dateSelected); 
                        const firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
                        const lastday = new Date(curr.setDate(firstday.getDate() + 7));

                        try { 
                            const payablesList = await dataPool.payables.findMany({ 
                                where: { 
                                    payment_date: { 
                                        gte: firstday.toISOString(),
                                        lt: lastday.toISOString()
                                    }           
                                },
                            });

                            return payablesList;
                        } catch (err) {
                            throw new Error((err as Error).message);
                        }

                    case "Month":
                        const inputMonth = new Date(dateSelected);
                        const currMonth = new Date(inputMonth.getFullYear(), inputMonth.getMonth());
                        const nextMonth = new Date(inputMonth.getFullYear(), inputMonth.getMonth() + 1);

                        try {
                            const payablesList = await dataPool.payables.findMany({ 
                                where: { 
                                    payment_date: { 
                                        gte: currMonth.toISOString(),
                                        lt: nextMonth.toISOString()
                                    }           
                                },
                            });

                            return payablesList;
                        } catch (err) {
                            throw new Error((err as Error).message);
                        }
                    default: 
                        const initMonth = new Date(dateSelected);
                        const firstMonth = new Date(initMonth.getFullYear(), initMonth.getMonth() - 3);
                        const lastMonth = new Date(initMonth.getFullYear(), initMonth.getMonth() + 1);

                        try {
                            const payablesList = await dataPool.payables.findMany({ 
                                where: { 
                                    payment_date: { 
                                        gte: firstMonth.toISOString(),
                                        lt: lastMonth.toISOString()
                                    }           
                                },
                            });

                            return payablesList;
                        } catch (err) {
                            throw new Error((err as Error).message);
                        }
                }

            }
        },
    })
})