import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLFloat, GraphQLScalarType, Kind } from "graphql";
import { Category, Product, PrismaClient, ProductDetails } from '@prisma/client';
import { DateTimeResolver, JSONObjectResolver } from 'graphql-scalars';

const dataPool = new PrismaClient();    //database pool

interface SuggestedDetails {
    detailType: string;
    attributes: {
        value: number | string | null;
        unit: string | null;
    }[];
};

interface ProductDetailObject {
    type: string | undefined;
    num_value: number | undefined;
    text_value: string | undefined;
    unit: string | null;
}

export const ProductObject: GraphQLObjectType = new GraphQLObjectType({
    name: "Products",
    description: "Company products.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        bar_code: { type: GraphQLString },
        stocks: { type: GraphQLNonNull(GraphQLInt) },
        init_price: { type: GraphQLFloat },
        price: { type: GraphQLNonNull(GraphQLFloat) },
        image_name: { type: GraphQLString },
        is_active: { type: GraphQLBoolean },
        details: { 
            type: GraphQLList(ProductDetailsObject),
            resolve: async (product: Product) => {
                try { 
                    const details = await dataPool.productDetails.findMany({
                        where: { 
                            product_id: product.id
                        }
                    });
                    return details;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        category: {
            type: CategoryObject,
            resolve: async (product: Product) => {
                try {
                    const category = await dataPool.category.findUnique({
                        where: { 
                            id: product.category_id
                        }
                    });
                    return category;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        clearToDelete: {
            type: GraphQLBoolean,
            resolve: async (product: Product) => {
                try {
                    const response = await dataPool.orderWithProduct.findFirst({
                        where: {
                            product_id: product.id
                        }
                    });

                    const response2 = await dataPool.purcahseWithProduct.findFirst({
                        where: {
                            product_id: product.id
                        }
                    })

                    const result = Boolean(response != null || response2 != null);

                    return !result;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        totalSold: {
            type: GraphQLInt,
            resolve: async (product: Product) => {
                const currYear = new Date().getFullYear();
                const startDate = new Date(currYear, 0, 1);
                const endDate = new Date(currYear, 11, 31);

                try {
                    const totalSold = await dataPool.orderWithProduct.aggregate({
                        where: { 
                            AND: { 
                                product_id: product.id,
                                order: { 
                                    AND: { 
                                        order_date: { 
                                            gte: startDate.toISOString(),
                                            lte: endDate.toISOString()
                                        },
                                        is_active: true
                                    }
                                }
                            }
                        },
                        _sum: { 
                            quantity: true
                        }
                    });
                    const result = totalSold._sum.quantity;

                    return result !== null ? result : 0;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        sales_history: { 
            type: GraphQLList(GraphQLInt),
            args: { 
                date: { type: DateTimeResolver },
            },
            resolve: async (product: Product, args) => {
                if (!args.date) {
                    const currYear = new Date().getFullYear();
                    let salesHistory: number[] = [];
                    
                    for (let x = 0; x < 12; x++) {
                        const startDate = new Date(currYear, x, 1);
                        const endDate = new Date(currYear, (x+1), 0);

                        const totalSold = await dataPool.orderWithProduct.aggregate({
                            where: { 
                                AND: { 
                                    product_id: product.id,
                                    order: { 
                                        AND: { 
                                            order_date: { 
                                                gte: startDate.toISOString(),
                                                lte: endDate.toISOString()
                                            },
                                            is_active: true
                                        }
                                    }
                                }
                            },
                            _sum: { 
                                quantity: true
                            }
                        }).catch(err => {
                            throw new Error((err as Error).message);
                        });

                        const result = totalSold._sum.quantity;

                        salesHistory.push(result !== null ? result : 0);
                    }

                    return salesHistory;

                } else {
                    const currYear = new Date(args.date).getFullYear();
                    let salesHistory: number[] = [];
                    
                    for (let x = 0; x < 12; x++) {
                        const startDate = new Date(currYear, x, 1);
                        const endDate = new Date(currYear, (x+1), 0);

                        const totalSold = await dataPool.orderWithProduct.aggregate({
                            where: { 
                                AND: { 
                                    product_id: product.id,
                                    order: { 
                                        AND: { 
                                            order_date: { 
                                                gte: startDate.toISOString(),
                                                lte: endDate.toISOString()
                                            },
                                            is_active: true
                                        }
                                    }
                                }
                            },
                            _sum: { 
                                quantity: true
                            }
                        }).catch(err => {
                            throw new Error((err as Error).message);
                        });

                        const result = totalSold._sum.quantity;

                        salesHistory.push(result !== null ? result : 0);
                    }

                    return salesHistory;
                }
            }
        },
        purchase_history: { 
            type: GraphQLList(GraphQLInt),
            args: { 
                date: { type: DateTimeResolver },
            },
            resolve: async (product: Product, args) => {
                if (!args.date) {
                    const currYear = new Date().getFullYear();
                    let purchaseHistory: number[] = [];
                    
                    for (let x = 0; x < 12; x++) {
                        const startDate = new Date(currYear, x, 1);
                        const endDate = new Date(currYear, (x+1), 0);

                        const totalSold = await dataPool.purcahseWithProduct.aggregate({
                            where: { 
                                AND: { 
                                    product_id: product.id,
                                    purchase: { 
                                        AND: { 
                                            purchase_date: { 
                                                gte: startDate.toISOString(),
                                                lte: endDate.toISOString()
                                            },
                                            is_active: true
                                        }
                                    }
                                }
                            },
                            _sum: { 
                                quantity: true
                            }
                        }).catch(err => {
                            throw new Error((err as Error).message);
                        });

                        const result = totalSold._sum.quantity;

                        purchaseHistory.push(result !== null ? result : 0);
                    }

                    return purchaseHistory;

                } else {
                    const currYear = new Date(args.date).getFullYear();
                    let purchaseHistory: number[] = [];
                    
                    for (let x = 0; x < 12; x++) {
                        const startDate = new Date(currYear, x, 1);
                        const endDate = new Date(currYear, (x+1), 0);

                        const totalSold = await dataPool.purcahseWithProduct.aggregate({
                            where: { 
                                AND: { 
                                    product_id: product.id,
                                    purchase: { 
                                        AND: { 
                                            purchase_date: { 
                                                gte: startDate.toISOString(),
                                                lte: endDate.toISOString()
                                            },
                                            is_active: true
                                        }
                                    }
                                }
                            },
                            _sum: { 
                                quantity: true
                            }
                        }).catch(err => {
                            throw new Error((err as Error).message);
                        });

                        const result = totalSold._sum.quantity;

                        purchaseHistory.push(result !== null ? result : 0);
                    }

                    return purchaseHistory;
                }
            }
        }
    })
});

export const CategoryObject: GraphQLObjectType = new GraphQLObjectType({
    name: "Categories",
    description: "Product Categories",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        products: {
            type: GraphQLList(ProductObject),
            resolve: async (category: Category) => {
                try {
                    const products = await dataPool.product.findMany({
                        where: { 
                            category_id: category.id
                        }
                    });
                    return products;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        suggestedDetails: { 
            type: GraphQLList(JSONObjectResolver),
            resolve: async (category: Category) => {
                try {
                    const productDetails = await dataPool.productDetails.findMany({
                        where: { 
                            product: { 
                                category_id: category.id
                            }
                        }
                    });
                    if (!productDetails || productDetails.length == 0) return null;
                    let suggestions: SuggestedDetails[] = [];

                    productDetails.forEach(detail => {
                        const numDetail = detail.num_value != null ? parseFloat(detail.num_value.toFixed(2)) : null;

                        if (suggestions.length == 0) {
                            const firstAttribute = detail.text_value != null ?
                                [{ value: detail.text_value, unit: null }] : [{ value: numDetail, unit: detail.unit }];

                            suggestions.push({
                                detailType: detail.type,
                                attributes: firstAttribute
                            });
                        }
                        else if (detail.text_value != null) {
                            const currDetail = suggestions.find(element => element.detailType == detail.type);
                            if (!currDetail) {
                                suggestions.push({
                                    detailType: detail.type,
                                    attributes: [{ value: detail.text_value, unit: null }]
                                });
                            } else {
                                if (!currDetail.attributes.find(attr => attr.value == detail.text_value)) {
                                    currDetail.attributes.push({ value: detail.text_value, unit: null });
                                }
                            }
                        }
                        else {
                            const currDetail = suggestions.find(element => element.detailType == detail.type);
                            if (!currDetail) {
                                suggestions.push({
                                    detailType: detail.type,
                                    attributes: [{ value: numDetail, unit: detail.unit }]
                                });
                            } else {
                                if (!currDetail.attributes.find(attr => attr.value == numDetail && attr.unit == detail.unit)) {
                                    currDetail.attributes.push({ value: numDetail, unit: detail.unit });
                                }
                            }
                        }
                    });
                    
                    suggestions.sort(function(a, b){return b.attributes.length - a.attributes.length });
                    const finalSuggestions = suggestions.slice(0, 5);
                    return finalSuggestions;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        }
    })
})


export const ProductDetailsObject: GraphQLObjectType = new GraphQLObjectType({
    name: "ProductDetails",
    description: "Product description and dimensions",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        type: { type: GraphQLNonNull(GraphQLString) },
        unit: { type: GraphQLString },
        num_value: { type: GraphQLFloat },
        text_value: { type: GraphQLString },
        product: {
            type: ProductObject,
            resolve: async (prodDetail: ProductDetails) => {
                try {
                    const product = await dataPool.product.findMany({
                        where: { 
                            id: prodDetail.product_id
                        }
                    });
                    return product;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        }
    })

})
