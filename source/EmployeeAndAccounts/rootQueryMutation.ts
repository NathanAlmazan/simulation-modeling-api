import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { EmailAddressResolver } from "../../node_modules/graphql-scalars";
import { PrismaClient, Employee, Locations } from '@prisma/client';
import { EmployeeObject, PositionEnumType, ExecutivePosition, LocationObject } from './graphqlObjects';

const dataPool = new PrismaClient();    //database pool

interface TokenInterface {
    userId: number;
    username: string;
    position: string;
    iat: number;
    exp: number;
};

export const RootMutation = new GraphQLObjectType({
    name: "RootMutation",
    description: "Root of all accounts and employee mutations",
    fields: () => ({
        addEmployee: {
            type: EmployeeObject,
            description: "Add an employee",
            args: {
                first_name: { type: GraphQLNonNull(GraphQLString) },
                last_name: { type: GraphQLNonNull(GraphQLString) },
                contact_number: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(EmailAddressResolver) },
                address: { type: GraphQLNonNull(GraphQLString) },
                city: { type: GraphQLNonNull(GraphQLString) },
                province: { type: GraphQLNonNull(GraphQLString) },
                zip_code: { type: GraphQLInt },
                position: { type: GraphQLNonNull(PositionEnumType) },
                is_active: { type: GraphQLBoolean }
            },
            resolve: async (parent, args, context: TokenInterface) => {
                if (!ExecutivePosition.includes(context.position)) throw new Error("Unauthorized.");
                try { 
                    const newEmployee = await dataPool.employee.create({
                        data: { 
                            first_name: (args as Employee).first_name,
                            last_name: (args as Employee).last_name,
                            contact_number: (args as Employee).contact_number,
                            email: (args as Employee).email,
                            address: (args as Employee).address,
                            city: (args as Employee).city,
                            province: (args as Employee).province,
                            position: (args as Employee).position,
                            zip_code: (args as Employee).zip_code,
                            is_active: (args as Employee).is_active != null ? (args as Employee).is_active : undefined
                        }
                    });
                    return newEmployee;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        updateEmployee: {
            type: EmployeeObject,
            description: "Update Employee Profile",
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
                first_name: { type: GraphQLString },
                last_name: { type: GraphQLString },
                contact_number: { type: GraphQLString },
                email: { type: EmailAddressResolver },
                address: { type: GraphQLString },
                city: { type: GraphQLString },
                province: { type: GraphQLString },
                zip_code: { type: GraphQLInt },
                position: { type: PositionEnumType },
                is_active: { type: GraphQLBoolean }
            },
            resolve: async (parent, args) => {
                try {
                    const updatedEmployee = await dataPool.employee.update({
                        where: { 
                            id: (args as Employee).id
                        },
                        data: { 
                            first_name: (args as Employee).first_name != null ? (args as Employee).first_name : undefined,
                            last_name: (args as Employee).last_name != null ? (args as Employee).last_name : undefined,
                            contact_number: (args as Employee).contact_number != null ? (args as Employee).contact_number : undefined,
                            email: (args as Employee).email != null ? (args as Employee).email : undefined,
                            address: (args as Employee).address != null ? (args as Employee).address : undefined,
                            city: (args as Employee).city != null ? (args as Employee).city : undefined,
                            province: (args as Employee).province != null ? (args as Employee).province : undefined,
                            zip_code: (args as Employee).zip_code != null ? (args as Employee).zip_code : undefined,
                            position: (args as Employee).position != null ? (args as Employee).position : undefined,
                            is_active: (args as Employee).is_active != null ? (args as Employee).is_active : undefined
                        }
                    });
                    return updatedEmployee;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        removeEmployee: { 
            type: EmployeeObject,
            description: "Archived Employee",
            args: { 
                id: { type: GraphQLInt },
                email: { type: EmailAddressResolver },
            },
            resolve: async (parent, args, context: TokenInterface) => {
                if (!ExecutivePosition.includes(context.position)) throw new Error("Unauthorized.");
                if (!(args as Employee).email && !(args as Employee).id) throw new Error("Invalid argument.");
                try {
                    const removeEmployee = await dataPool.employee.update({
                        where: { 
                            id: (args as Employee).id != null ? (args as Employee).id : undefined,
                            email: (args as Employee).email != null ? (args as Employee).email : undefined
                        },
                        data: { 
                            is_active: false
                        }
                    });
                    return removeEmployee;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        permanentDeleteEmployee: { 
            type: EmployeeObject,
            description: "Permanently delete Employee",
            args: { 
                id: { type: GraphQLInt },
                email: { type: EmailAddressResolver },
            },
            resolve: async (parent, args, context: TokenInterface) => {
                if (!ExecutivePosition.includes(context.position)) throw new Error("Unauthorized.");
                if (!(args as Employee).email && !(args as Employee).id) throw new Error("Invalid argument.");
                try {
                    const deletedEmployee = await dataPool.employee.delete({
                        where: {
                            id: (args as Employee).id != null ? (args as Employee).id : undefined,
                            email: (args as Employee).email != null ? (args as Employee).email : undefined
                        }
                    });
                    return deletedEmployee;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        addLocation: { 
            type: LocationObject,
            description: "Add a new location",
            args: { 
                province: { type: GraphQLNonNull(GraphQLString) },
                city: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parent, args) => {
                try {
                    const newLocation = await dataPool.locations.create({
                        data: { 
                            province: (args as Locations).province,
                            city: (args as Locations).city
                        }
                    });
                    return newLocation;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        }

    })
});

export const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    description: "Root of all Employee and Account queries.",
    fields: () => ({
        employeeProfile: { 
            type: EmployeeObject,
            description: "Return Employee Profile",
            resolve: async (parent, args, context: TokenInterface) => {
                try {
                    const employee = await dataPool.employee.findFirst({ 
                        where: { 
                            user_account: { 
                                id: context.userId
                            }
                        }
                    });
                    return employee;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },
        
        allEmployees: {
            type: GraphQLList(EmployeeObject),
            description: "Return all Company Employees",
            resolve: async (parent, args, context: TokenInterface) => {
                
                try {
                    const allEmployee = await dataPool.employee.findMany({
                        where: { 
                            is_active: true
                        }
                    });
                    return allEmployee;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        allAgents: {
            type: GraphQLList(EmployeeObject),
            description: "Return all Company Agents",
            resolve: async (parent, args, context: TokenInterface) => {
                
                try {
                    const allEmployee = await dataPool.employee.findMany({
                        where: { 
                            AND:{
                                position: "Sales Agent",
                                is_active: true
                            }
                        }
                    });
                    return allEmployee;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        archivedEmployees: { 
            type: GraphQLList(EmployeeObject),
            description: "Return all removed Employees",
            resolve: async (parent, args) => {
                try {
                    const archivedEmployee = await dataPool.employee.findMany({
                        where: { 
                            is_active: false
                        }
                    });
                    return archivedEmployee; 
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        },

        searchEmployee: { 
            type: EmployeeObject, 
            args: {
                employeeId: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: async (parent, args) => {
                try {
                    const employee = await dataPool.employee.findUnique({
                        where: {
                            id: args.employeeId
                        }
                    });

                    return employee;
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            }
        }
    })
})