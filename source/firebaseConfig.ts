// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
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
const app = initializeApp(firebaseConfig);
const firebaseStorage = getStorage(app);

export default firebaseStorage;