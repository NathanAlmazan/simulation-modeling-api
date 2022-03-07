import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { CategoryObject, ProductDetailsObject, ProductObject } from "./graphqlObjects";
import { JSONObjectResolver } from 'graphql-scalars';
import { Category, PrismaClient, Product, ProductDetails } from '@prisma/client';
import { Decimal } from "@prisma/client/runtime";

const dataPool = new PrismaClient(); 
const UnAuthorized = ["Warehouse Staff", "Delivery Personnel", "Sales Agent"];
const ExecutivePosition = ["President", "Vice President", "Manager"];

interface TokenInterface {
    userId: number;
    username: string;
    position: string;
    iat: number;
    exp: number;
};

interface ProductDescriptions {
    type: string;
    unit: string | null;
    num_value: Decimal | null;
    text_value: string | null;
}


export const RootMutation = new GraphQLObjectType({
    name: "RootMutation",
    description: "Root Mutation for Product Information",
    fields: () => ({
        addProduct: {
            type: ProductObject,
            description: "Add a product to the database",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                bar_code: { type: GraphQLString },
                stocks: { type: GraphQLNonNull(GraphQLInt) },
                category_id: { type: GraphQLNonNull(GraphQLInt) },
                price: { type: GraphQLNonNull(GraphQLFloat) }
            },
            resolve: async (parent, args, context: TokenInterface) => {
                if (UnAuthorized.includes(context.position)) throw new Error("Unauthorized");
                try { 
                    const newProduct = await dataPool.product.create({
                        data: { 
                            name: (args as Product).name,
                            bar_code: (args as Product).bar_code,
                            stocks: (args as Product).stocks,
                            price: (args as Product).price,
                            category_id: (args as Product).category_id
                        },
                    });
                    return newProduct;
                } catch (err) {
                    throw new Error((err as Error).message);
                }

            }
        },

        updateProduct: {
            type: ProductObject,
            description: "Update a product in the database",
            args: { 
                id: { type: GraphQLNonNull(GraphQLInt) },
                name: { type: GraphQLString },
                stocks: { type: GraphQLInt },
                bar_code: { type: GraphQLString },
                category_id: { type: GraphQLInt },
                price: { type: GraphQLFloat },
                is_active: { type: GraphQLBoolean },
            },
            resolve: async (parent, args, context: TokenInterface) => {
                if (UnAuthorized.includes(context.position)) throw new Error("Unauthorized");
                try {
                    const updatedProduct = await dataPool.product.update({
                        where: {
                            id: (args as Product).id
                        },
                        data: {
                            name: (args as Product).name != null ? (args as Product).name : undefined,
                            stocks: (args as Product).stocks != null ? (args as Product).stocks : undefined,
                            bar_code: (args as Product).bar_code != null ? (args as Product).bar_code : undefined,
                            price: (args as Product).price != null ? (args as Product).price : undefined,
                            category_id: (args as Product).category_id != null ? (args as Product).category_id : undefined,
                            is_active: (args as Product).is_active != null ? (args as Product).is_active : undefined,
                        }
                    });

                    if ((args as Product).is_active == null) {
                        await dataPool.productDetails.deleteMany({
                            where: { 
                                product_id: updatedProduct.id
                            }
                        });
                    }

                    return updatedProduct;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        removeProduct: {
            type: ProductObject,
            description: "Set a product to archived",
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: async (parent, args, context: TokenInterface) => {
                if (UnAuthorized.includes(context.position)) throw new Error("Unauthorized");
                try {
                    const removedProduct = await dataPool.product.update({
                        where: {
                            id: args.id
                        },
                        data: {
                            is_active: false
                        }
                    });
                    return removedProduct;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        permaDeleteProduct: {
            type: ProductObject,
            description: "Delete a product in the database",
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: async (parent, args, context: TokenInterface) => {
                if (!ExecutivePosition.includes(context.position)) throw new Error("Unauthorized");
                try {
                    await dataPool.productDetails.deleteMany({
                        where: {
                            product_id: args.id
                        }
                    });

                    const deletedProduct = await dataPool.product.delete({
                        where: {
                            id: args.id
                        }
                    });
                    return deletedProduct;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        addCategory: {
            type: CategoryObject,
            description: "Add a product category",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parent, args, context: TokenInterface) => {
                if (UnAuthorized.includes(context.position)) throw new Error("Unauthorized");
                try {
                    const newCategory = await dataPool.category.create({
                        data: {
                            name: (args as Category).name,
                            description: (args as Category).description
                        }
                    });
                    return newCategory;
                   
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        updateCategory: {
            type: CategoryObject,
            description: "Update Product Category",
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
                name: { type: GraphQLString },
                description: { type: GraphQLString }
            },
            resolve: async (parent, args, context: TokenInterface) => {
                if (UnAuthorized.includes(context.position)) throw new Error("Unauthorized");
                try {
                    const updatedCategory = await dataPool.category.update({
                        where: {
                            id: (args as Category).id
                        }, 
                        data: {
                            name: (args as Category).name != null ? (args as Category).name : undefined,
                            description: (args as Category).description != null ? (args as Category).description : undefined
                        }
                    });
                    return updatedCategory;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        deleteCategory: {
            type: CategoryObject,
            description: "Remove a Category only when no product is connected",
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: async (parent, args, context: TokenInterface) => {
                if (UnAuthorized.includes(context.position)) throw new Error("Unauthorized");
                try {
                    const countCategoryProd = await dataPool.product.count({
                        where: {
                            category_id: (args as Category).id
                        }
                    });
                    if (countCategoryProd === 0 || !countCategoryProd) {
                        const deleteCategory = await dataPool.category.delete({
                            where: {
                                id: (args as Category).id
                            }
                        });
                        return deleteCategory;
                    } else throw new Error("Cannot delete category with products.");
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        addDetails: {
            type: ProductDetailsObject,
            description: "Add a detail to the product",
            args: {
                product_id: { type: GraphQLNonNull(GraphQLInt) },
                type: { type: GraphQLNonNull(GraphQLString) },
                unit: { type: GraphQLString },
                num_value: { type: GraphQLFloat },
                text_value: { type: GraphQLString },
            },
            resolve: async (parent, args, context: TokenInterface) => {
                if (UnAuthorized.includes(context.position)) throw new Error("Unauthorized");
                if (args.num_value && args.unit) {
                    try {
                        const newProductDetail = await dataPool.productDetails.create({
                            data: { 
                                product_id: (args as ProductDetails).product_id,
                                type: (args as ProductDetails).type,
                                num_value: (args as ProductDetails).num_value,
                                unit: (args as ProductDetails).unit
                            }
                        });
                        return newProductDetail;
                    } catch (err) {
                        throw new Error((err as Error).message);
                    }
                }
                else if (args.text_value && !args.num_value) {
                    try {
                        const newProductDetail = await dataPool.productDetails.create({
                            data: { 
                                product_id: (args as ProductDetails).product_id,
                                type: (args as ProductDetails).type,
                                text_value: (args as ProductDetails).text_value
                            }
                        });
                        return newProductDetail;
                    } catch (err) {
                        throw new Error((err as Error).message);
                    }
                } else {
                    throw new Error("Invalid arguments.");
                }
            }
        },

        updateDetails: {
            type: ProductDetailsObject,
            description: "Update Product details descriptions",
            args: { 
                id: { type: GraphQLNonNull(GraphQLInt) },
                type: { type:GraphQLString },
                unit: { type: GraphQLString },
                num_value: { type: GraphQLFloat },
                text_value: { type: GraphQLString },
            },
            resolve: async (parent, args, context: TokenInterface) => {
                if (UnAuthorized.includes(context.position)) throw new Error("Unauthorized");
                try {
                    const updatedDetail = await dataPool.productDetails.update({
                        where: { 
                            id: (args as ProductDetails).id
                        }, 
                        data: {
                            type: (args as ProductDetails).type != null ? (args as ProductDetails).type : undefined,
                            unit: (args as ProductDetails).unit != null ? (args as ProductDetails).unit : undefined,
                            num_value: (args as ProductDetails).num_value != null ? (args as ProductDetails).num_value : undefined,
                            text_value: (args as ProductDetails).text_value != null ? (args as ProductDetails).text_value : undefined
                        }
                    });
                    return updatedDetail;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        deleteDetails: {
            type: ProductDetailsObject,
            description: "Remove a product detail",
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: async (parent, args, context: TokenInterface) => {
                if (UnAuthorized.includes(context.position)) throw new Error("Unauthorized");
                try {   
                    const deletedProdDetail = await dataPool.productDetails.delete({
                        where: { id: (args as ProductDetails).id }
                    });
                    return deletedProdDetail;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        }
    })
});

export const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    description: "Root query of all products",
    fields: () => ({
        showAllProducts: {
            type: GraphQLList(ProductObject),
            description: "Show all products without filter",
            resolve: async () => {
                try {
                    const showAllProducts = await dataPool.product.findMany({
                        where: {
                            is_active: true,
                        },
                        orderBy: {
                            stocks: 'desc'
                        }
                    });
                    return showAllProducts;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        showArchivedProducts: {
            type: GraphQLList(ProductObject),
            description: "Show all products without filter",
            resolve: async () => {
                try {
                    const showAllProducts = await dataPool.product.findMany({
                        where: {
                            is_active: false,
                        },
                        orderBy: {
                            stocks: 'desc'
                        }
                    });
                    return showAllProducts;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        searchProduct: {
            type: GraphQLList(ProductObject),
            description: "Search a product base on id or name",
            args: {
                id: { type: GraphQLInt },
                name: { type: GraphQLString },
                bar_code: { type: GraphQLString },
            },
            resolve: async (parent, args) => {
                if (!args.id && !args.name && !args.bar_code) throw new Error("Invalid arguments.")
                try {
                    const resultProduct = await dataPool.product.findMany({
                        where: {
                            OR: {
                                id: args.id != null ? args.id : undefined,
                                bar_code: args.bar_code != null ? args.bar_code : undefined,
                                name: args.name != null ? {
                                    contains: args.name,
                                    mode: 'insensitive' 
                                } : undefined
                            }
                        },
                        orderBy: {
                            category_id: 'asc',
                        }
                    });
                    return resultProduct;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        getUniqueProduct: {
            type: ProductObject,
            description: "Search a product base on id",
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: async (parent, args) => {
                try {
                    const resultProduct = await dataPool.product.findUnique({
                        where: {
                            id: args.id
                        },
                    });
                    return resultProduct;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        getTopProducts: {
            type: GraphQLList(ProductObject),
            description: "Search a product base on id",
            resolve: async () => {
                try {
                    const resultProduct = await dataPool.product.findMany({
                        orderBy: { 
                            stocks: 'desc'
                        },
                        take: 10,
                    });
                    return resultProduct;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        showFilteredProducts: {
            type: GraphQLList(ProductObject),
            description: "Show all products filtred through categories",
            args: { 
                category_id: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: async (parent, args) => {
                try {
                    const filtredProducts = await dataPool.product.findMany({
                        where: {
                            category_id: args.category_id,
                        }
                    });
                    return filtredProducts;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        filterProductByDetail: { 
            type: GraphQLList(ProductObject),
            description: "Search a Product by its description",
            args: { 
                type: { type: GraphQLNonNull(GraphQLString) },
                category_id: { type: GraphQLNonNull(GraphQLInt) },
                unit: { type: GraphQLString },
                num_value: { type: GraphQLFloat },
                text_value: { type: GraphQLString },
            },
            resolve: async (parent, args) => {
               if (args.num_value && args.unit) {
                    try {
                        const resultProducts = await dataPool.product.findMany({
                            where: { 
                               AND: { 
                                   category_id: args.category_id,
                                   details: { 
                                    some: { 
                                        AND: { 
                                            type: (args as ProductDetails).type,
                                            num_value: (args as ProductDetails).num_value,
                                            unit: (args as ProductDetails).unit
                                        },
                                    },
                                },
                               }
                            },
                        });

                        return resultProducts;
                    } catch (err) {
                        throw new Error((err as Error).message);
                    }
               }
               else if (args.text_value && !args.num_value) {
                    try {
                        const resultProducts = await dataPool.product.findMany({
                            where: { 
                                AND: {
                                    category_id: args.category_id,
                                    details: { 
                                        some: { 
                                            AND: { 
                                                type: (args as ProductDetails).type,
                                                text_value: (args as ProductDetails).text_value
                                            },
                                        },
                                    },
                                }
                            },
                        });

                        return resultProducts;
                    } catch (err) {
                        throw new Error((err as Error).message);
                    }
               } else {
                throw new Error("Invalid arguments.");
               }
            }
        },

        getAllCategories: {
            type: GraphQLList(CategoryObject),
            description: "Show all available categories",
            resolve: async () => {
                try {
                    const allCategories = await dataPool.category.findMany();
                    return allCategories;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        searchCategory: {
            type: GraphQLList(CategoryObject),
            description: "Search a category base on name or description",
            args: {
                text: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: async (parent, args) => {
                try {
                    const resultCategory = await dataPool.category.findMany({
                        where: {
                            OR: {
                                name: {
                                    contains: args.text,
                                },
                                description: {
                                    contains: args.text
                                }
                            }
                        }
                    });
                    return resultCategory;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        }
    })
})
