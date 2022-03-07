"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootQuery = exports.RootMutation = void 0;
const graphql_1 = require("graphql");
const graphqlObjects_1 = require("./graphqlObjects");
const client_1 = require("@prisma/client");
const dataPool = new client_1.PrismaClient();
const UnAuthorized = ["Warehouse Staff", "Delivery Personnel", "Sales Agent"];
const ExecutivePosition = ["President", "Vice President", "Manager"];
;
exports.RootMutation = new graphql_1.GraphQLObjectType({
    name: "RootMutation",
    description: "Root Mutation for Product Information",
    fields: () => ({
        addProduct: {
            type: graphqlObjects_1.ProductObject,
            description: "Add a product to the database",
            args: {
                name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                bar_code: { type: graphql_1.GraphQLString },
                stocks: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
                category_id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
                price: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLFloat) }
            },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                if (UnAuthorized.includes(context.position))
                    throw new Error("Unauthorized");
                try {
                    const newProduct = yield dataPool.product.create({
                        data: {
                            name: args.name,
                            bar_code: args.bar_code,
                            stocks: args.stocks,
                            price: args.price,
                            category_id: args.category_id
                        },
                    });
                    return newProduct;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        updateProduct: {
            type: graphqlObjects_1.ProductObject,
            description: "Update a product in the database",
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
                name: { type: graphql_1.GraphQLString },
                stocks: { type: graphql_1.GraphQLInt },
                bar_code: { type: graphql_1.GraphQLString },
                category_id: { type: graphql_1.GraphQLInt },
                price: { type: graphql_1.GraphQLFloat },
                is_active: { type: graphql_1.GraphQLBoolean },
            },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                if (UnAuthorized.includes(context.position))
                    throw new Error("Unauthorized");
                try {
                    const updatedProduct = yield dataPool.product.update({
                        where: {
                            id: args.id
                        },
                        data: {
                            name: args.name != null ? args.name : undefined,
                            stocks: args.stocks != null ? args.stocks : undefined,
                            bar_code: args.bar_code != null ? args.bar_code : undefined,
                            price: args.price != null ? args.price : undefined,
                            category_id: args.category_id != null ? args.category_id : undefined,
                            is_active: args.is_active != null ? args.is_active : undefined,
                        }
                    });
                    if (args.is_active == null) {
                        yield dataPool.productDetails.deleteMany({
                            where: {
                                product_id: updatedProduct.id
                            }
                        });
                    }
                    return updatedProduct;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        removeProduct: {
            type: graphqlObjects_1.ProductObject,
            description: "Set a product to archived",
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) }
            },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                if (UnAuthorized.includes(context.position))
                    throw new Error("Unauthorized");
                try {
                    const removedProduct = yield dataPool.product.update({
                        where: {
                            id: args.id
                        },
                        data: {
                            is_active: false
                        }
                    });
                    return removedProduct;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        permaDeleteProduct: {
            type: graphqlObjects_1.ProductObject,
            description: "Delete a product in the database",
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) }
            },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                if (!ExecutivePosition.includes(context.position))
                    throw new Error("Unauthorized");
                try {
                    yield dataPool.productDetails.deleteMany({
                        where: {
                            product_id: args.id
                        }
                    });
                    const deletedProduct = yield dataPool.product.delete({
                        where: {
                            id: args.id
                        }
                    });
                    return deletedProduct;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        addCategory: {
            type: graphqlObjects_1.CategoryObject,
            description: "Add a product category",
            args: {
                name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                description: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) }
            },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                if (UnAuthorized.includes(context.position))
                    throw new Error("Unauthorized");
                try {
                    const newCategory = yield dataPool.category.create({
                        data: {
                            name: args.name,
                            description: args.description
                        }
                    });
                    return newCategory;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        updateCategory: {
            type: graphqlObjects_1.CategoryObject,
            description: "Update Product Category",
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
                name: { type: graphql_1.GraphQLString },
                description: { type: graphql_1.GraphQLString }
            },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                if (UnAuthorized.includes(context.position))
                    throw new Error("Unauthorized");
                try {
                    const updatedCategory = yield dataPool.category.update({
                        where: {
                            id: args.id
                        },
                        data: {
                            name: args.name != null ? args.name : undefined,
                            description: args.description != null ? args.description : undefined
                        }
                    });
                    return updatedCategory;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        deleteCategory: {
            type: graphqlObjects_1.CategoryObject,
            description: "Remove a Category only when no product is connected",
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) }
            },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                if (UnAuthorized.includes(context.position))
                    throw new Error("Unauthorized");
                try {
                    const countCategoryProd = yield dataPool.product.count({
                        where: {
                            category_id: args.id
                        }
                    });
                    if (countCategoryProd === 0 || !countCategoryProd) {
                        const deleteCategory = yield dataPool.category.delete({
                            where: {
                                id: args.id
                            }
                        });
                        return deleteCategory;
                    }
                    else
                        throw new Error("Cannot delete category with products.");
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        addDetails: {
            type: graphqlObjects_1.ProductDetailsObject,
            description: "Add a detail to the product",
            args: {
                product_id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
                type: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                unit: { type: graphql_1.GraphQLString },
                num_value: { type: graphql_1.GraphQLFloat },
                text_value: { type: graphql_1.GraphQLString },
            },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                if (UnAuthorized.includes(context.position))
                    throw new Error("Unauthorized");
                if (args.num_value && args.unit) {
                    try {
                        const newProductDetail = yield dataPool.productDetails.create({
                            data: {
                                product_id: args.product_id,
                                type: args.type,
                                num_value: args.num_value,
                                unit: args.unit
                            }
                        });
                        return newProductDetail;
                    }
                    catch (err) {
                        throw new Error(err.message);
                    }
                }
                else if (args.text_value && !args.num_value) {
                    try {
                        const newProductDetail = yield dataPool.productDetails.create({
                            data: {
                                product_id: args.product_id,
                                type: args.type,
                                text_value: args.text_value
                            }
                        });
                        return newProductDetail;
                    }
                    catch (err) {
                        throw new Error(err.message);
                    }
                }
                else {
                    throw new Error("Invalid arguments.");
                }
            })
        },
        updateDetails: {
            type: graphqlObjects_1.ProductDetailsObject,
            description: "Update Product details descriptions",
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
                type: { type: graphql_1.GraphQLString },
                unit: { type: graphql_1.GraphQLString },
                num_value: { type: graphql_1.GraphQLFloat },
                text_value: { type: graphql_1.GraphQLString },
            },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                if (UnAuthorized.includes(context.position))
                    throw new Error("Unauthorized");
                try {
                    const updatedDetail = yield dataPool.productDetails.update({
                        where: {
                            id: args.id
                        },
                        data: {
                            type: args.type != null ? args.type : undefined,
                            unit: args.unit != null ? args.unit : undefined,
                            num_value: args.num_value != null ? args.num_value : undefined,
                            text_value: args.text_value != null ? args.text_value : undefined
                        }
                    });
                    return updatedDetail;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        deleteDetails: {
            type: graphqlObjects_1.ProductDetailsObject,
            description: "Remove a product detail",
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
            },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                if (UnAuthorized.includes(context.position))
                    throw new Error("Unauthorized");
                try {
                    const deletedProdDetail = yield dataPool.productDetails.delete({
                        where: { id: args.id }
                    });
                    return deletedProdDetail;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        }
    })
});
exports.RootQuery = new graphql_1.GraphQLObjectType({
    name: "RootQuery",
    description: "Root query of all products",
    fields: () => ({
        showAllProducts: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.ProductObject),
            description: "Show all products without filter",
            resolve: () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const showAllProducts = yield dataPool.product.findMany({
                        where: {
                            is_active: true,
                        },
                        orderBy: {
                            stocks: 'desc'
                        }
                    });
                    return showAllProducts;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        showArchivedProducts: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.ProductObject),
            description: "Show all products without filter",
            resolve: () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const showAllProducts = yield dataPool.product.findMany({
                        where: {
                            is_active: false,
                        },
                        orderBy: {
                            stocks: 'desc'
                        }
                    });
                    return showAllProducts;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        searchProduct: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.ProductObject),
            description: "Search a product base on id or name",
            args: {
                id: { type: graphql_1.GraphQLInt },
                name: { type: graphql_1.GraphQLString },
                bar_code: { type: graphql_1.GraphQLString },
            },
            resolve: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
                if (!args.id && !args.name && !args.bar_code)
                    throw new Error("Invalid arguments.");
                try {
                    const resultProduct = yield dataPool.product.findMany({
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
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        getUniqueProduct: {
            type: graphqlObjects_1.ProductObject,
            description: "Search a product base on id",
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) }
            },
            resolve: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const resultProduct = yield dataPool.product.findUnique({
                        where: {
                            id: args.id
                        },
                    });
                    return resultProduct;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        getTopProducts: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.ProductObject),
            description: "Search a product base on id",
            resolve: () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const resultProduct = yield dataPool.product.findMany({
                        orderBy: {
                            stocks: 'desc'
                        },
                        take: 10,
                    });
                    return resultProduct;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        showFilteredProducts: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.ProductObject),
            description: "Show all products filtred through categories",
            args: {
                category_id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
            },
            resolve: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const filtredProducts = yield dataPool.product.findMany({
                        where: {
                            category_id: args.category_id,
                        }
                    });
                    return filtredProducts;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        filterProductByDetail: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.ProductObject),
            description: "Search a Product by its description",
            args: {
                type: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                category_id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
                unit: { type: graphql_1.GraphQLString },
                num_value: { type: graphql_1.GraphQLFloat },
                text_value: { type: graphql_1.GraphQLString },
            },
            resolve: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
                if (args.num_value && args.unit) {
                    try {
                        const resultProducts = yield dataPool.product.findMany({
                            where: {
                                AND: {
                                    category_id: args.category_id,
                                    details: {
                                        some: {
                                            AND: {
                                                type: args.type,
                                                num_value: args.num_value,
                                                unit: args.unit
                                            },
                                        },
                                    },
                                }
                            },
                        });
                        return resultProducts;
                    }
                    catch (err) {
                        throw new Error(err.message);
                    }
                }
                else if (args.text_value && !args.num_value) {
                    try {
                        const resultProducts = yield dataPool.product.findMany({
                            where: {
                                AND: {
                                    category_id: args.category_id,
                                    details: {
                                        some: {
                                            AND: {
                                                type: args.type,
                                                text_value: args.text_value
                                            },
                                        },
                                    },
                                }
                            },
                        });
                        return resultProducts;
                    }
                    catch (err) {
                        throw new Error(err.message);
                    }
                }
                else {
                    throw new Error("Invalid arguments.");
                }
            })
        },
        getAllCategories: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.CategoryObject),
            description: "Show all available categories",
            resolve: () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const allCategories = yield dataPool.category.findMany();
                    return allCategories;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        searchCategory: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.CategoryObject),
            description: "Search a category base on name or description",
            args: {
                text: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
            },
            resolve: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const resultCategory = yield dataPool.category.findMany({
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
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        }
    })
});
//# sourceMappingURL=rootQueryMutaions.js.map