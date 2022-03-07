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
const graphql_scalars_1 = require("../../node_modules/graphql-scalars");
const client_1 = require("@prisma/client");
const graphqlObjects_1 = require("./graphqlObjects");
const dataPool = new client_1.PrismaClient(); //database pool
;
exports.RootMutation = new graphql_1.GraphQLObjectType({
    name: "RootMutation",
    description: "Root of all accounts and employee mutations",
    fields: () => ({
        addEmployee: {
            type: graphqlObjects_1.EmployeeObject,
            description: "Add an employee",
            args: {
                first_name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                last_name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                contact_number: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                email: { type: (0, graphql_1.GraphQLNonNull)(graphql_scalars_1.EmailAddressResolver) },
                address: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                city: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                province: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                zip_code: { type: graphql_1.GraphQLInt },
                position: { type: (0, graphql_1.GraphQLNonNull)(graphqlObjects_1.PositionEnumType) },
                is_active: { type: graphql_1.GraphQLBoolean }
            },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                if (!graphqlObjects_1.ExecutivePosition.includes(context.position))
                    throw new Error("Unauthorized.");
                try {
                    const newEmployee = yield dataPool.employee.create({
                        data: {
                            first_name: args.first_name,
                            last_name: args.last_name,
                            contact_number: args.contact_number,
                            email: args.email,
                            address: args.address,
                            city: args.city,
                            province: args.province,
                            position: args.position,
                            zip_code: args.zip_code,
                            is_active: args.is_active != null ? args.is_active : undefined
                        }
                    });
                    return newEmployee;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        updateEmployee: {
            type: graphqlObjects_1.EmployeeObject,
            description: "Update Employee Profile",
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
                first_name: { type: graphql_1.GraphQLString },
                last_name: { type: graphql_1.GraphQLString },
                contact_number: { type: graphql_1.GraphQLString },
                email: { type: graphql_scalars_1.EmailAddressResolver },
                address: { type: graphql_1.GraphQLString },
                city: { type: graphql_1.GraphQLString },
                province: { type: graphql_1.GraphQLString },
                zip_code: { type: graphql_1.GraphQLInt },
                position: { type: graphqlObjects_1.PositionEnumType },
                is_active: { type: graphql_1.GraphQLBoolean }
            },
            resolve: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const updatedEmployee = yield dataPool.employee.update({
                        where: {
                            id: args.id
                        },
                        data: {
                            first_name: args.first_name != null ? args.first_name : undefined,
                            last_name: args.last_name != null ? args.last_name : undefined,
                            contact_number: args.contact_number != null ? args.contact_number : undefined,
                            email: args.email != null ? args.email : undefined,
                            address: args.address != null ? args.address : undefined,
                            city: args.city != null ? args.city : undefined,
                            province: args.province != null ? args.province : undefined,
                            zip_code: args.zip_code != null ? args.zip_code : undefined,
                            position: args.position != null ? args.position : undefined,
                            is_active: args.is_active != null ? args.is_active : undefined
                        }
                    });
                    return updatedEmployee;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        removeEmployee: {
            type: graphqlObjects_1.EmployeeObject,
            description: "Archived Employee",
            args: {
                id: { type: graphql_1.GraphQLInt },
                email: { type: graphql_scalars_1.EmailAddressResolver },
            },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                if (!graphqlObjects_1.ExecutivePosition.includes(context.position))
                    throw new Error("Unauthorized.");
                if (!args.email && !args.id)
                    throw new Error("Invalid argument.");
                try {
                    const removeEmployee = yield dataPool.employee.update({
                        where: {
                            id: args.id != null ? args.id : undefined,
                            email: args.email != null ? args.email : undefined
                        },
                        data: {
                            is_active: false
                        }
                    });
                    return removeEmployee;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        permanentDeleteEmployee: {
            type: graphqlObjects_1.EmployeeObject,
            description: "Permanently delete Employee",
            args: {
                id: { type: graphql_1.GraphQLInt },
                email: { type: graphql_scalars_1.EmailAddressResolver },
            },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                if (!graphqlObjects_1.ExecutivePosition.includes(context.position))
                    throw new Error("Unauthorized.");
                if (!args.email && !args.id)
                    throw new Error("Invalid argument.");
                try {
                    const deletedEmployee = yield dataPool.employee.delete({
                        where: {
                            id: args.id != null ? args.id : undefined,
                            email: args.email != null ? args.email : undefined
                        }
                    });
                    return deletedEmployee;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        addLocation: {
            type: graphqlObjects_1.LocationObject,
            description: "Add a new location",
            args: {
                province: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                city: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) }
            },
            resolve: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const newLocation = yield dataPool.locations.create({
                        data: {
                            province: args.province,
                            city: args.city
                        }
                    });
                    return newLocation;
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
    description: "Root of all Employee and Account queries.",
    fields: () => ({
        employeeProfile: {
            type: graphqlObjects_1.EmployeeObject,
            description: "Return Employee Profile",
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const employee = yield dataPool.employee.findFirst({
                        where: {
                            user_account: {
                                id: context.userId
                            }
                        }
                    });
                    return employee;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        allEmployees: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.EmployeeObject),
            description: "Return all Company Employees",
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const allEmployee = yield dataPool.employee.findMany({
                        where: {
                            is_active: true
                        }
                    });
                    return allEmployee;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        allAgents: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.EmployeeObject),
            description: "Return all Company Agents",
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const allEmployee = yield dataPool.employee.findMany({
                        where: {
                            AND: {
                                position: "Sales Agent",
                                is_active: true
                            }
                        }
                    });
                    return allEmployee;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        archivedEmployees: {
            type: (0, graphql_1.GraphQLList)(graphqlObjects_1.EmployeeObject),
            description: "Return all removed Employees",
            resolve: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const archivedEmployee = yield dataPool.employee.findMany({
                        where: {
                            is_active: false
                        }
                    });
                    return archivedEmployee;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        },
        searchEmployee: {
            type: graphqlObjects_1.EmployeeObject,
            args: {
                employeeId: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) }
            },
            resolve: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const employee = yield dataPool.employee.findUnique({
                        where: {
                            id: args.employeeId
                        }
                    });
                    return employee;
                }
                catch (err) {
                    throw new Error(err.message);
                }
            })
        }
    })
});
//# sourceMappingURL=rootQueryMutation.js.map