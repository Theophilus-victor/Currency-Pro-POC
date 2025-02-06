import { initializeApp } from "firebase/app";
import { getAnalytics } from "friebase/getAnalytics"
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseconfig = {
    apikey: "AIzaSyD_aQsV_-b2wd28Kx0IcLwC2hbPth7gr5s",
    authDomain: "currencypro-db.firebaseapp.com",
    projectId: "currencypro-db",
    storageBucket: "currencypro-db.firebasestorage.app",
    messagingSenderId: "1011317877024",
    appId: "1:1011317877024:web:1afb70cf0f6ff6b3858f45",
    measurementId: "G-4W4BELNB9K"
};

const app = initalizeapp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth, db };