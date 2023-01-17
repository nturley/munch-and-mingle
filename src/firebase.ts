
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOBO3fNmVcp9NfmHx4gupsrhCTedHVJvU",
  authDomain: "munch-and-mingle-b3743.firebaseapp.com",
  projectId: "munch-and-mingle-b3743",
  storageBucket: "munch-and-mingle-b3743.appspot.com",
  messagingSenderId: "504090138709",
  appId: "1:504090138709:web:9b1430a35b5f6366205cdc"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);