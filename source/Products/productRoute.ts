import express from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLSchema } from "graphql";
import { checkCredentials } from '../EmployeeAndAccounts/authentication';
import { RootMutation, RootQuery } from "./rootQueryMutaions";
import multer from 'multer';
import path from "path";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebaseStorage from "../firebaseConfig";
import dataPool from "../prismaConfig";

let productRoute = express.Router();
const mediaDIR = path.join(__dirname, '..', 'media', 'products');

//initialize multer
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
});

//use static files 
productRoute.use('/images', express.static(mediaDIR));

productRoute.post('/upload-product-image/:productId', checkCredentials, upload.single('image'), async (req, res) => {
    if (!req.file) {

        return res.status(400).json({
          success: false,
          message: "Failed to upload file."
        });
    } else {

        const productImage = req.file;
        const profileRef = ref(firebaseStorage, 'products/' + productImage.originalname);
        const uploadRef = await uploadBytes(profileRef, productImage.buffer, { contentType: productImage.mimetype });
        const url = await getDownloadURL(uploadRef.ref);

        try { 
            await dataPool.product.update({
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

productRoute.use('/graphql', graphqlHTTP(req => ({ 
    schema: Schema,
    context: (req as express.Request).user,
    graphql: false
})));

export default productRoute;