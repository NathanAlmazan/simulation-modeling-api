import { PrismaClient } from "@prisma/client";
import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { DateTimeResolver } from "graphql-scalars";
import { ExecutivePosition } from "../EmployeeAndAccounts/graphqlObjects";

const dataPool = new PrismaClient();

export const StatusReport: GraphQLObjectType = new GraphQLObjectType({
    name: "StatusReport",
    description: "Current Status of the Company",
    fields: () => ({
        receivables_count: {
            type: GraphQLInt,
            resolve: async () => {
                try {
                    const receivables = await dataPool.order.count({
                        where: {
                            sold: null
                        }
                    });

                    return receivables;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        payables_count: {
            type: GraphQLInt,
            resolve: async () => {
                try {
                    const payables = await dataPool.purchase.count({
                        where: {
                            is_paid: false
                        }
                    });

                    return payables;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        shipping_count: { 
            type: GraphQLInt,
            resolve: async () => {
                try {
                    const shipping = await dataPool.order.count({
                        where: {
                            delivered: null
                        }
                    });

                    return shipping;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        arriving_count: {
            type: GraphQLInt,
            resolve: async () => {
                try {
                    const arriving = await dataPool.purchase.count({
                        where: {
                            delivered: null
                        }
                    });

                    return arriving;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        sales_report: {
            type: GraphQLList(SalesReport),
            args: {
                selected_date: { type: DateTimeResolver }
            },
            resolve: async (parent, args) => {
                const dateArgs = new Date(args.selected_date);
                dateArgs.setMonth(dateArgs.getMonth() + 1);
                let datePointer = new Date(args.selected_date);
                let salesHistory: { start_date: string, end_date: string, total_sales: number, total_purchase: number }[] = [];

                while (datePointer.getTime() < dateArgs.getTime()) {
                    const firstday = new Date(datePointer.setDate(datePointer.getDate() - datePointer.getDay()));
                    const lastday = new Date(datePointer.setDate(firstday.getDate() + 7));

                    try { 
                        const totalSales = await dataPool.transaction.aggregate({
                            where: {
                                payment_date: { 
                                    gte: firstday.toISOString(),
                                    lt: lastday.toISOString()
                                }
                            },
                            _sum: {
                                amount_paid: true
                            }
                        });

                        const totalPurchase = await dataPool.payables.aggregate({
                            where: {
                                payment_date: { 
                                    gte: firstday.toISOString(),
                                    lt: lastday.toISOString()
                                }
                            },
                            _sum: {
                                amount_paid: true
                            }
                        });

                        const sumTransaction = totalSales._sum.amount_paid !== null ? totalSales._sum.amount_paid : 0;
                        const sumPayables = totalPurchase._sum.amount_paid !== null ? totalPurchase._sum.amount_paid : 0;

                        salesHistory.push({
                            start_date: firstday.toISOString(),
                            end_date: lastday.toISOString(),
                            total_purchase: parseFloat(sumPayables.toFixed(2)),
                            total_sales:  parseFloat(sumTransaction.toFixed(2))
                        });
                    } catch (err) {
                        throw new Error((err as Error).message);
                    }

                    datePointer = lastday;
                }

                return salesHistory;
                
            }
        },
        category_statistics: {
            type: GraphQLList(CategoryReport),
            args: {
                selected_date: { type: DateTimeResolver }
            },
            resolve: async (parent, args) => {
                const year = new Date(args.selected_date).getFullYear();
                const startDate = new Date(year, 0, 1);
                const endDate = new Date((year + 1), 0, 1);

                let categoryReport: { category_name: string, total_sold: number }[] = [];

                try {
                    const getAllCategories = await dataPool.category.findMany();
                    
                    for (let x=0; x < getAllCategories.length; x++) {
                        const currCategory = getAllCategories[x];

                        try { 
                            const orderCount = await dataPool.orderWithProduct.count({ 
                                where: {
                                    AND: {
                                        product: {
                                            category_id: currCategory.id
                                        },
                                        order: {
                                            order_date: {
                                                gte: startDate.toISOString(),
                                                lt: endDate.toISOString()
                                            }
                                        }
                                    }
                                }
                            });

                            categoryReport.push({
                                category_name: currCategory.name,
                                total_sold: orderCount
                            });
                        } catch (err) {
                            throw new Error((err as Error).message);
                        }
                    }

                    const sortedCategory = categoryReport.sort(function(a, b){ return b.total_sold - a.total_sold });
                    return sortedCategory.slice(0, 6);
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        top_agents: {
            type: GraphQLList(AgentReport),
            args: {
                selected_date: { type: DateTimeResolver }
            },
            resolve: async (parent, args) => {
                const year = new Date(args.selected_date).getFullYear();
                const startDate = new Date(year, 0, 1);
                const endDate = new Date((year + 1), 0, 1);

                let agentReport: { agent_name: string, total_sales: number }[] = [];

                try {
                    const allAgents = await dataPool.employee.findMany({
                        where: {
                            AND: {
                                position: "Sales Agent",
                                is_active: true
                            }
                        }
                    });

                    for (let i = 0; i < allAgents.length; i++) {
                        const currAgent = allAgents[i]

                        const totalSales = await dataPool.order.aggregate({
                            where: { 
                                AND: { 
                                    order_date: {
                                        gte: startDate.toISOString(),
                                        lt: endDate.toISOString()
                                    },
                                    is_active: true,
                                    employee_id: currAgent.id
                                }
                            },
                            _sum: {
                                amount_due: true
                            }
                        });

                        const sumSold = totalSales._sum.amount_due !== null ? totalSales._sum.amount_due : 0;

                        agentReport.push({
                            agent_name: currAgent.first_name + " " + currAgent.last_name,
                            total_sales: parseFloat(sumSold.toFixed(2))
                        })
                    }

                    const sortedAgentReport = agentReport.sort(function(a, b){return b.total_sales - a.total_sales});

                    return sortedAgentReport.slice(0, 10);
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        order_timeline: {
            type: GraphQLList(EventReport),
            args: {
                selected_date: { type: DateTimeResolver }
            },
            resolve: async (parent, args) => {
                const dateArgs = new Date(args.selected_date);
                const firstday = new Date(dateArgs.setDate(dateArgs.getDate() - dateArgs.getDay()));
                let finalDate = firstday;
                let timeline: { start_date: string, end_date: string }[] = [];

                for (let i = 0; i < 7; i++) {
                    const result = { start_date: '', end_date: '' };
                    const startDate = new Date(finalDate);
                    result.start_date = startDate.toISOString();
                    const endDate = new Date(startDate.setDate(startDate.getDate() + 1));
                    result.end_date = endDate.toISOString();

                    timeline.push(result);

                    finalDate = endDate;
                }

                return timeline;
            }
        },
        product_status: { 
            type: GraphQLList(ProductStatus),
            resolve: async () => {
                try {
                    const products = await dataPool.product.findMany({ 
                        orderBy: { 
                            stocks: 'asc'
                        },
                        take: 10,
                        select: {
                            name: true,
                            stocks: true
                        }
                    });

                    return products;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        notifications: {
            type: GraphQLList(NotificationObject),
            resolve: async (parent, args, context: TokenInterface) => {
                const ExecutivePosition = ["President", "Vice President", "Manager"];
                const CustomPosition = ["President", "Vice President", "Manager", "Accountant", "Cashier"];
                const Personnel = ["Warehouse Staff",  "Delivery Personnel"];
                let notifications: { title: string, description: string, createdAt: Date, isUnRead: boolean, link: string | null}[] = [];

                if (context.position == "Sales Agent") {
                    try {
                        const dueOrders = await dataPool.order.count({
                            where: {
                                AND: {
                                    employee_id: context.userId,
                                    sold: null,
                                    is_active: true
                                }
                            }
                        })

                        if (dueOrders != 0) {
                            notifications.push({
                                title: "Need to collect",
                                description: `${dueOrders} unpaid clients' order`, 
                                createdAt: new Date(),
                                isUnRead: true,
                                link: `/employees/profile/${context.userId}`
                            });
                        }

                        return notifications;

                    } catch (err) {
                        throw new Error((err as Error).message);
                    }
                }
                    
                
                try {
                    const currDate1 = new Date();
                    const dueOrders = await dataPool.order.count({
                        where: {
                            AND: {
                                sold: null,
                                is_active: true,
                                due_date: {
                                    gte: currDate1.toISOString(),
                                    lt: new Date(currDate1.setDate(currDate1.getDate() + 1)).toISOString()
                                }
                            }
                        }
                    });

                    if (dueOrders != 0) {
                        notifications.push({
                            title: "Orders due today",
                            description: `term of ${dueOrders} sales order due today`, 
                            createdAt: new Date(),
                            isUnRead: true,
                            link: '/orders'
                        });
                    }

                    const currDate2 = new Date();
                    const duePurchase = await dataPool.purchase.count({
                        where: {
                            AND: {
                                is_active: true,
                                is_paid: false, 
                                due_date: {
                                    gte: currDate2.toISOString(),
                                    lt: new Date(currDate2.setDate(currDate2.getDate() + 1)).toISOString()
                                }
                            }
                        }
                    });

                    if (duePurchase != 0) {
                        notifications.push({
                            title: "Payables due today",
                            description: `term of ${duePurchase} orders we purchased due today`, 
                            createdAt: new Date(),
                            isUnRead: true,
                            link: '/purchase'
                        });
                    }

                    const currDate3 = new Date();
                    const overdueOrders = await dataPool.order.count({
                        where: {
                            AND: {
                                sold: null,
                                is_active: true,
                                due_date: {
                                    lt: new Date(currDate3.setDate(currDate3.getDate() - 1)).toISOString()
                                }
                            }
                        }
                    });

                    if (overdueOrders != 0) {
                        notifications.push({
                            title: "Overdue orders",
                            description: `term of ${overdueOrders} sales order ended but still unpaid`, 
                            createdAt: currDate3,
                            isUnRead: true,
                            link: '/orders/overdue'
                        });
                    }

                    const currDate4 = new Date();
                    const overduePurchase = await dataPool.purchase.count({
                        where: {
                            AND: {
                                is_paid: false,
                                is_active: true,
                                due_date: {
                                    lt: new Date(currDate4.setDate(currDate4.getDate() - 1)).toISOString()
                                }
                            }
                        }
                    });

                    if (overduePurchase != 0) {
                        notifications.push({
                            title: "Overdue credits",
                            description: `${overduePurchase} payables lapsed on due date`, 
                            createdAt: currDate4,
                            isUnRead: true,
                            link: '/purchase/overdue'
                        });
                    }

                    const products = await dataPool.product.count({
                        where: {
                            stocks: {
                                lte: 10
                            }
                        }
                    });

                    if (products != 0) {
                        notifications.push({
                            title: "Out of stock",
                            description: products > 1 ? `Stock of ${products} products are on critical level` : `Stock of ${products} product is on critical level`, 
                            createdAt: new Date(),
                            isUnRead: true,
                            link: '/products'
                        });
                    }

                    if (new Date().getDay() == 5 && ExecutivePosition.includes(context.position)) {
                        notifications.push({
                            title: "Backup your data",
                            description: "Please don't forget to download your backup data regularly.", 
                            createdAt: new Date(),
                            isUnRead: true,
                            link: null
                        });
                    }

                    const orderDelivery = await dataPool.order.count({
                        where: {
                            AND: {
                                is_active: true,
                                delivered: null
                            }
                        }
                    });

                    if (orderDelivery != 0 && Personnel.includes(context.position)) {
                        notifications.push({
                            title: "Shipping queue",
                            description: `${orderDelivery} orders waiting to be delivered`, 
                            createdAt: currDate4,
                            isUnRead: true,
                            link: '/orders/delivery'
                        });
                    }

                    const purchaseDelivery = await dataPool.purchase.count({
                        where: {
                            AND: {
                                is_active: true,
                                delivered: null
                            }
                        }
                    });

                    if (purchaseDelivery != 0 && Personnel.includes(context.position)) {
                        notifications.push({
                            title: "Arriving Stocks",
                            description: `${purchaseDelivery} orders waiting to arrive`, 
                            createdAt: currDate4,
                            isUnRead: true,
                            link: '/purchase/shipment'
                        });
                    }

                    const currDate5 = new Date();
                    const newOrders = await dataPool.order.count({
                        where: {
                            AND: {
                                is_active: true,
                                order_date: {
                                    gte: currDate5.toISOString(),
                                    lt: new Date(currDate5.setDate(currDate5.getDate() + 1)).toISOString()
                                }
                            }
                        }
                    })
                    
                    if (newOrders != 0 && CustomPosition.includes(context.position)) {
                        notifications.push({
                            title: "New Orders",
                            description: `${newOrders} orders are placed today`, 
                            createdAt: currDate4,
                            isUnRead: true,
                            link: '/orders'
                        });
                    }

                    const currDate6 = new Date();
                    const receivables = await dataPool.transaction.aggregate({
                        where: { 
                            payment_date: {
                                gte: currDate6.toISOString(),
                                lt: new Date(currDate6.setDate(currDate6.getDate() + 1)).toISOString()
                            }
                        },
                        _sum: {
                            amount_paid: true
                        }
                    })

                    const totalReceivables = receivables._sum.amount_paid !== null ? parseFloat(receivables._sum.amount_paid.toFixed(2)) : 0;

                    if (totalReceivables != 0 && ExecutivePosition.includes(context.position)) {
                        notifications.push({
                            title: "Total receivables",
                            description: `₱ ${totalReceivables} of payment received today`, 
                            createdAt: currDate4,
                            isUnRead: true,
                            link: '/transactions'
                        });
                    }

                    return notifications;

                } catch (err) {
                    throw new Error((err as Error).message);
                }

            }
        }
    })
})

interface TokenInterface {
    userId: number;
    username: string;
    position: string;
    iat: number;
    exp: number;
};

interface StatusArgs {
    start_date: string;
    end_date: string;
}

const NotificationObject: GraphQLObjectType = new GraphQLObjectType({
    name: 'NotificationObject',
    fields: () => ({
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        createdAt: { type: DateTimeResolver },
        isUnRead: { type: GraphQLBoolean },
        link: { type: GraphQLString }
    })
})

const ProductStatus: GraphQLObjectType = new GraphQLObjectType({
    name: 'ProductStatus',
    fields: () => ({
        name: { type: GraphQLString },
        stocks: { type: GraphQLInt }
    })
})

const SalesReport: GraphQLObjectType = new GraphQLObjectType({
    name: 'SalesReport',
    fields: () => ({
        start_date: { type: GraphQLString },
        end_date: { type: GraphQLString },
        total_sales: { type: GraphQLFloat },
        total_purchase: { type: GraphQLFloat }
    })
})

const CategoryReport: GraphQLObjectType = new GraphQLObjectType({
    name: 'CategoryReport',
    fields: () => ({
        category_name: { type: GraphQLString },
        total_sold: { type: GraphQLInt }
    })
})

const AgentReport: GraphQLObjectType = new GraphQLObjectType({
    name: 'AgentReport',
    fields: () => ({
        agent_name: { type: GraphQLString },
        total_sales: { type: GraphQLFloat }
    })
})

const EventReport: GraphQLObjectType = new GraphQLObjectType({
    name: 'CurrentReport',
    fields: () => ({
        start_date: { type: DateTimeResolver },
        end_date: { type: DateTimeResolver },
        new_orders: { 
            type: GraphQLInt,
            resolve: async (parent: StatusArgs) => {
                try {
                    const newOrders = await dataPool.order.count({
                        where: { 
                            AND: {
                                is_active: true,
                                order_date: {
                                    gte: new Date(parent.start_date).toISOString(),
                                    lt: new Date(parent.end_date).toISOString()
                                }
                            }
                        }
                    });

                    return newOrders;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        paid_orders: { 
            type: GraphQLInt,
            resolve: async (parent: StatusArgs) => {
                try {
                    const paidOrders = await dataPool.sales.count({
                        where: {
                            date_paid: {
                                gte: new Date(parent.start_date).toISOString(),
                                lt: new Date(parent.end_date).toISOString()
                            }
                        }
                    });

                    return paidOrders;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        total_overdue: { 
            type: GraphQLInt,
            resolve: async (parent: StatusArgs) => {
                try {
                    const overdueOrders = await dataPool.order.count({
                        where: {
                            due_date: {
                                lt: new Date(parent.start_date).toISOString()
                            }
                        }
                    });

                    return overdueOrders;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        due_orders: { 
            type: GraphQLInt,
            resolve: async (parent: StatusArgs) => {
                try {
                    const overdueOrders = await dataPool.order.count({
                        where: {
                            AND: {
                                is_active: true,
                                due_date: {
                                    gte: new Date(parent.start_date).toISOString(),
                                    lt: new Date(parent.end_date).toISOString()
                                }
                            }
                        }
                    });

                    return overdueOrders;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        due_credits: {
            type: GraphQLInt,
            resolve: async (parent: StatusArgs) => {
                try {
                    const dueCredits = await dataPool.purchase.count({
                        where: {
                            AND: {
                                is_active: false,
                                due_date: {
                                    gte: new Date(parent.start_date).toISOString(),
                                    lt: new Date(parent.end_date).toISOString()
                                }
                            }
                        }
                    });

                    return dueCredits;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        }
    })
})