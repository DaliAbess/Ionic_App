// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdi8vWQtwmNaGSOykBJJ2mPrNo96zVBWk",
  authDomain: "ionic-aeb37.firebaseapp.com",
  projectId: "ionic-aeb37",
  storageBucket: "ionic-aeb37.appspot.com",
  messagingSenderId: "823610532359",
  appId: "1:823610532359:web:7c1e67a85f4263637540a2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
