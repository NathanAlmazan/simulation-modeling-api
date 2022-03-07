import express from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLSchema } from "graphql";
import { checkCredentials } from "../EmployeeAndAccounts/authentication";
import { StatusReport } from "./statisticObjects";

let statisticsRoute = express.Router();

const Schema = new GraphQLSchema({
    query: StatusReport
});

statisticsRoute.use('/graphql', checkCredentials, graphqlHTTP(req => ({ 
    schema: Schema,
    context: (req as express.Request).user,
    graphql: false
})));

export default statisticsRoute;