import express from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLSchema } from "graphql";
import { PrismaClient } from '@prisma/client';
import { checkCredentials } from '../EmployeeAndAccounts/authentication';
import { RootMutation, RootQuery } from "./rootQueryMutaions";
import multer from 'multer';
import path from "path";

let productRoute = express.Router();
const mediaDIR = path.join(__dirname, '..', 'media', 'products');
const dataPool = new PrismaClient();

//initialize multer
const multerStorage = multer.diskStorage({ 
    destination: (req, file, callback) => {
        callback(null, mediaDIR);
    },
    filename: (req, file, callback) => {
        const currDate = new Date().toISOString();
        
        callback(null, req.params.productId + "_" + file.originalname);
    }
})

const upload = multer({ storage: multerStorage });

//use static files 
productRoute.use('/images', express.static(mediaDIR));

productRoute.post('/upload-product-image/:productId', checkCredentials, upload.single('image'), async (req, res) => {
    if (!req.file) {

        return res.status(400).json({
          success: false,
          message: "Failed to upload file."
        });
    } else {

        try { 
            await dataPool.product.update({
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
            
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: (err as Error).message
            });
        }
    }
})

const Schema = new GraphQLSchema({
    mutation: RootMutation,
    query: RootQuery
})

productRoute.use('/graphql', checkCredentials, graphqlHTTP(req => ({ 
    schema: Schema,
    context: (req as express.Request).user,
    graphql: false
})));

export default productRoute;