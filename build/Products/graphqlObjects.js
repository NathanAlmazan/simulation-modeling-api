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
exports.ProductDetailsObject = exports.CategoryObject = exports.ProductObject = void 0;
const graphql_1 = require("graphql");
const client_1 = require("@prisma/client");
const graphql_scalars_1 = require("graphql-scalars");
const dataPool = new client_1.PrismaClient(); //database pool
;
exports.ProductObject = new graphql_1.GraphQLObjectType({
    name: "Products",
    description: "Company products.",
    fields: () => ({
        id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        bar_code: { type: graphql_1.GraphQLString },
        stocks: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        init_price: { type: graphql_1.GraphQLFloat },
        price: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLFloat) },
        image_name: { type: graphql_1.GraphQLString },
        is_active: { type: graphql_1.GraphQLBoolean },
        details: {
            type: (0, graphql_1.GraphQLList)(exports.ProductDetailsObject),
            resolve: (product) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const details = yield dataPool.productDetails.findMany({
                        where: {
                            product_id: product.id
                        }
                    });
                    return details;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        category: {
            type: exports.CategoryObject,
            resolve: (product) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const category = yield dataPool.category.findUnique({
                        where: {
                            id: product.category_id
                        }
                    });
                    return category;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        clearToDelete: {
            type: graphql_1.GraphQLBoolean,
            resolve: (product) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const response = yield dataPool.orderWithProduct.findFirst({
                        where: {
                            product_id: product.id
                        }
                    });
                    const response2 = yield dataPool.purcahseWithProduct.findFirst({
                        where: {
                            product_id: product.id
                        }
                    });
                    const result = Boolean(response != null || response2 != null);
                    return !result;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        totalSold: {
            type: graphql_1.GraphQLInt,
            resolve: (product) => __awaiter(void 0, void 0, void 0, function* () {
                const currYear = new Date().getFullYear();
                const startDate = new Date(currYear, 0, 1);
                const endDate = new Date(currYear, 11, 31);
                try {
                    const totalSold = yield dataPool.orderWithProduct.aggregate({
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
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        sales_history: {
            type: (0, graphql_1.GraphQLList)(graphql_1.GraphQLInt),
            args: {
                date: { type: graphql_scalars_1.DateTimeResolver },
            },
            resolve: (product, args) => __awaiter(void 0, void 0, void 0, function* () {
                if (!args.date) {
                    const currYear = new Date().getFullYear();
                    let salesHistory = [];
                    for (let x = 0; x < 12; x++) {
                        const startDate = new Date(currYear, x, 1);
                        const endDate = new Date(currYear, (x + 1), 0);
                        const totalSold = yield dataPool.orderWithProduct.aggregate({
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
                            throw new Error(err.message);
                        });
                        const result = totalSold._sum.quantity;
                        salesHistory.push(result !== null ? result : 0);
                    }
                    return salesHistory;
                }
                else {
                    const currYear = new Date(args.date).getFullYear();
                    let salesHistory = [];
                    for (let x = 0; x < 12; x++) {
                        const startDate = new Date(currYear, x, 1);
                        const endDate = new Date(currYear, (x + 1), 0);
                        const totalSold = yield dataPool.orderWithProduct.aggregate({
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
                            throw new Error(err.message);
                        });
                        const result = totalSold._sum.quantity;
                        salesHistory.push(result !== null ? result : 0);
                    }
                    return salesHistory;
                }
            })
        },
        purchase_history: {
            type: (0, graphql_1.GraphQLList)(graphql_1.GraphQLInt),
            args: {
                date: { type: graphql_scalars_1.DateTimeResolver },
            },
            resolve: (product, args) => __awaiter(void 0, void 0, void 0, function* () {
                if (!args.date) {
                    const currYear = new Date().getFullYear();
                    let purchaseHistory = [];
                    for (let x = 0; x < 12; x++) {
                        const startDate = new Date(currYear, x, 1);
                        const endDate = new Date(currYear, (x + 1), 0);
                        const totalSold = yield dataPool.purcahseWithProduct.aggregate({
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
                            throw new Error(err.message);
                        });
                        const result = totalSold._sum.quantity;
                        purchaseHistory.push(result !== null ? result : 0);
                    }
                    return purchaseHistory;
                }
                else {
                    const currYear = new Date(args.date).getFullYear();
                    let purchaseHistory = [];
                    for (let x = 0; x < 12; x++) {
                        const startDate = new Date(currYear, x, 1);
                        const endDate = new Date(currYear, (x + 1), 0);
                        const totalSold = yield dataPool.purcahseWithProduct.aggregate({
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
                            throw new Error(err.message);
                        });
                        const result = totalSold._sum.quantity;
                        purchaseHistory.push(result !== null ? result : 0);
                    }
                    return purchaseHistory;
                }
            })
        }
    })
});
exports.CategoryObject = new graphql_1.GraphQLObjectType({
    name: "Categories",
    description: "Product Categories",
    fields: () => ({
        id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        description: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        products: {
            type: (0, graphql_1.GraphQLList)(exports.ProductObject),
            resolve: (category) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const products = yield dataPool.product.findMany({
                        where: {
                            category_id: category.id
                        }
                    });
                    return products;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        suggestedDetails: {
            type: (0, graphql_1.GraphQLList)(graphql_scalars_1.JSONObjectResolver),
            resolve: (category) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const productDetails = yield dataPool.productDetails.findMany({
                        where: {
                            product: {
                                category_id: category.id
                            }
                        }
                    });
                    if (!productDetails || productDetails.length == 0)
                        return null;
                    let suggestions = [];
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
                            }
                            else {
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
                            }
                            else {
                                if (!currDetail.attributes.find(attr => attr.value == numDetail && attr.unit == detail.unit)) {
                                    currDetail.attributes.push({ value: numDetail, unit: detail.unit });
                                }
                            }
                        }
                    });
                    suggestions.sort(function (a, b) { return b.attributes.length - a.attributes.length; });
                    const finalSuggestions = suggestions.slice(0, 5);
                    return finalSuggestions;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        }
    })
});
exports.ProductDetailsObject = new graphql_1.GraphQLObjectType({
    name: "ProductDetails",
    description: "Product description and dimensions",
    fields: () => ({
        id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        type: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        unit: { type: graphql_1.GraphQLString },
        num_value: { type: graphql_1.GraphQLFloat },
        text_value: { type: graphql_1.GraphQLString },
        product: {
            type: exports.ProductObject,
            resolve: (prodDetail) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const product = yield dataPool.product.findMany({
                        where: {
                            id: prodDetail.product_id
                        }
                    });
                    return product;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        }
    })
});
//# sourceMappingURL=graphqlObjects.js.map