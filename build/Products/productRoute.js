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
const authentication_1 = require("../EmployeeAndAccounts/authentication");
const rootQueryMutaions_1 = require("./rootQueryMutaions");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage_1 = require("firebase/storage");
const firebaseConfig_1 = __importDefault(require("../firebaseConfig"));
const prismaConfig_1 = __importDefault(require("../prismaConfig"));
let productRoute = express_1.default.Router();
const mediaDIR = path_1.default.join(__dirname, '..', 'media', 'products');
//initialize multer
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
});
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
        const productImage = req.file;
        const profileRef = (0, storage_1.ref)(firebaseConfig_1.default, 'products/' + productImage.originalname);
        const uploadRef = yield (0, storage_1.uploadBytes)(profileRef, productImage.buffer, { contentType: productImage.mimetype });
        const url = yield (0, storage_1.getDownloadURL)(uploadRef.ref);
        try {
            yield prismaConfig_1.default.product.update({
                where: {
                    id: parseInt(req.params.productId),
                },
                data: {
                    image_name: url,
                },
            });
            return res.status(201).json({
                success: true,
                fileName: url
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
productRoute.use('/graphql', (0, express_graphql_1.graphqlHTTP)(req => ({
    schema: Schema,
    context: req.user,
    graphql: false
})));
exports.default = productRoute;
//# sourceMappingURL=productRoute.js.map