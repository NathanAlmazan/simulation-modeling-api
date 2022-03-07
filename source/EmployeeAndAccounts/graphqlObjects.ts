import { GraphQLBoolean, GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { DateTimeResolver, EmailAddressResolver } from 'graphql-scalars';
import { PrismaClient, Account, Employee } from '@prisma/client';
import { OrderObject } from '../OrdersAndSales/graphqlObjects';
import { PurchaseObject } from '../PurchasedAndPayables/graphqlObjects';

const dataPool = new PrismaClient();    //database pool

export const PositionEnumType = new GraphQLEnumType({
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

export const ExecutivePosition = ["President", "Vice President", "Manager"];

export const EmployeeObject: GraphQLObjectType = new GraphQLObjectType({
    name: "Employee",
    description: "Company Employees",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        first_name: { type: GraphQLNonNull(GraphQLString) },
        last_name: { type: GraphQLNonNull(GraphQLString) },
        full_name: { 
            type: GraphQLNonNull(GraphQLString),
            resolve: (employee: Employee) => {
                return employee.first_name + " " + employee.last_name;
            }
        },
        contact_number: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(EmailAddressResolver) },
        address: { type: GraphQLNonNull(GraphQLString) },
        city: { type: GraphQLNonNull(GraphQLString) },
        province: { type: GraphQLNonNull(GraphQLString) },
        zip_code: { type: GraphQLInt },
        position: { type: GraphQLNonNull(PositionEnumType) },
        profile_image: { type: GraphQLString },
        is_active: { type: GraphQLBoolean },
        user_account: { type: AccountObject,
            resolve: async (employee: Employee) => {
                try {
                    const account = await dataPool.account.findUnique({
                        where: { 
                            employee_id: employee.id
                        }
                    });
                    return account;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        total_sold: {
            type: GraphQLFloat,
            args: {
                date: { type: DateTimeResolver }
            },
            resolve: async (employee: Employee, args) => {
                if (!args.date) {
                    const currYear = new Date().getFullYear();
                    const startDate = new Date(currYear, 0, 1);
                    const endDate = new Date(currYear, 12, 0);

                    const totalSold = await dataPool.order.aggregate({
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
                        throw new Error((err as Error).message);
                    });

                    const result = totalSold._sum.amount_due != null ? totalSold._sum.amount_due : 0;
                    return parseFloat(result.toFixed(2));
                } else {
                    const currYear = new Date(args.date).getFullYear();
                    const startDate = new Date(currYear, 0, 1);
                    const endDate = new Date(currYear, 12, 0);

                    const totalSold = await dataPool.order.aggregate({
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
                        throw new Error((err as Error).message);
                    });

                    const result = totalSold._sum.amount_due != null ? totalSold._sum.amount_due : 0;
                    return parseFloat(result.toFixed(2));
                }
            }
        },
        sales_report: {
            type: GraphQLList(GraphQLFloat),
            args: {
                date: { type: DateTimeResolver }
            },
            resolve: async (employee: Employee, args) => {
                if (!args.date) {
                    const currYear = new Date().getFullYear();
                    let salesHistory: number[] = [];
                    
                    for (let x = 0; x < 12; x++) {
                        const startDate = new Date(currYear, x, 1);
                        const endDate = new Date(currYear, (x+1), 0);

                        const totalSold = await dataPool.order.aggregate({
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
                            throw new Error((err as Error).message);
                        });

                        const result = totalSold._sum.amount_due != null ? totalSold._sum.amount_due : 0;
                        const amount = parseFloat(result.toFixed(2));

                        salesHistory.push(amount);
                    }

                    return salesHistory;

                } else {
                    const currYear = new Date(args.date).getFullYear();
                    let salesHistory: number[] = [];
                    
                    for (let x = 0; x < 12; x++) {
                        const startDate = new Date(currYear, x, 1);
                        const endDate = new Date(currYear, (x+1), 0);

                        const totalSold = await dataPool.order.aggregate({
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
                            throw new Error((err as Error).message);
                        });

                        const result = totalSold._sum.amount_due != null ? totalSold._sum.amount_due : 0;
                        const amount = parseFloat(result.toFixed(2));

                        salesHistory.push(amount);
                    }

                    return salesHistory;
                }
            }
        },
        all_sales: {
            type: GraphQLList(OrderObject),
            args: {
                date: { type: DateTimeResolver }
            },
            resolve: async (employee: Employee, args) => {
                if (!args.date) {
                    const currYear = new Date().getFullYear();
                    const startDate = new Date(currYear, 0, 1);
                    const endDate = new Date((currYear + 1), 0, 1);

                    try { 
                        const orderList = await dataPool.order.findMany({
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
                    } catch (err) {
                        throw new Error((err as Error).message);
                    }

                } else {
                    const currYear = new Date(args.date).getFullYear();
                    const startDate = new Date(currYear, 0, 1);
                    const endDate = new Date((currYear + 1), 0, 1);

                    try { 
                        const orderList = await dataPool.order.findMany({
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
                    } catch (err) {
                        throw new Error((err as Error).message);
                    }
                }
            } 
        }
    })
})

export const AccountObject: GraphQLObjectType = new GraphQLObjectType({
    name: "Account",
    description: "Employee Acoounts",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        employee: { type: GraphQLNonNull(EmployeeObject),
            resolve: async (account: Account) => {
                try {
                    const employee = await dataPool.employee.findFirst({
                        where: { 
                            user_account: { 
                                id: account.id
                            }
                        }
                    });
                    return employee;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            } 
        },
        encoded_orders: {
            type: GraphQLList(OrderObject),
            resolve: async (account: Account) => {
                try {
                    const orders = await dataPool.order.findMany({
                        where: { 
                            account_id: account.id,
                        }
                    });

                    return orders;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        encoded_purchase: {
            type: GraphQLList(PurchaseObject),
            resolve: async (account: Account) => {
                try {
                    const purchase = await dataPool.purchase.findMany({
                        where: {
                            account_id: account.id
                        }
                    });

                    return purchase;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        }
    })
});

export const LocationObject = new GraphQLObjectType({
    name: "locations",
    description: "Location scope of the Company",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        province: { type: GraphQLNonNull(GraphQLString) },
        city: { type: GraphQLNonNull(GraphQLString) }
    })
});
