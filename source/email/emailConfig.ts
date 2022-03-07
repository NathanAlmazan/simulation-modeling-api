import nodemailer from 'nodemailer';
import hbs from 'handlebars';
import fs from 'fs';
import path from 'path';

const mail = nodemailer.createTransport({
    service: 'Gmail',
    secure: true,
    auth: {
      user: "nikephoros.ague@gmail.com",
      pass: "vqpruuorqosjxxjv"
    },
  });

const compile = async (first_name: string, code: string) : Promise<string | null> => {
    const filePath = path.join(__dirname, 'resetPassword.hbs');
    try {
        const html = await fs.readFileSync(filePath, 'utf-8');
        return hbs.compile(html)({ firstName: first_name, generatedCode: code });
    } catch (err) {
        return null;
    }  
}

async function sendEmail (receiver:string, subject:string, first_name: string, code: string) : Promise<boolean> {
    const htmlContent = await compile(first_name, code); // create html body
    if (!htmlContent) return false; // return false when failed to compile

    const mailOptions = {
        from: 'nikephoros.ague@gmail.com',
        to: receiver,
        subject: subject,
        html: htmlContent
    };

    //send email
    try {
        await mail.sendMail(mailOptions)
        return true;
    } catch (err) {
        return false;
    }
};

export default sendEmail;


