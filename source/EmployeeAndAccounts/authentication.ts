import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmail from '../email/emailConfig';
import Locations from '../Constants/PhilLocations';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import { RootQuery, RootMutation } from './rootQueryMutation';
import path from 'path';
import multer from 'multer';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebaseStorage from '../firebaseConfig';

let authRoute = express.Router();   //initialized express router
dotenv.config();    //initialized environment variables
const dataPool = new PrismaClient();    //database pool

//setup authentication with passport
const LocalStrategy = passportLocal.Strategy;
passport.use(new LocalStrategy({ usernameField: "email" },
    async function (email: string, password: string, done: Function) {
        try { 
            //get account from database
            const employee = await dataPool.employee.findUnique({
                where: { 
                    email: email
                },
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    position: true,
                    user_account: {
                        select: {
                            password: true
                        }
                    }
                }
            });

            //check if account exist
            if (!employee || !employee?.user_account) return done(null, false, { message: 'Account not found.' });

            //check password
            try { 
                if (await bcrypt.compare(password, employee.user_account.password)) {
                    return done(null, { userId: employee.id, username: `${employee.first_name} ${employee.last_name}`, position: employee.position });
                }
                else return done(null, false, { message: 'Password incorrect' });
            } catch (err) {
                return done(null, false, { message: 'Failed to parse password.', 
                    details: (err as Error).message });
            }

        // catch errors
        } catch (err) {
            return done(null, false, { message: 'Connection to database failed.', 
                details: (err as Error).message });
        }
    }
));

interface TokenInterface {
    userId: number;
    username: string;
    position: string;
    iat: number;
    exp: number;
};

export function checkCredentials(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers.authorization;
    try {
        const decoded = VerifyToken(authHeader as string);
        if (!decoded) return res.status(401).json({ error: "Invalid Token" });
        req.user = (decoded as TokenInterface);
        next();
    } catch {
        return res.status(400).json({ error: "Unauthorized" });
    }
   
};

function VerifyToken(authHeader: string):TokenInterface | Boolean {
    const token:string = authHeader && authHeader.split(' ')[1];
    if (!token) throw new Error("Log in required");
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY as string);
        if (decoded as TokenInterface) return (decoded as TokenInterface);
        else return false;
    } catch (error) {
        return false;
    }
};

//profile image storage
const mediaDIR = path.join(__dirname, '..', 'media', 'employees');
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
});

authRoute.post('/upload/profile/:employeeId', checkCredentials, upload.single('image'), async (req, res) => {
    if (!req.file) {

        return res.status(400).json({
          success: false,
          message: "Failed to upload file."
        });
    } else {

        try { 
            const profileImage = req.file;
            const profileRef = ref(firebaseStorage, 'profiles/' + profileImage.originalname);
            const uploadRef = await uploadBytes(profileRef, profileImage.buffer, { contentType: profileImage.mimetype });
            const url = await getDownloadURL(uploadRef.ref);

            await dataPool.employee.update({
                where: {
                    id: parseInt(req.params.employeeId),
                },
                data: {
                    profile_image: url,
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

authRoute.use('/images', express.static(mediaDIR));

//--------------------------------------------------------------------------------//
//express auth signup route

authRoute.post('/signup', async (req, res) => {
    const email:string = req.body.email;
    const password:string = req.body.password;

    //check sent credentials
    if (!email && !password) res.status(400).json({ error: "email and password required" });
    else if (!email || !password) res.status(400).json({ error: `${!email ? 'email required':''}${!password ? 'password required':''}`});
    else if (password.length < 9) res.status(400).json({ error: 'Password is too short'});

    else {
        try {
            //check if employee exist
            const employee = await dataPool.employee.findUnique({
                where: {
                    email: email
                },
                select: {
                    id: true,
                    email: true,
                    user_account: {
                        select: {
                            id: true
                        }
                    }
                }
            });
            if (!employee) return res.status(400).json({ error: 'Employee does not exist.'});
            if (employee.user_account?.id) return res.status(400).json({ error: 'Employee already have an account.'});

            //hash password 
            const hashedPassword = await bcrypt.hash(password, 10);

            //register new account
            const newAccount = await dataPool.account.create({
                data: {
                    employee_id: employee.id, 
                    password: hashedPassword
                },
                include: {
                    employee: {
                        select: {
                            first_name: true,
                            last_name: true
                        }
                    }
                }
            });

            //return username
            return res.status(201).json({ success: `${newAccount.employee.first_name} ${newAccount.employee.last_name}` });

        } catch (err) {
            return res.status(400).json({ error: (err as Error).message });
        }
    }
});

//--------------------------------------------------------------------------------//
//express auth login route

authRoute.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return res.status(401).json({ error: err.message });
        else if (!user) return res.status(401).json({ error: info });
        else {
            try {
                const accessToken = jwt.sign( user, 
                    process.env.SECRET_KEY as string, 
                    { algorithm: 'HS256', expiresIn: '24h' });
                
                const refreshToken = jwt.sign( user, 
                    process.env.SECRET_KEY as string, 
                    { algorithm: 'HS256', expiresIn: '7d' });

                return res.status(200).json({ token: { access: accessToken, refresh: refreshToken }, auth: user });
            } catch(err) {
                return res.status(400).json({ error: (err as Error).message });
            }
        }
    })(req, res, next);
});

//--------------------------------------------------------------------------------//
//express auth refresh token route

authRoute.get('/refresh', checkCredentials, (req, res) => {
    const profile = (req.user as TokenInterface);
    if (!profile) return res.status(401).json({ error: "Invalid user" });
    const user = { userId: profile.userId, username: profile.username, position: profile.position };

    //hash new access token
    const accessToken = jwt.sign( user, 
        process.env.SECRET_KEY as string, 
        { algorithm: 'HS256', expiresIn: '24h' });
        return res.status(201).json({ token: { access: accessToken }, auth: user });
});

//--------------------------------------------------------------------------------//
//express auth user profile route

authRoute.get('/user', checkCredentials, async (req, res) => {
    const profile = (req.user as TokenInterface);
    if(!profile) return res.status(404).json({ error: "Invalid user" });
    try {
        const profileImage = await dataPool.employee.findUnique({
            where: {
                id: profile.userId
            },
            select: {
                profile_image: true
            }
        });
        if(!profileImage) return res.status(404).json({ error: "Invalid user" });
        return res.status(200).json({ account: { id: profile.userId, username: profile.username, position: profile.position, image: profileImage.profile_image } });
    } catch(err) {
        return res.status(400).json({ error: (err as Error).message });
    }
    
});

//--------------------------------------------------------------------------------//
//express auth reset password route

authRoute.post('/resetPassword', async (req, res) => {
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    if (!email || !firstName || !lastName) return res.status(404).json({ error: "Email and Username is required" });
    try {
        //check user
        const accountVerify = await dataPool.employee.findFirst({
            where: {
                email: email,
                first_name: firstName,
                last_name: lastName
            },
            select: {
                id: true,
                first_name: true,
                email: true,
                user_account: {
                    select: {
                        id: true
                    }
                }
            }
        });

        if (!accountVerify || !accountVerify.user_account?.id) return res.status(404).json({ error: "User does not exist" });

        //hash reset code
        try {
            const randomCode = Math.floor(100000 + Math.random() * 900000);
            await dataPool.account.update({
                where: {
                    id: accountVerify.user_account.id
                },
                data: {
                    reset_code: randomCode.toString()
                }
            });
            
            //send reset token to email
            const emailRespose = await sendEmail(accountVerify.email, "Reset Password", accountVerify.first_name, randomCode.toString());
            if (!emailRespose) return res.status(400).json({ error: "Email send failed" });

        } catch (err) {
            return res.status(400).json({ error: (err as Error).message });
        }

        //send success response
        return res.status(200).json({ message: "Email send success", accountId: accountVerify.id });
    } catch (err) {
        return res.status(400).json({ error: (err as Error).message });
    }
});


//--------------------------------------------------------------------------------//
//express auth reset password confirm route

authRoute.post('/confirmResetPass/:resetCode/:accountId', async (req, res) => {
    const resetCode = req.params.resetCode;
    const accountId = req.params.accountId;
    const newPassword:string | null = (req.body.newPassword === req.body.newPasswordConfirm) ? req.body.newPassword : null;

    //check new Password
    if (!newPassword || newPassword.length < 9) return res.status(400).json({ error: "Invalid New Password." });

    //check refresh code
    try {
        const registeredCode = await dataPool.account.findUnique({ 
            where: { 
                id: parseInt(accountId)
            },
            select: { 
                id: true,
                reset_code: true
            }
        });
        if (resetCode !== registeredCode?.reset_code) return res.status(400).json({ error: "Code does not match."});

        //input new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const callback = await dataPool.account.update({
            where: {
                id: registeredCode.id
            },
            data: {
                password: hashedPassword,
                reset_code: null
            },
            select: {
                id: true
            }
        })
        return res.json({ success: "Successfully changed password." });

    } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
    }
});

authRoute.get('/load-locations', async (req, res) => {
    const existLocation = await dataPool.locations.findFirst({
        where: {
            id: {
                gte: 0
            }
        }
    });
    if (existLocation) return res.status(400).json({ message: "Table already exist." });
    try {
        const setupLocations = await dataPool.locations.createMany({
            data: Locations,
            skipDuplicates: true
        });
        return res.status(200).json({ success: `${setupLocations.count} locations inserted.` });
    } catch (err) {
        return res.status(400).json({ error: (err as Error).message });
    }
});

authRoute.post('/suggestLocation', async (req, res) => {
    const cityQuery = req.body.city;
    const provinceQuery = req.body.province;
    if (!cityQuery && !provinceQuery)  return res.status(400).json({ error: "Invalid parameters."});

    try {
        const locations = await dataPool.locations.findMany({
            where: { 
                city: cityQuery != null ? {
                    contains: cityQuery
                } : undefined,
                province: provinceQuery != null ? {
                    contains: provinceQuery
                } : undefined
            },
            select: {
                city: true, 
                province: true
            }
        });
        return res.status(200).json({ data: locations });
    } catch (err) {
        return res.status(400).json({ error: (err as Error).message });
    }

})

authRoute.post('/addLocation', async (req, res) => {
    const cityQuery = req.body.city;
    const provinceQuery = req.body.province;
    if (!cityQuery || !provinceQuery)  return res.status(400).json({ error: "City and Province is required."});

    try {
        const newLocation = await dataPool.locations.create({
            data: { 
                city: cityQuery,
                province: provinceQuery
            },
            select: {
                city: true, 
                province: true
            }
        });
        return res.status(200).json({ data: newLocation });
    } catch (err) {
        return res.status(400).json({ error: (err as Error).message });
    }

})

const Schema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
});

authRoute.use('/graphql', graphqlHTTP(req => ({ 
    schema: Schema,
    context: (req as express.Request).user,
    graphql: false
})))

export default authRoute;








