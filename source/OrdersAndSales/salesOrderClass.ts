import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import * as hbs from "handlebars";
import puppeteer from "puppeteer";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebaseStorage from "../firebaseConfig";

const dataPool = new PrismaClient();

export interface OrderProducts {
    id: number,
    quantity: number,
} 

interface PlacedOrders {
    quantity: number,
    total_price: number,
    product: {
        connect: {
            id: number
        }
    }
}

export interface NewOrderInterface {
    employee_id: number;
    account_id: number;
    customer_id: number;
    payment_type: string;
    vat: number | null;
    discount: number | null;
    order_date: Date | null;
    terms: number;
    is_active: boolean | null;
}

export interface UpdateOrderInterface {
    orderId: number;
    payment_type: string | null;
    vat: number | null;
    discount: number | null;
    order_date: Date | null;
    terms: number | null;
}

interface ProductStocks {
    productId: number;
    newStocks: number;
}

export class SalesOrder {
    total_price: number;
    order_products: PlacedOrders[];
    newProductStocks: ProductStocks[];

    constructor() {
        this.total_price = 0;
        this.order_products = [];
        this.newProductStocks = [];
    }


    async addNewOrder(newOrder: NewOrderInterface, orderProducts: OrderProducts[]) {

        if (orderProducts.length === 0) return { status: false, message: "This order have no product." };
        if (!newOrder.account_id) return { status: false, message: "This order have no account id." };
        if (!newOrder.employee_id) return { status: false, message: "This order have no employee id." };
        if (!newOrder.customer_id) return { status: false, message: "This order have no customer id." };

        for (let i = 0; i < orderProducts.length; i++) {
            const currProduct = orderProducts[i];
            if (!currProduct.id || !currProduct.quantity || currProduct.quantity == 0) return { status: false, message: `Item ${i + 1}: Invalid Object.` };
            try {
                const productInfo = await dataPool.product.findUnique({
                    where: {
                        id: currProduct.id
                    },
                    select: {
                        id: true,
                        price: true,
                        stocks: true
                    }
                });
                if (!productInfo) return { status: false, message: `Item ${i + 1}: Product does not exist.` };
                const orderPrice = parseFloat(productInfo.price.toFixed(2)) * currProduct.quantity;
                this.total_price += orderPrice;

                const stocksLeft = productInfo.stocks - currProduct.quantity;
                if (stocksLeft < 0) return { status: false, message: `Item ${i + 1}: Order is more than stocks available.` };

                this.order_products.push({ 
                    quantity: currProduct.quantity,
                    total_price: orderPrice,
                    product: {
                        connect: {
                            id: productInfo.id
                        }
                    }
                });
            
                this.newProductStocks.push({ 
                    productId: productInfo.id,
                    newStocks: stocksLeft
                });
                
            } catch (err) {
                return { status: false, message: `Item ${i + 1}: ${(err as Error).message}.` };
            }

        }

        const orderDate =  newOrder.order_date != null ? new Date(newOrder.order_date) : new Date();
        const paymentTerms = newOrder.terms != null ? newOrder.terms : 0;
        let indexedDate = new Date(orderDate.toISOString());
        indexedDate.setDate(indexedDate.getDate() + paymentTerms);

        const amountDue = newOrder.discount != null ? this.total_price - newOrder.discount : this.total_price;
        try {
            const createdOrder = await dataPool.order.create({
                data: {
                    employee_id: newOrder.employee_id,
                    account_id: newOrder.account_id,
                    customer_id: newOrder.customer_id,
                    payment_type: newOrder.payment_type,
                    vat: newOrder.vat,
                    discount: newOrder.discount,
                    total_price: this.total_price,
                    amount_due: amountDue,
                    order_date: orderDate,
                    due_date: indexedDate,
                    products: {
                        create: this.order_products,
                    },
                },
                include: {
                    products: true
                }
            });

            for (var x=0; x < this.newProductStocks.length; x++) {
                await dataPool.product.update({
                    where: {
                        id: this.newProductStocks[x].productId,
                    },
                    data: {
                        stocks: this.newProductStocks[x].newStocks,
                    },
                });
            }

            
            return { status: true, data: createdOrder };
        } catch (err) {
            return { status: false, message: (err as Error).message };
        }
    }

    async addProductsToOrder(orderId: number, orderProducts: OrderProducts[]) {
        if (orderProducts.length === 0) return { status: false, message: "This order have no product." };
        try {
            const currOrder = await dataPool.order.findUnique({
                where: {
                    id: orderId,
                },
                select: {
                    total_price: true,
                    discount: true
                }
            });
            if (!currOrder) return { status: false, message: "Order does not exist." };

            for (let i = 0; i < orderProducts.length; i++) {
                const currProduct = orderProducts[i];
                if (!currProduct.id || !currProduct.quantity || currProduct.quantity == 0) return { status: false, message: `Item ${i + 1}: Invalid Object.` };
                const productInfo = await dataPool.product.findUnique({
                    where: {
                        id: currProduct.id
                    },
                    select: {
                        id: true,
                        price: true,
                        stocks: true
                    }
                });
                if (!productInfo) return { status: false, message: `Item ${i + 1}: Product does not exist.` };
                const orderPrice = parseFloat(productInfo.price.toFixed(2)) * currProduct.quantity;
                this.total_price += orderPrice;

                const stocksLeft = productInfo.stocks - currProduct.quantity;
                if (stocksLeft < 0) return { status: false, message: `Item ${i + 1}: Order is more than stocks available.` };

                this.order_products.push({ 
                    quantity: currProduct.quantity,
                    total_price: orderPrice,
                    product: {
                        connect: {
                            id: productInfo.id
                        }
                    }
                }); 

                this.newProductStocks.push({ 
                    productId: productInfo.id,
                    newStocks: stocksLeft
                }); 
                
            }

            const newTotalPrice = parseFloat(currOrder.total_price.toFixed(2)) + this.total_price;
            const orderDiscount = currOrder.discount != null ? parseFloat(currOrder.discount?.toFixed(2)) : 0;
            const amountDue = currOrder.discount != null ? newTotalPrice - orderDiscount : newTotalPrice;

            const updateOrder = await dataPool.order.update({
                where: {
                    id: orderId
                },
                data: {
                    total_price: newTotalPrice,
                    amount_due: amountDue,
                    products: {
                        create: this.order_products
                    }
                },
                select: {
                    id: true,
                }
            });

            for (var x=0; x < this.newProductStocks.length; x++) {
                await dataPool.product.update({
                    where: {
                        id: this.newProductStocks[x].productId,
                    },
                    data: {
                        stocks: this.newProductStocks[x].newStocks,
                    },
                });
            }
            
            return { status: true, data: `Added ${orderProducts.length} products to Order ${updateOrder.id}` };
        } catch (err) {
            return { status: false, message: (err as Error).message };
        }
    }


    async updateOrder(orderUpdate: UpdateOrderInterface, orderProducts: OrderProducts[]) {

        if (orderProducts.length === 0) return { status: false, message: "This order have no product." };

        try { 
            const currOrder = await dataPool.order.findUnique({ 
                where: {
                    id: orderUpdate.orderId
                },
                select: {
                    id: true,
                    products: true
                }
            });

            if (!currOrder) return { status: false, message: "Order does not exist." };

            for (let x = 0; x < currOrder.products.length; x++) {
                const currProduct = currOrder.products[x];
                const deletedOrder = await dataPool.orderWithProduct.delete({
                    where: {
                        product_id_order_id: { 
                            product_id: currProduct.product_id,
                            order_id: currProduct.order_id
                        }
                    },
                    select: {
                        product: {
                            select: {
                                stocks: true
                            }
                        }
                    }
                });

                const newStocks = deletedOrder.product.stocks + currProduct.quantity;

                await dataPool.product.update({
                    where: { 
                        id: currProduct.product_id
                    },
                    data: {
                        stocks: newStocks
                    }
                })
            }

        } catch (err) {
            return { status: false, message: (err as Error).message };
        }

        for (let i = 0; i < orderProducts.length; i++) {
            const currProduct = orderProducts[i];
            if (!currProduct.id || !currProduct.quantity || currProduct.quantity == 0) return { status: false, message: `Item ${i + 1}: Invalid Object.` };
            try {
                const productInfo = await dataPool.product.findUnique({
                    where: {
                        id: currProduct.id
                    },
                    select: {
                        id: true,
                        price: true,
                        stocks: true
                    }
                });
                if (!productInfo) return { status: false, message: `Item ${i + 1}: Product does not exist.` };
                const orderPrice = parseFloat(productInfo.price.toFixed(2)) * currProduct.quantity;
                this.total_price += orderPrice;

                const stocksLeft = productInfo.stocks - currProduct.quantity;
                if (stocksLeft < 0) return { status: false, message: `Item ${i + 1}: Order is more than stocks available.` };

                this.order_products.push({ 
                    quantity: currProduct.quantity,
                    total_price: orderPrice,
                    product: {
                        connect: {
                            id: productInfo.id
                        }
                    }
                });
            
                this.newProductStocks.push({ 
                    productId: productInfo.id,
                    newStocks: stocksLeft
                });
                
            } catch (err) {
                return { status: false, message: `Item ${i + 1}: ${(err as Error).message}.` };
            }
        }

        const orderDate =  orderUpdate.order_date != null ? new Date(orderUpdate.order_date) : new Date();
        const paymentTerms = orderUpdate.terms != null ? orderUpdate.terms : 0;
        let indexedDate = new Date(orderDate.toISOString());
        indexedDate.setDate(indexedDate.getDate() + paymentTerms);

        const amountDue = orderUpdate.discount != null ? this.total_price - orderUpdate.discount : this.total_price;
        try {
            const updatedOrder = await dataPool.order.update({
                where: {
                    id: orderUpdate.orderId
                },
                data: {
                    payment_type: orderUpdate.payment_type != null ? orderUpdate.payment_type : undefined,
                    vat: orderUpdate.vat != null ? orderUpdate.vat : undefined,
                    discount: orderUpdate.discount != null ? orderUpdate.discount : undefined,
                    total_price: this.total_price,
                    amount_due: amountDue,
                    order_date: orderDate,
                    due_date: indexedDate,
                    products: {
                        create: this.order_products,
                    },
                },
                include: {
                    products: true
                }
            });

            for (var x=0; x < this.newProductStocks.length; x++) {
                await dataPool.product.update({
                    where: {
                        id: this.newProductStocks[x].productId,
                    },
                    data: {
                        stocks: this.newProductStocks[x].newStocks,
                    },
                });
            }

            
            return { status: true, data: updatedOrder };
        } catch (err) {
            return { status: false, message: (err as Error).message };
        }
        
    }
}

export async function holdOrder(orderId: number) {
    try { 
        const isPaid = await dataPool.order.findUnique({
            where: {
                id: orderId
            },
            select: { 
                id: true,
                transactions: true,
                sold: true,
                delivered: true
            }
        });
        if (!isPaid) return { status: false, message: "Order does not exist." };
        if (isPaid.sold !== null) return { status: false, message: "This order is already paid." };
        if (isPaid.delivered !== null) return { status: false, message: "This order is already delivered." };
        if (isPaid.transactions.length > 0) return { status: false, message: "This order has payment ongoing." };

        const orderHold = await dataPool.order.update({
            where: {
                id: orderId
            },
            data: {
                is_active: false
            },
            select: {
                id: true,
                products: true
            }
        });

        const orderProducts = orderHold.products;

        for (let i = 0; i < orderProducts.length; i++) {
            const currProduct = orderProducts[i];
            
            const productInfo = await dataPool.product.findUnique({
                where: {
                    id: currProduct.product_id
                },
                select: {
                    stocks: true
                }
            });

            const stocksLeft = productInfo != null ? productInfo.stocks + currProduct.quantity : 0;
            
            await dataPool.product.update({
                where: {
                    id: currProduct.product_id
                },
                data: {
                    stocks: stocksLeft,
                }
            });

        }

        return { status: true, data: orderHold };
    } catch (err) {
        return { status: false, message: (err as Error).message };
    }
}

export async function returnOrder(orderId: number, productsInOrder: OrderProducts[]) {
    try { 
        const isPaid = await dataPool.order.findUnique({
            where: {
                id: orderId
            },
            select: { 
                id: true,
                total_price: true,
                amount_due: true,
                sold: true,
                is_active: true,
                products: { 
                    select: {
                        product_id: true
                    }
                }
            }
        });

        if (!isPaid) return { status: false, message: "Order does not exist." };
        if (isPaid.sold != null) return { status: false, message: "This order is already paid." };
        if (isPaid.is_active == false) return { status: false, message: "You cannot modify a canceled order." };

        const currTotalPrice = parseFloat(isPaid.total_price.toFixed(2));
        const currAmountDue = parseFloat(isPaid.amount_due.toFixed(2));
        let totalReturnedPrice = 0;
    
        for (var x=0; x < productsInOrder.length; x++) {
            if (isPaid.products.filter(product => product.product_id === productsInOrder[x].id).length == 0) return { status: false, message: `This product is not in Order ${orderId}.` };
        }

        for (var x=0; x < productsInOrder.length; x++) {
            try { 
                
                const deletedProduct = await dataPool.orderWithProduct.delete({
                    where: {
                        product_id_order_id: {
                            order_id: orderId,
                            product_id: productsInOrder[x].id
                        },
                    },
                    include: { 
                        product: true
                    }
                });
                if (!deletedProduct) return { status: false, message: "Product does not exist"};

                const stocksLeft = deletedProduct.product.stocks + deletedProduct.quantity;
                totalReturnedPrice += parseFloat(deletedProduct.total_price.toFixed(2)); 
        
                await dataPool.product.update({
                    where: {
                        id: deletedProduct.product_id
                    },
                    data: {
                        stocks: stocksLeft,
                    }
                });

            } catch (err) {
                return { status: false, message: (err as Error).message + `on Item ${x+1}.` };
            }
        }

        const newTotalPrice = currTotalPrice - totalReturnedPrice;
        const newAmountDue = currAmountDue - totalReturnedPrice;

        const orderReturned = await dataPool.order.update({
            where: {
                id: orderId
            },
            data: { 
                total_price: newTotalPrice,
                amount_due: newAmountDue
            },
            select: {
                id: true,
                products: true
            }
        });

        return { status: true, data: orderReturned };

    } catch (err) {
        return { status: false, message: (err as Error).message };
    }
}

export async function restoreOrder(orderId: number) {
    try { 

        const orderRestored = await dataPool.order.update({
            where: {
                id: orderId
            },
            data: {
                is_active: true,
            },
            select: {
                id: true,
                products: true
            }
        });

        const orderProducts = orderRestored.products;
        let newProductStocks: ProductStocks[] = [];

        for (let i = 0; i < orderProducts.length; i++) {
            const currProduct = orderProducts[i];
            
            const productInfo = await dataPool.product.findUnique({
                where: {
                    id: currProduct.product_id
                },
                select: {
                    stocks: true
                }
            });

            const stocksLeft = productInfo != null ? productInfo.stocks - currProduct.quantity : 0;
            if (stocksLeft < 0) return { status: false, message: `Item ${i + 1}: Order is more than stocks available.` };
            
            newProductStocks.push({
                productId: currProduct.product_id,
                newStocks: stocksLeft
            });

        }

        for (var x = 0; x < newProductStocks.length; x++) {
            await dataPool.product.update({
                where: {
                    id: newProductStocks[x].productId
                },
                data: {
                    stocks: newProductStocks[x].newStocks,
                }
            });
        }

        return { status: true, data: orderRestored };
    } catch (err) {
        return { status: false, message: (err as Error).message };
    }
}

export async function deleteOrder(orderId: number) {
    try { 

        const orderInfo = await dataPool.order.findUnique({
            where: {
                id: orderId
            },
            select: {
                id: true, 
                delivered: true,
                products: true,
                is_active: true,
                transactions: {
                    select: {
                        id: true
                    },
                },
            },
        });

        if (!orderInfo) return { status: false, message: "Order does not exist." };
        if (orderInfo.delivered != null) return { status: true, data: "Order is already delivered." };
        if (orderInfo.transactions.length != 0) return { status: true, data: "Order has payment ongoing." };
        if (orderInfo.is_active == true) return { status: true, data: "Order is active." };

        try {
            await dataPool.orderWithProduct.deleteMany({
                where: {
                    order_id: orderInfo.id
                }
            })

            const deletedOrder = await dataPool.order.delete({
                where: { 
                    id: orderId
                },
            });

            return { status: true, data: deletedOrder };
            
        } catch (err) {
            return { status: false, message: (err as Error).message };
        }

       
    } catch (err) {
        return { status: false, message: (err as Error).message };
    }
}

interface Transaction {
    employee_id: number;
    account_id: number;
    order_id: number;
    amount_paid: number;
    payment_date: Date | null;
}


interface UpdateTransaction {
    payment_id: number;
    amount_paid: number;
}

export async function addTransaction(paymentDetails: Transaction) {
    try {
        const orderInfo = await dataPool.order.findUnique({
            where: {
                id: paymentDetails.order_id
            },
            select: {
                id: true, 
                sold: {
                    select: {
                        date_paid: true
                    }
                },
                amount_due: true, 
                is_active: true,
                transactions: {
                    select: {
                        id: true,
                        amount_paid: true
                    }
                }
            }
        });

        if (!orderInfo) return { status: false, message: "Order does not exist" };
        if (orderInfo.is_active == false) return { status: false, message: "This is a canceled order" };
        if (orderInfo.sold != null) return { status: false, message: "This order is already paid on" + orderInfo.sold.date_paid.toUTCString() };
        
        const newTransaction = await dataPool.transaction.create({
            data: {
                order_id: paymentDetails.order_id,
                account_id: paymentDetails.account_id,
                employee_id: paymentDetails.employee_id,
                amount_paid: paymentDetails.amount_paid,
                payment_date: paymentDetails.payment_date != null ? paymentDetails.payment_date : new Date(),
            },
            select: {
                order_id: true,
                amount_paid: true
            }
        });

        const paymentHistory = orderInfo.transactions;
        let totalPaid = 0;

        paymentHistory.forEach(payment => totalPaid += parseFloat((payment.amount_paid).toFixed(2)));
        const currBalance = parseFloat((orderInfo.amount_due).toFixed(2)) - totalPaid;
        const remainBalance = currBalance - paymentDetails.amount_paid;

        if (remainBalance <= 0) {
            await dataPool.sales.create({
                data: {
                    order_id: paymentDetails.order_id,
                    date_paid: paymentDetails.payment_date != null ? paymentDetails.payment_date : new Date(),                          
                }
            });
        }

        return { status: true, data: { details: newTransaction, order_balance: remainBalance } }
              
       
    } catch (err) {
        return { status: false, message: (err as Error).message };
    }
}

export async function updateTransaction(paymentDetails: UpdateTransaction) {
    try {
        
        const updatedTransaction = await dataPool.transaction.update({
            where: {
                id: paymentDetails.payment_id
            },
            data: {
                amount_paid: paymentDetails.amount_paid,
            },
            select: {
                order_id: true,
                amount_paid: true
            }
        });

        const orderInfo = await dataPool.order.findUnique({
            where: {
                id: updatedTransaction.order_id
            },
            select: {
                id: true, 
                sold: { 
                  select: {
                      id: true
                  }  
                },
                amount_due: true, 
                transactions: {
                    select: {
                        id: true,
                        amount_paid: true
                    }
                }
            }
        });

        if (!orderInfo) return { status: false, message: "Order does not exist" };

        const paymentHistory = orderInfo.transactions;
        let totalPaid = 0;

        paymentHistory.forEach(payment => totalPaid += parseFloat((payment.amount_paid).toFixed(2)));
        const currBalance = parseFloat((orderInfo.amount_due).toFixed(2)) - totalPaid;

        if (currBalance <= 0 && orderInfo.sold == null) {
            await dataPool.sales.create({
                data: {
                    order_id: updatedTransaction.order_id,
                    date_paid: new Date(),                          
                }
            });
        } else if (currBalance > 0 && orderInfo.sold != null) {
            await dataPool.sales.delete({
                where: { 
                    id: orderInfo.sold.id
                }
            });
        }

        return { status: true, data: { details: updatedTransaction, order_balance: currBalance } }
              
       
    } catch (err) {
        return { status: false, message: (err as Error).message };
    }
}


const compile = async (templateName: string, orderId: number) => {
    const filePath = path.join(__dirname, "..", "pdfTemplates", `${templateName}.hbs`);
    try {
        const currOrder = await dataPool.order.findUnique({ 
            where: {
                id: orderId,
            },
            include: {
                customer: true,
                products: { 
                    select: {
                        quantity: true,
                        total_price: true,
                        product: {
                            select: { 
                                name: true,
                                price: true
                            }
                        }
                    }
                }
            }
        });
        if (!currOrder) return null;
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } as const;

        let orderProducts: { name: string, price: string, quantity: number, total_price: string }[] = [];

        currOrder.products.forEach(prod => {
            orderProducts.push({ 
                name: prod.product.name,
                price: prod.product.price.toFixed(2),
                quantity: prod.quantity,
                total_price: prod.total_price.toFixed(2)
            });
        });

        const pdfData = {
            order: {
                id: currOrder.id,
                order_date: currOrder.order_date.toLocaleDateString("en-US", options),
                due_date: currOrder.due_date.toLocaleDateString("en-US", options),
                total_price: currOrder.total_price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                vat: currOrder.vat !== null ? currOrder.vat.toFixed(2) : "0.00",
                discount: currOrder.discount != null ? currOrder.discount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0.00",
                amount_due: currOrder.amount_due.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            },
            products: orderProducts,
            customer: {
                name: currOrder.customer.first_name + " " + currOrder.customer.last_name,
                company: currOrder.customer.company_name != null ? currOrder.customer.company_name : "Unspecified",
                city: currOrder.customer.city,
                province: currOrder.customer.province,
                email: currOrder.customer.email
            }
        };

        const html = await fs.readFileSync(filePath, 'utf-8');
        return hbs.compile(html)(pdfData);
    } catch (err) {
        return null;
    }  
}

const compileReceipt = async (templateName: string, orderId: number) => {
    const filePath = path.join(__dirname, "..", "pdfTemplates", `${templateName}.hbs`);
    try {
        const currOrder = await dataPool.order.findUnique({ 
            where: {
                id: orderId,
            },
            include: {
                customer: true,
                transactions: true
            }
        });
        if (!currOrder) return null;
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } as const;

        let paymentHistory: { id: number, payment_date: string, amount_paid: string }[] = [];

        if (currOrder.transactions.length == 0) return null;

        let paymentTotal: number = 0;
        currOrder.transactions.forEach(trans => {
            paymentHistory.push({
                id: trans.id,
                payment_date: trans.payment_date.toLocaleDateString("en-US", options),
                amount_paid: trans.amount_paid.toFixed(2)
            });

            paymentTotal += parseFloat(trans.amount_paid.toFixed(2));
        });
        const orderBalance = parseFloat(currOrder.amount_due.toFixed(2)) - paymentTotal;

        const pdfData = {
            order: {
                id: currOrder.id,
                order_date: currOrder.order_date.toLocaleDateString("en-US", options),
                due_date: currOrder.due_date.toLocaleDateString("en-US", options),
                amount_due: currOrder.amount_due.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            },
            payments: paymentHistory,
            payment_total: paymentTotal.toFixed(2),
            order_balance: orderBalance > 0 ? orderBalance.toFixed(2) : "0.00",
            order_change: orderBalance < 0 ? Math.abs(orderBalance).toFixed(2) : "0.00", 
            customer: {
                name: currOrder.customer.first_name + " " + currOrder.customer.last_name,
                company: currOrder.customer.company_name != null ? currOrder.customer.company_name : "Unspecified",
                city: currOrder.customer.city,
                province: currOrder.customer.province,
                email: currOrder.customer.email
            }
        };

        const html = await fs.readFileSync(filePath, 'utf-8');
        return hbs.compile(html)(pdfData);
    } catch (err) {
        return null;
    }  
}

export async function generateInvoicePDF(orderId: number) {
    
    try {
        const orderInvoice = await dataPool.order.findUnique({
            where: {
                id: orderId
            },
            select: {
                sold: true,
                inv_fileName: true
            }
        });

        if (!orderInvoice) return { status: false, message: "Order does not exist." };
        if (orderInvoice.sold != null) return { status: false, message: "Order is already paid." };

        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        const page = await browser.newPage();
        const content = await compile('Invoice', orderId);
        const fileName = orderId + "_" + new Date().toISOString().split('.')[0];
        
        if (!content) return { status: false, message: "Failed to generate invoice." };
        await page.setContent(content);
        await page.emulateMediaType('screen');
        const invoicePDF = await page.pdf({
            format: 'a4',
            printBackground: true,
            margin: { top: "1cm", bottom: "1cm", left: "1cm", right: "1cm" }
        });
       
        await browser.close();

        const invoiceRef = ref(firebaseStorage, `invoices/${fileName}.pdf`);
        const uploadRef = await uploadBytes(invoiceRef, invoicePDF);
        const url = await getDownloadURL(uploadRef.ref);


        await dataPool.order.update({
            where: { 
                id: orderId,
            },
            data: {
                inv_fileName: url,
            }
        })

        return { status: true, message: fileName };
    } catch (err) {
        return { status: false, message: (err as Error).message };
    }
}

export async function generateReceiptPDF(orderId: number) {
    
    try {
        const orderReceipt = await dataPool.order.findUnique({
            where: {
                id: orderId
            },
            select: {
                receipt_file: true,
                transactions: true
            }
        });

        if (!orderReceipt) return { status: false, message: "Order does not exist." };
        if (orderReceipt.transactions.length == 0) return { status: false, message: "This order has no payments yet." };

        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        const page = await browser.newPage();
        const content = await compileReceipt('receipt', orderId);
        const fileName = orderId + "_" + new Date().toISOString().split('.')[0];
        
        if (!content) return { status: false, message: "Failed to generate invoice." };
        await page.setContent(content);
        await page.emulateMediaType('screen');
        const receiptPDF = await page.pdf({
            format: 'a4',
            printBackground: true,
            margin: { top: "1cm", bottom: "1cm", left: "1cm", right: "1cm" }
        });
       
        await browser.close();

        const receiptRef = ref(firebaseStorage, `receipts/${fileName}.pdf`);
        const uploadRef = await uploadBytes(receiptRef, receiptPDF);
        const url = await getDownloadURL(uploadRef.ref);

        await dataPool.order.update({
            where: { 
                id: orderId,
            },
            data: {
                receipt_file: url,
            }
        })

        return { status: true, message: fileName };
    } catch (err) {
        return { status: false, message: (err as Error).message };
    }
}

export async function getInvoicePDF (orderId: number) {
    try {
        const orderInvoice = await dataPool.order.findUnique({
            where: {
                id: orderId
            },
            select: {
                inv_fileName: true
            }
        });

        if (!orderInvoice) return { status: false, message: "Order does not exist." };
        if (!orderInvoice.inv_fileName) return { status: false, message: "No PDF Invoice generated yet." };

        return { status: true, message: orderInvoice.inv_fileName };
    } catch (err) {
        return { status: false, message: (err as Error).message };
    }
}

export async function getReceiptPDF (orderId: number) {
    try {
        const orderInvoice = await dataPool.order.findUnique({
            where: {
                id: orderId
            },
            select: {
                receipt_file: true
            }
        });

        if (!orderInvoice) return { status: false, message: "Order does not exist." };
        if (!orderInvoice.receipt_file) return { status: false, message: "No PDF Receipt generated yet." };

        return { status: true, message: orderInvoice.receipt_file };
    } catch (err) {
        return { status: false, message: (err as Error).message };
    }
}

export async function setDelivered (orderId: number) {
    try { 
        const currOrder = await dataPool.order.findUnique({
            where: { 
                id: orderId
            },
            select: {
                delivered: true
            }
        });

        if (!currOrder) return { status: false, message: "Order does not exist." };
        if (currOrder.delivered != null) return { status: false, message: "Order is already delivered." };

        const deliveredOrder = await dataPool.order.update({
            where: { 
                id: orderId
            }, 
            data: {
                delivered: new Date().toISOString()
            },
            select: {
                id: true
            }
        });
        return { status: true, message: `Order ${deliveredOrder.id} was successfully delivered` };
    } catch (err) {
        return { status: false, message: (err as Error).message };
    }
}

