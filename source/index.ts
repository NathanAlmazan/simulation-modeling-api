import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import schedule from 'node-schedule';

//routes
import authRoute from './EmployeeAndAccounts/authentication';
import productRoute from './Products/productRoute';
import salesOrderRoute from './OrdersAndSales/salesOrderRoute';
import cors from 'cors';
import purchaseRoute from './PurchasedAndPayables/purchaseRoute';
import backupRoute from './backup/backupRoute';
import CreateBackup from './backup/backupData';
import statisticsRoute from './statistics/statisticsRoute';

const corsOptions = {
    origin: 'http://localhost:3000',
}

//initialized express
const app = express();
dotenv.config(); //get environment variables
const port = process.env.PORT || 4000;

//app body parser middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//employee and account routes
app.use('/users', authRoute)
//product routes
app.use('/product', productRoute);
//sales and payment routes
app.use('/sales', salesOrderRoute);
//purchase route
app.use('/payables', purchaseRoute);
//backup
app.use('/backup', backupRoute);
//statistics
app.use('/statistics', statisticsRoute);

schedule.scheduleJob('0 14 * * *', () => {
    CreateBackup();
});

//express listen
app.listen(port, () => {
    console.log("Listening on port ",  port);
}).on("error", (err:Error) => {
    console.log("Error", err.message);
});


