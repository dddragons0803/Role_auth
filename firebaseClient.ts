// firebaseClient.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBdy9WmV6lwCYZiWwJNF4P8fSjqBhSTlMo",
    authDomain: "role-auth-10091.firebaseapp.com",
    projectId: "role-auth-10091",
    storageBucket: "role-auth-10091.appspot.com",
    messagingSenderId: "457703497018",
    appId: "1:457703497018:web:6ba152865976c64d6a4403",
    measurementId: "G-W69T656V7B"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(app);

export default storage;
