import { PrismaClient } from '@prisma/client';

const dataPool = new PrismaClient();    //database pool

export interface PurchaseArgs {
    invoice_id: string | null,
    supplier_id: number;
    account_id: number;
    discount: number | null;
    add_charge: number | null;
    payment_type: string;
    is_paid: boolean;
    purchase_date: string;
    due_date: string;
}

export interface ProductArgs {
    id: number;
    quantity: number;
    price: number;
}

interface PurchaseWithProductArgs {
    quantity: number;
    total_price: number;
    product: {
        connect: {
            id: number;
        }
    }
}

interface UpdateProductArgs {
    id: number;
    newStocks: number;
    supplierPrice: number;
}

export class PurchaseOrders {
    purchaseData: PurchaseArgs;
    purchaseProducts: ProductArgs[];

    constructor (purchaseInfo: PurchaseArgs, products: ProductArgs[]) {
        this.purchaseData = purchaseInfo;
        this.purchaseProducts = products;
    }

    async addPurchase() {
        //check input
        if (this.purchaseProducts.length === 0) return { status: false, message: "This order have no product." };

        try {
            let productsInPurchase: PurchaseWithProductArgs[] = [];
            let updateProducts: UpdateProductArgs[] = [];
            let orderAmount: number = 0;
            for (let i = 0; i < this.purchaseProducts.length; i++) {
                const currProduct = this.purchaseProducts[i];

                const productData = await dataPool.product.findUnique({
                    where: {
                        id: currProduct.id
                    },
                    select: {
                        id: true,
                        stocks: true
                    }
                })

                if (!productData) return { status: false, message: `Item ${i+1} does not exist.` };
                const totalPrice = currProduct.price * currProduct.quantity;
                orderAmount += totalPrice;

                productsInPurchase.push({
                    quantity: currProduct.quantity,
                    total_price: totalPrice,
                    product: { 
                        connect: {
                            id: productData.id
                        }
                    }
                });

                updateProducts.push({
                    id: productData.id,
                    newStocks: currProduct.quantity + productData.stocks,
                    supplierPrice: currProduct.price
                })
            }

            const discount = !this.purchaseData.discount ? 0 : this.purchaseData.discount;
            const addCharge = !this.purchaseData.add_charge ? 0 : this.purchaseData.add_charge;
            const finalAmount = (orderAmount + addCharge) - discount;
            const purchaseDate = new Date(this.purchaseData.purchase_date).toISOString();
            const dueDate = new Date(this.purchaseData.due_date).toISOString();

            const newPurchaseOrder = await dataPool.purchase.create({
                data: {
                    supplier_id: this.purchaseData.supplier_id,
                    invoice_id: this.purchaseData.invoice_id,
                    account_id: this.purchaseData.account_id,
                    total_amount: finalAmount,
                    payment_type: this.purchaseData.payment_type,
                    purchase_date: purchaseDate,
                    due_date: dueDate,
                    add_charge: addCharge,
                    discount: discount,
                    purchased: {
                        create: productsInPurchase
                    }
                }
            });

            for (let x=0; x < updateProducts.length; x++) {
                const currProduct = updateProducts[x];
                await dataPool.product.update({
                    where: {
                        id: currProduct.id
                    },
                    data: {
                        init_price: currProduct.supplierPrice
                    }
                })
            }

            return { status: true, data: newPurchaseOrder };

        } catch (err) {
            return { status: false, message: (err as Error).message };
        }
    }

    async updatePurchase(purchaseId: number) {
        //check input
        if (this.purchaseProducts.length === 0) return { status: false, message: "This order have no product." };

        try {
            const currPurchase = await dataPool.purchase.findUnique({
                where: {
                    id: purchaseId
                },
                select: {
                    id: true,
                    delivered: true,
                    is_paid: true
                }
            });

            if (!currPurchase) return { status: false, message: "Order does not exist." };
            if (currPurchase.delivered != null) return { status: false, message: "Order is already delivered." };
            if (currPurchase.is_paid == true) return { status: false, message: "Order is already paid." };

            await dataPool.purcahseWithProduct.deleteMany({
                where: {
                    purchase_id: currPurchase.id
                }
            });

            let productsInPurchase: PurchaseWithProductArgs[] = [];
            let updateProducts: UpdateProductArgs[] = [];
            let orderAmount: number = 0;
            for (let i = 0; i < this.purchaseProducts.length; i++) {
                const currProduct = this.purchaseProducts[i];

                const productData = await dataPool.product.findUnique({
                    where: {
                        id: currProduct.id
                    },
                    select: {
                        id: true,
                        stocks: true
                    }
                })

                if (!productData) return { status: false, message: `Item ${i+1} does not exist.` };
                const totalPrice = currProduct.price * currProduct.quantity;
                orderAmount += totalPrice;

                productsInPurchase.push({
                    quantity: currProduct.quantity,
                    total_price: totalPrice,
                    product: { 
                        connect: {
                            id: productData.id
                        }
                    }
                });

                updateProducts.push({
                    id: productData.id,
                    newStocks: currProduct.quantity + productData.stocks,
                    supplierPrice: currProduct.price
                })
            }

            const discount = !this.purchaseData.discount ? 0 : this.purchaseData.discount;
            const addCharge = !this.purchaseData.add_charge ? 0 : this.purchaseData.add_charge;
            const finalAmount = (orderAmount + addCharge) - discount;
            const purchaseDate = new Date(this.purchaseData.purchase_date).toISOString();
            const dueDate = new Date(this.purchaseData.due_date).toISOString();

            const newPurchaseOrder = await dataPool.purchase.update({
                where: {
                    id: currPurchase.id
                },
                data: {
                    supplier_id: this.purchaseData.supplier_id,
                    account_id: this.purchaseData.account_id,
                    invoice_id: this.purchaseData.invoice_id,
                    total_amount: finalAmount,
                    payment_type: this.purchaseData.payment_type,
                    purchase_date: purchaseDate,
                    due_date: dueDate,
                    add_charge: addCharge,
                    discount: discount,
                    purchased: {
                        create: productsInPurchase
                    }
                }
            });

            for (let x=0; x < updateProducts.length; x++) {
                const currProduct = updateProducts[x];
                await dataPool.product.update({
                    where: {
                        id: currProduct.id
                    },
                    data: {
                        init_price: currProduct.supplierPrice
                    }
                })
            }

            return { status: true, data: newPurchaseOrder };

        } catch (err) {
            return { status: false, message: (err as Error).message };
        }
    }
}


export class PurchaseModify {
    purchaseId: number;

    constructor(purchaseId: number) {
        this.purchaseId = purchaseId;
    }

    async setDelivered() {
        try {
            const currPurchase = await dataPool.purchase.findUnique({
                where: {
                    id: this.purchaseId
                },
                select: {
                    delivered: true,
                    purchased: {
                        select: {
                            quantity: true,
                            product: {
                                select: {
                                    id: true,
                                    stocks: true
                                }
                            }
                        }
                    }
                }
            });

            if (!currPurchase) return { status: false, message: "Order does not exist." }

            const updatedPurchase = await dataPool.purchase.update({
                where: {
                    id: this.purchaseId
                },
                data: {
                    delivered: new Date().toISOString()
                }
            })

            for (let i=0; i < currPurchase.purchased.length; i++) {
                const currProduct = currPurchase.purchased[i];
                await dataPool.product.update({
                    where: {
                        id: currProduct.product.id
                    }, 
                    data: {
                        stocks: currProduct.product.stocks + currProduct.quantity
                    }
                })
            }

            return { status: true, data: updatedPurchase };

        } catch (err) {
            return { status: false, message: (err as Error).message };
        }
    }

    async setInactive() {
        try {
            const currPurchase = await dataPool.purchase.findUnique({
                where: {
                    id: this.purchaseId
                },
                select: {
                    delivered: true,
                    is_paid: true,
                    payables: true
                }
            });

            if (!currPurchase) return { status: false, message: "Purchase does not exist." };
            if (currPurchase.delivered != null) return { status: false, message: "Purchase is already delivered." };
            if (currPurchase.is_paid == true) return { status: false, message: "Purchase is already paid." };
            if (currPurchase.payables.length !== 0) return { status: false, message: "Purchase have payment ongoing already." };

            const updatedPurchase = await dataPool.purchase.update({
                where: {
                    id: this.purchaseId
                },
                data: {
                    is_active: false
                }
            });

            return { status: true, data: updatedPurchase };

        } catch (err) {
            return { status: false, message: (err as Error).message };
        }
    }

    async setActive() {
        try {
            const currPurchase = await dataPool.purchase.findUnique({
                where: {
                    id: this.purchaseId
                },
                select: {
                    id: true,
                }
            });

            if (!currPurchase) return { status: false, message: "Purchase does not exist." };

            const updatedPurchase = await dataPool.purchase.update({
                where: {
                    id: this.purchaseId
                },
                data: {
                    is_active: true
                }
            });

            return { status: true, data: updatedPurchase };

        } catch (err) {
            return { status: false, message: (err as Error).message };
        }
    }

    async deletePurchase() {
        try {
            const currPurchase = await dataPool.purchase.findUnique({
                where: {
                    id: this.purchaseId
                },
                select: {
                    delivered: true,
                    is_active: true,
                    is_paid: true,
                    payables: true
                }
            });

            if (!currPurchase) return { status: false, message: "Purchase does not exist." };
            if (currPurchase.delivered != null) return { status: false, message: "Purchase is already delivered." };
            if (currPurchase.is_paid == true) return { status: false, message: "Purchase is already paid." };
            if (currPurchase.payables.length !== 0) return { status: false, message: "Purchase have payment ongoing already." };
            if (currPurchase.is_active == true) return { status: false, message: "Purchase is active." };

            await dataPool.purcahseWithProduct.deleteMany({
                where: {
                    purchase_id: this.purchaseId
                }
            })

            const deletedPurchase = await dataPool.purchase.delete({
                where: {
                    id: this.purchaseId
                }
            });

            return { status: true, data: deletedPurchase };

        } catch (err) {
            return { status: false, message: (err as Error).message };
        }
    }

    async uploadInvoice(fileName: string) {
        try {
            const uploaded = await dataPool.purchase.update({
                where: { 
                    id: this.purchaseId
                },
                data: {
                    inv_fileName: fileName
                }
            });

            return { status: true, data: uploaded };
        } catch (err) {
            return { status: false, message: (err as Error).message };
        }
    }

    async uploadReceipt(fileName: string) {
        try {
            const uploaded = await dataPool.payables.update({
                where: { 
                    id: this.purchaseId
                },
                data: {
                    receipt_file: fileName
                }
            });

            return { status: true, data: uploaded };
        } catch (err) {
            return { status: false, message: (err as Error).message };
        }
    }
}

export async function addPayment(purchaseId: number, accountId: number, payment: number) {
    try {
        const currPurchase = await dataPool.purchase.findUnique({
            where: {
                id: purchaseId
            },
            select: {
                is_paid: true,
                total_amount: true,
                payables: true
            }
        });

        if (!currPurchase) return { status: false, message: "Order does not exist." };
        if (currPurchase.is_paid == true) return { status: false, message: "Order is already paid." };

        const addedTransaction = await dataPool.payables.create({
            data: {
                purchase_id: purchaseId,
                account_id: accountId,
                amount_paid: payment,
                payment_date: new Date().toISOString()
            }
        });

        let totalPaid: number = 0;
        currPurchase.payables.forEach(paid => {
            totalPaid += parseFloat(paid.amount_paid.toFixed(2));
        });

        const currValue = totalPaid + payment;

        const balance = parseFloat(currPurchase.total_amount.toFixed(2)) - currValue;

        if (balance <= 0) {
            await dataPool.purchase.update({
                where: {
                    id: purchaseId
                },
                data: {
                    is_paid: true
                }
            });
        }

        return { status: true, data: { transaction: addedTransaction, purchase_balance: balance } }; 

    } catch (err) {
        return { status: false, message: (err as Error).message };
    }
}

export async function updatePayment(paymentId: number, payment: number) {
    try {

        const updatedTransaction = await dataPool.payables.update({
            where: {
                id: paymentId
            },
            data: {
                amount_paid: payment
            }
        });

        const currPurchase = await dataPool.purchase.findUnique({
            where: {
                id: updatedTransaction.purchase_id
            },
            select: {
                total_amount: true,
                payables: true
            }
        });

        if (!currPurchase) return { status: false, message: "Order does not exist." };

        let totalPaid: number = 0;
        currPurchase.payables.forEach(paid => {
            totalPaid += parseFloat(paid.amount_paid.toFixed(2));
        });

        const currValue = totalPaid;

        const balance = parseFloat(currPurchase.total_amount.toFixed(2)) - currValue;

        if (balance <= 0) {
            await dataPool.purchase.update({
                where: {
                    id: updatedTransaction.purchase_id
                },
                data: {
                    is_paid: true
                }
            });
        } else {
            await dataPool.purchase.update({
                where: {
                    id: updatedTransaction.purchase_id
                },
                data: {
                    is_paid: false
                }
            });
        }

        return { status: true, data: { transaction: updatedTransaction, purchase_balance: balance } }; 

    } catch (err) {
        return { status: false, message: (err as Error).message };
    }
}