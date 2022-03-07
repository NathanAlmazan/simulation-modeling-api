"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const graphql_1 = require("graphql");
const authentication_1 = require("../EmployeeAndAccounts/authentication");
const statisticObjects_1 = require("./statisticObjects");
let statisticsRoute = express_1.default.Router();
const Schema = new graphql_1.GraphQLSchema({
    query: statisticObjects_1.StatusReport
});
statisticsRoute.use('/graphql', authentication_1.checkCredentials, (0, express_graphql_1.graphqlHTTP)(req => ({
    schema: Schema,
    context: req.user,
    graphql: false
})));
exports.default = statisticsRoute;
//# sourceMappingURL=statisticsRoute.js.map