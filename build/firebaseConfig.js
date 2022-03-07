"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import the functions you need from the SDKs you need
const app_1 = require("firebase/app");
const storage_1 = require("firebase/storage");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAKo1KHoC69ydBr9tLmsQF5zL__1W7y4bM",
    authDomain: "baylor-inventory.firebaseapp.com",
    projectId: "baylor-inventory",
    storageBucket: "baylor-inventory.appspot.com",
    messagingSenderId: "640687416757",
    appId: "1:640687416757:web:44368c86c5dc2c765265fc",
    measurementId: "G-71VQ0P2VC9"
};
// Initialize Firebase
const app = (0, app_1.initializeApp)(firebaseConfig);
const firebaseStorage = (0, storage_1.getStorage)(app);
exports.default = firebaseStorage;
//# sourceMappingURL=firebaseConfig.js.map