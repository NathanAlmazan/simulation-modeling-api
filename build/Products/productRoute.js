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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const graphql_1 = require("graphql");
const client_1 = require("@prisma/client");
const authentication_1 = require("../EmployeeAndAccounts/authentication");
const rootQueryMutaions_1 = require("./rootQueryMutaions");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
let productRoute = express_1.default.Router();
const mediaDIR = path_1.default.join(__dirname, '..', 'media', 'products');
const dataPool = new client_1.PrismaClient();
//initialize multer
const multerStorage = multer_1.default.diskStorage({
    destination: (req, file, callback) => {
        callback(null, mediaDIR);
    },
    filename: (req, file, callback) => {
        const currDate = new Date().toISOString();
        callback(null, req.params.productId + "_" + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: multerStorage });
//use static files 
productRoute.use('/images', express_1.default.static(mediaDIR));
productRoute.post('/upload-product-image/:productId', authentication_1.checkCredentials, upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Failed to upload file."
        });
    }
    else {
        try {
            yield dataPool.product.update({
                where: {
                    id: parseInt(req.params.productId),
                },
                data: {
                    image_name: req.file.filename,
                },
            });
            return res.status(201).json({
                success: true,
                fileName: req.file.filename
            });
        }
        catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
    }
}));
const Schema = new graphql_1.GraphQLSchema({
    mutation: rootQueryMutaions_1.RootMutation,
    query: rootQueryMutaions_1.RootQuery
});
productRoute.use('/graphql', authentication_1.checkCredentials, (0, express_graphql_1.graphqlHTTP)(req => ({
    schema: Schema,
    context: req.user,
    graphql: false
})));
exports.default = productRoute;
//# sourceMappingURL=productRoute.js.map