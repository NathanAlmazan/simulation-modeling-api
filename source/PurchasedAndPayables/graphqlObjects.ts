import { Purchase, Supplier, PrismaClient, PurcahseWithProduct, Payables } from "@prisma/client";
import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { DateTimeResolver, EmailAddressResolver } from "graphql-scalars";
import { AccountObject } from "../EmployeeAndAccounts/graphqlObjects";
import { ProductObject } from "../Products/graphqlObjects";

const dataPool = new PrismaClient();

export const SupplierObject: GraphQLObjectType = new GraphQLObjectType({
    name: 'Supplieers',
    description: 'Suppliers that supply products',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        first_name: { type: GraphQLNonNull(GraphQLString) },
        last_name: { type: GraphQLNonNull(GraphQLString) },
        full_name: { 
            type: GraphQLNonNull(GraphQLString),
            resolve: (supplier: Supplier) => {
                return supplier.first_name + " " + supplier.last_name;
            }
        },
        company_name: { type: GraphQLString },
        contact_number: { type: GraphQLString },
        email: { type: EmailAddressResolver },
        website: { type: GraphQLString },
        address: { type: GraphQLString },
        city: { type: GraphQLNonNull(GraphQLString) },
        province: { type: GraphQLNonNull(GraphQLString) },
        is_active: { type: GraphQLNonNull(GraphQLBoolean) },
        supplied_orders: {
            type: GraphQLList(PurchaseObject),
            args: {
                date: { type: DateTimeResolver }
            },
            resolve: async (supplier: Supplier, args) => {
                if (!args.date) {
                    try {
                        const currYear = new Date().getFullYear();
                        const startDate = new Date(currYear, 0, 1);
                        const endDate = new Date((currYear + 1), 0, 1);

                        const suppOrders = await dataPool.purchase.findMany({
                            where: {
                                supplier_id: supplier.id,
                                purchase_date: {
                                    gte: startDate,
                                    lt: endDate 
                                }
                            }
                        });
    
                        return suppOrders;
                    } catch (err) {
                        throw new Error((err as Error).message);
                    }
                } else {
                    try {
                        const currYear = new Date(args.date).getFullYear();
                        const startDate = new Date(currYear, 0, 1);
                        const endDate = new Date((currYear + 1), 0, 1);

                        const suppOrders = await dataPool.purchase.findMany({
                            where: {
                                supplier_id: supplier.id,
                                purchase_date: {
                                    gte: startDate,
                                    lt: endDate 
                                }
                            }
                        });
    
                        return suppOrders;
                    } catch (err) {
                        throw new Error((err as Error).message);
                    }
                }
            }
        },
        total_collecting: {
            type: GraphQLInt,
            resolve: async (supplier: Supplier) => {
                try {
                    const totalCollect = await dataPool.purchase.aggregate({
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
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        total_supplied: { 
            type: GraphQLInt,
            resolve: async (supplier: Supplier) => {
                try {
                    const totalSupplied = await dataPool.purchase.aggregate({
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
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        }
    })
})

export const PurchaseObject: GraphQLObjectType = new GraphQLObjectType({
    name: "PurchasedOrders",
    description: "Orders purchased by the company",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        supplier: { 
            type: SupplierObject,
            resolve: async (purchase: Purchase) => {
                try {
                    const purchSupplier = await dataPool.supplier.findUnique({
                        where: { 
                            id: purchase.supplier_id
                        }
                    });

                    return purchSupplier;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        account: {
            type: AccountObject, 
            resolve: async (purchase: Purchase) => {
                try {
                    const account = await dataPool.account.findUnique({
                        where: { 
                            id: purchase.account_id
                        }
                    });

                    return account;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            } 
        },
        total_amount: { type: GraphQLNonNull(GraphQLFloat) },
        payment_type: { type: GraphQLNonNull(GraphQLString) },
        invoice_id: { type: GraphQLString },
        discount: { type: GraphQLFloat },
        add_charge: { type: GraphQLFloat },
        is_paid: { type: GraphQLBoolean },
        delivered: { type: DateTimeResolver },
        purchase_date: { type: DateTimeResolver },
        due_date: { type: DateTimeResolver },
        inv_fileName: { type: GraphQLString },
        is_active: { type: GraphQLBoolean },
        purchased_products: {
            type: GraphQLList(PurcahseWithProductObject),
            resolve: async (purchase: Purchase) => {
                try {
                    const purchased = await dataPool.purcahseWithProduct.findMany({
                        where: {
                            purchase_id: purchase.id
                        }
                    });

                    return purchased;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        payment_history: {
            type: GraphQLList(PayablesObject),
            resolve: async (purchase: Purchase) => {
                try {
                    const payments = await dataPool.payables.findMany({
                        where: {
                            purchase_id: purchase.id
                        }
                    });

                    return payments;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        total_paid: {
            type: GraphQLFloat,
            resolve: async (purchase: Purchase) => {
                try {
                    const totalPaid = await dataPool.payables.aggregate({
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
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        days_left: {
            type: GraphQLFloat,
            resolve: (purchase: Purchase) => {
                const dateToday = new Date();
                const difference = Math.abs(purchase.due_date.valueOf() - dateToday.valueOf());
                if (purchase.due_date.valueOf() > dateToday.valueOf()) {
                    const daysLeft = difference/(1000 * 3600 * 24);
                    return parseFloat(daysLeft.toFixed(2));
                } else {
                    const daysLeft = 0 - (difference/(1000 * 3600 * 24));
                    return parseFloat(daysLeft.toFixed(2));
                }
            }
        },
        terms: { 
            type: GraphQLFloat,
            resolve: (purchase: Purchase) => {
                const difference = Math.abs(purchase.due_date.valueOf() - purchase.purchase_date.valueOf());
                if (purchase.due_date.valueOf() > purchase.purchase_date.valueOf()) {
                    const daysLeft = difference/(1000 * 3600 * 24);
                    return parseFloat(daysLeft.toFixed(2));
                } else {
                    const daysLeft = 0 - (difference/(1000 * 3600 * 24));
                    return parseFloat(daysLeft.toFixed(2));
                }
            }
        },
        purchase_balance: {
            type: GraphQLFloat,
            resolve: async (purchase: Purchase) => {
                try {
                    const totalPaid = await dataPool.payables.aggregate({
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
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        }
    })
})

export const PurcahseWithProductObject: GraphQLObjectType = new GraphQLObjectType({
    name: 'PurcahseWithProduct',
    description: 'Purchased Products',
    fields: () => ({
        product: {
            type: GraphQLNonNull(ProductObject),
            resolve: async (productPurchased: PurcahseWithProduct) => {
                try {
                    const product = await dataPool.product.findUnique({
                        where: {
                            id: productPurchased.product_id
                        }
                    });

                    return product;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        purchase_order: {
            type: GraphQLNonNull(PurchaseObject),
            resolve: async (productPurchased: PurcahseWithProduct) => {
                try {
                    const purchase = await dataPool.purchase.findUnique({
                        where: {
                            id: productPurchased.purchase_id
                        }
                    });

                    return purchase;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        quantity: { type: GraphQLNonNull(GraphQLInt) },
        total_price: { type: GraphQLNonNull(GraphQLFloat) }
    })
});

export const PayablesObject: GraphQLObjectType = new GraphQLObjectType({
    name: "Payables",
    description: "Purchase Orders payment",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        purchase_order: { 
            type: GraphQLNonNull(PurchaseObject),
            resolve: async (payables: Payables) => {
                try {
                    const purchase = await dataPool.purchase.findUnique({
                        where: { 
                            id: payables.purchase_id
                        }
                    });

                    return purchase;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        account: {
            type: AccountObject, 
            resolve: async (payables: Payables) => {
                try {
                    const account = await dataPool.account.findUnique({
                        where: { 
                            id: payables.account_id
                        }
                    });

                    return account;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            } 
        },
        receipt_file: { type: GraphQLString },
        amount_paid: { type: GraphQLNonNull(GraphQLFloat) },
        payment_date: { type: DateTimeResolver }
    })
})