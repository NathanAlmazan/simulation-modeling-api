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
exports.RootMutation = void 0;
const graphql_1 = require("graphql");
const graphql_scalars_1 = require("graphql-scalars");
const graphqlObjects_1 = require("./graphqlObjects");
const client_1 = require("@prisma/client");
const dataPool = new client_1.PrismaClient();
exports.RootMutation = new graphql_1.GraphQLObjectType({
    name: "PurchaseRootMutation",
    description: "Root Mutation for Account Payables",
    fields: () => ({
        creteSupplier: {
            type: graphqlObjects_1.SupplierObject,
            args: {
                first_name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                last_name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                company_name: { type: graphql_1.GraphQLString },
                contact_number: { type: graphql_1.GraphQLString },
                email: { type: graphql_scalars_1.EmailAddressResolver },
                website: { type: graphql_1.GraphQLString },
                address: { type: graphql_1.GraphQLString },
                city: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                province: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
            },
            resolve: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
                const supplierInfo = args;
                try {
                    const newSupplier = yield dataPool.supplier.create({
                        data: {
                            first_name: supplierInfo.first_name,
                            last_name: supplierInfo.last_name,
                            company_name: supplierInfo.company_name,
                            contact_number: supplierInfo.contact_number,
                            email: supplierInfo.email,
                            website: supplierInfo.website,
                            address: supplierInfo.address,
                            city: supplierInfo.city,
                            province: supplierInfo.province
                        }
                    });
                    return newSupplier;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        updateSupplier: {
            type: graphqlObjects_1.SupplierObject,
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
                first_name: { type: graphql_1.GraphQLString },
                last_name: { type: graphql_1.GraphQLString },
                company_name: { type: graphql_1.GraphQLString },
                contact_number: { type: graphql_1.GraphQLString },
                email: { type: graphql_scalars_1.EmailAddressResolver },
                website: { type: graphql_1.GraphQLString },
                address: { type: graphql_1.GraphQLString },
                city: { type: graphql_1.GraphQLString },
                province: { type: graphql_1.GraphQLString },
                is_active: { type: graphql_1.GraphQLBoolean }
            },
            resolve: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
                const supplierInfo = args;
                try {
                    const updatedSupplier = yield dataPool.supplier.update({
                        where: {
                            id: supplierInfo.id
                        },
                        data: {
                            first_name: supplierInfo.first_name,
                            last_name: supplierInfo.last_name,
                            company_name: supplierInfo.company_name,
                            contact_number: supplierInfo.contact_number,
                            email: supplierInfo.email,
                            website: supplierInfo.website,
                            address: supplierInfo.address,
                            city: supplierInfo.city,
                            province: supplierInfo.province,
                            is_active: supplierInfo.is_active
                        }
                    });
                    return updatedSupplier;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        deleteSupplier: {
            type: graphqlObjects_1.SupplierObject,
            args: {
                supplierId: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) }
            },
            resolve: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
                const supplierId = args.supplierId;
                try {
                    const purchaseOrders = yield dataPool.purchase.aggregate({
                        where: {
                            supplier_id: supplierId
                        },
                        _count: {
                            id: true
                        }
                    });
                    if (purchaseOrders._count.id !== 0) {
                        throw new Error("Supplier have active payables.");
                    }
                    const deleteSupplier = yield dataPool.supplier.delete({
                        where: {
                            id: supplierId
                        }
                    });
                    return deleteSupplier;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        archiveSupplier: {
            type: graphqlObjects_1.SupplierObject,
            args: {
                supplierId: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
            },
            resolve: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const archivedSupplier = yield dataPool.supplier.update({
                        where: {
                            id: args.supplierId
                        },
                        data: {
                            is_active: false
                        }
                    });
                    return archivedSupplier;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        UnArchiveSupplier: {
            type: graphqlObjects_1.SupplierObject,
            args: {
                supplierId: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
            },
            resolve: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const archivedSupplier = yield dataPool.supplier.update({
                        where: {
                            id: args.supplierId
                        },
                        data: {
                            is_active: true
                        }
                    });
                    return archivedSupplier;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        }
    })
});
//# sourceMappingURL=rootMutation.js.map