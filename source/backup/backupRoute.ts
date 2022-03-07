import express from "express";
import dotenv from 'dotenv';
import path from 'path';
import { checkCredentials } from "../EmployeeAndAccounts/authentication";

let backupRoute = express.Router();
dotenv.config();    

const mediaDIR = path.join(__dirname, '..', 'media', 'backups');

backupRoute.use('/files', checkCredentials, express.static(mediaDIR));

export default backupRoute;
