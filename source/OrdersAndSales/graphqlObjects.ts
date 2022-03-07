import { Customer, Order, PrismaClient, Sales, Transaction } from "@prisma/client";
import { GraphQLBoolean, GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { DateTimeResolver, EmailAddressResolver } from "graphql-scalars";
import { AccountObject, EmployeeObject } from "../EmployeeAndAccounts/graphqlObjects";
import { ProductObject } from "../Products/graphqlObjects";

const dataPool = new PrismaClient();

export const PaymentTypeEnum = new GraphQLEnumType({
    name: "PaymentTypes",
    description: "Different payment method the company accepts",
    values: { 
        CREDIT: { value: "Credit" },
        CHEQUE: { value: "Cheque" },
        CASH: { value: "Cash" }
    }
})

export const OrderWithProducts: GraphQLObjectType = new GraphQLObjectType({
    name: "OrderWithProducts",
    description: "Products detail inside orders",
    fields: () => ({
        product: { 
            type: GraphQLNonNull(ProductObject),
            resolve: async (parent) => {
                return parent.product;
            }
         },
        quantity: { type: GraphQLNonNull(GraphQLInt) },
        total_price: { type: GraphQLNonNull(GraphQLFloat) }
    })
})

export const OrderObject: GraphQLObjectType = new GraphQLObjectType({
    name: "Orders",
    description: "Customer orders",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        employee: {
            type: GraphQLNonNull(EmployeeObject),
            resolve: async (order: Order) => {
                try {
                    const employee = await dataPool.employee.findUnique({ 
                        where: {
                            id: order.employee_id
                        }
                    });
                    return employee;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        account: {
            type: GraphQLNonNull(AccountObject),
            resolve: async (order: Order) => {
                try {
                    const account = await dataPool.account.findUnique({
                        where: {
                            id: order.account_id
                        }
                    });
                    return account;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        customer: {
            type: GraphQLNonNull(CustomerObject),
            resolve: async (order: Order) => {
                try {
                    const customer = await dataPool.customer.findUnique({
                        where: {
                            id: order.customer_id
                        }
                    });
                    return customer;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        products: {
            type: GraphQLList(OrderWithProducts),
            resolve: async (order: Order) => {
                try {
                    const orderProducts = await dataPool.orderWithProduct.findMany({
                        where: {
                            order_id: order.id
                        },
                        include: {
                            product: true
                        }
                    });

                    return orderProducts;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        payment_type: { type: GraphQLNonNull(PaymentTypeEnum) },
        vat: { type: GraphQLFloat },
        discount: { type: GraphQLFloat },
        total_price: { type: GraphQLNonNull(GraphQLFloat) },
        amount_due: { type: GraphQLNonNull(GraphQLFloat) },
        order_date: { type: DateTimeResolver },
        due_date: { type: GraphQLNonNull(DateTimeResolver) },
        delivered: { type: DateTimeResolver },
        inv_fileName: { type: GraphQLString },
        receipt_file: { type: GraphQLString },
        is_active: { type: GraphQLBoolean },
        paid: { 
            type: GraphQLBoolean,
            resolve: async (order: Order) => {
                try {
                    const sold = await dataPool.sales.findUnique({
                        where: {
                            order_id: order.id
                        }
                    });

                    return sold !== null ? true : false;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        transactions: { 
            type: GraphQLList(TransactionObject),
            resolve: async (order: Order) => {
                try {
                    const orderTransaction = await dataPool.transaction.findMany({
                        where: {
                            order_id: order.id,
                        },
                        orderBy: { 
                            payment_date: 'desc',
                        },
                    });
                    return orderTransaction;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }   
        },
        days_left: {
            type: GraphQLFloat,
            resolve: (order: Order) => {
                const dateToday = new Date();
                const difference = Math.abs(order.due_date.valueOf() - dateToday.valueOf());
                if (order.due_date.valueOf() > dateToday.valueOf()) {
                    const daysLeft = difference/(1000 * 3600 * 24);
                    return parseFloat(daysLeft.toFixed(2));
                } else {
                    const daysLeft = 0 - (difference/(1000 * 3600 * 24));
                    return parseFloat(daysLeft.toFixed(2));
                }
            }
        },
        order_balance: {
            type: GraphQLFloat,
            resolve: async (order: Order) => {
                try {
                    const paymentHistory = await dataPool.transaction.findMany({
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
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        }

    })
});

export const CustomerObject: GraphQLObjectType = new GraphQLObjectType({
    name: "Customer",
    description: "Company Customers",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        company_name: { type: GraphQLString },
        first_name: { type: GraphQLNonNull(GraphQLString) },
        last_name: { type: GraphQLNonNull(GraphQLString) },
        full_name: { 
            type: GraphQLNonNull(GraphQLString),
            resolve: (customer: Customer) => {
                return customer.first_name + " " + customer.last_name;
            }
        },
        contact_number: { type: GraphQLString },
        email: { type: EmailAddressResolver },
        website: { type: GraphQLString },
        address: { type: GraphQLString },
        city: { type: GraphQLNonNull(GraphQLString) },
        province: { type: GraphQLNonNull(GraphQLString) },
        is_active: { type: GraphQLBoolean },
        total_credits: {
            type: GraphQLInt,
            resolve: async (customer: Customer) => {
                try {
                    const totalOrders = await dataPool.order.aggregate({
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
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        total_bought: { 
            type: GraphQLInt,
            resolve: async (customer: Customer, args) => {
                try {
                    const totalBought = await dataPool.sales.aggregate({
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
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        all_orders: {
            type: GraphQLList(OrderObject),
            args: { 
                date: { type: DateTimeResolver }
            },
            resolve: async (customer: Customer, args) => {
                if (!args.date) {
                    const currYear = new Date().getFullYear();
                    const startDate = new Date(currYear, 0, 1);
                    const endDate = new Date((currYear + 1), 0, 1);

                    try { 
                        const orderList = await dataPool.order.findMany({
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
                                    customer_id: customer.id,
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

export const SalesObject: GraphQLObjectType = new GraphQLObjectType({
    name: "CompanySales",
    description: "All order sold.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        date_paid: { type: GraphQLNonNull(DateTimeResolver) },
        order: {
            type: OrderObject,
            resolve: async (sales: Sales) => {
                try {
                    const salesOrder = await dataPool.order.findUnique({
                        where: {
                            id: sales.id
                        }
                    });
                    return salesOrder;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        }
    })
})

export const TransactionObject: GraphQLObjectType = new GraphQLObjectType({
    name: "Transactions",
    description: "Account Receivables",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        employee: {
            type: EmployeeObject,
            resolve: async (transaction: Transaction) => {
                try {
                    const employee = await dataPool.employee.findUnique({
                        where: {
                            id: transaction.employee_id
                        },
                    });
                    return employee;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        account: {
            type: GraphQLNonNull(AccountObject),
            resolve: async (transaction: Transaction) => {
                try {
                    const account = await dataPool.account.findUnique({
                        where: {
                            id: transaction.account_id
                        }
                    });
                    return account;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        order: {
            type: OrderObject,
            resolve: async (transaction: Transaction) => {
                try {
                    const salesOrder = await dataPool.order.findUnique({
                        where: {
                            id: transaction.order_id
                        }
                    });
                    return salesOrder;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        amount_paid: { type: GraphQLNonNull(GraphQLFloat) },
        payment_date: { type: GraphQLNonNull(DateTimeResolver) }
    })
})