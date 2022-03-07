import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { EmailAddressResolver } from "graphql-scalars";
import { SupplierObject } from "./graphqlObjects";
import { PrismaClient } from "@prisma/client";

const dataPool = new PrismaClient();

export interface SupplierArgs {
    id: number;
    first_name: string;
    last_name: string;
    company_name: string | null;
    contact_number: string | null;
    email: string | null;
    website: string | null;
    address: string | null;
    city: string;
    province: string;
    is_active: boolean;
}

export const RootMutation: GraphQLObjectType = new GraphQLObjectType({
    name: "PurchaseRootMutation",
    description: "Root Mutation for Account Payables",
    fields: () => ({
        creteSupplier: {
            type: SupplierObject,
            args: { 
                first_name: { type: GraphQLNonNull(GraphQLString) },
                last_name: { type: GraphQLNonNull(GraphQLString) },
                company_name: { type: GraphQLString },
                contact_number: { type: GraphQLString },
                email: { type: EmailAddressResolver },
                website: { type: GraphQLString },
                address: { type: GraphQLString },
                city: { type: GraphQLNonNull(GraphQLString) },
                province: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: async (parent, args) => {
                const supplierInfo: SupplierArgs = args as SupplierArgs;
                try {
                    const newSupplier = await dataPool.supplier.create({
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
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        updateSupplier: {
            type: SupplierObject,
            args: { 
                id: { type: GraphQLNonNull(GraphQLInt) },
                first_name: { type: GraphQLString },
                last_name: { type: GraphQLString },
                company_name: { type: GraphQLString },
                contact_number: { type: GraphQLString },
                email: { type: EmailAddressResolver },
                website: { type: GraphQLString },
                address: { type: GraphQLString },
                city: { type: GraphQLString },
                province: { type: GraphQLString },
                is_active: { type: GraphQLBoolean }
            },
            resolve: async (parent, args) => {
                const supplierInfo = args as SupplierArgs;
                try {
                    const updatedSupplier = await dataPool.supplier.update({
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
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        deleteSupplier: {
            type: SupplierObject,
            args: {
                supplierId: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: async (parent, args) => {
                const supplierId = args.supplierId as number;
                try {
                    const purchaseOrders = await dataPool.purchase.aggregate({
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

                    const deleteSupplier = await dataPool.supplier.delete({
                        where: {
                            id: supplierId
                        }
                    });

                    return deleteSupplier;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        archiveSupplier: {
            type: SupplierObject,
            args: {
                supplierId: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: async (parent, args) => {
                try {
                    const archivedSupplier = await dataPool.supplier.update({
                        where: { 
                            id: args.supplierId
                        }, 
                        data: {
                            is_active: false
                        }
                    });

                    return archivedSupplier;
                } catch (err) { 
                    throw new Error((err as Error).message);
                }
            }
        },
        UnArchiveSupplier: {
            type: SupplierObject,
            args: {
                supplierId: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: async (parent, args) => {
                try {
                    const archivedSupplier = await dataPool.supplier.update({
                        where: { 
                            id: args.supplierId
                        }, 
                        data: {
                            is_active: true
                        }
                    });

                    return archivedSupplier;
                } catch (err) { 
                    throw new Error((err as Error).message);
                }
            }
        }
    })
})