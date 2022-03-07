"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const authentication_1 = require("../EmployeeAndAccounts/authentication");
let backupRoute = express_1.default.Router();
dotenv_1.default.config();
const mediaDIR = path_1.default.join(__dirname, '..', 'media', 'backups');
backupRoute.use('/files', authentication_1.checkCredentials, express_1.default.static(mediaDIR));
exports.default = backupRoute;
//# sourceMappingURL=backupRoute.js.map