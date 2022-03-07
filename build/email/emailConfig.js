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
const nodemailer_1 = __importDefault(require("nodemailer"));
const handlebars_1 = __importDefault(require("handlebars"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mail = nodemailer_1.default.createTransport({
    service: 'Gmail',
    secure: true,
    auth: {
        user: "nikephoros.ague@gmail.com",
        pass: "vqpruuorqosjxxjv"
    },
});
const compile = (first_name, code) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = path_1.default.join(__dirname, 'resetPassword.hbs');
    try {
        const html = yield fs_1.default.readFileSync(filePath, 'utf-8');
        return handlebars_1.default.compile(html)({ firstName: first_name, generatedCode: code });
    }
    catch (err) {
        return null;
    }
});
function sendEmail(receiver, subject, first_name, code) {
    return __awaiter(this, void 0, void 0, function* () {
        const htmlContent = yield compile(first_name, code); // create html body
        if (!htmlContent)
            return false; // return false when failed to compile
        const mailOptions = {
            from: 'nikephoros.ague@gmail.com',
            to: receiver,
            subject: subject,
            html: htmlContent
        };
        //send email
        try {
            yield mail.sendMail(mailOptions);
            return true;
        }
        catch (err) {
            return false;
        }
    });
}
;
exports.default = sendEmail;
//# sourceMappingURL=emailConfig.js.map