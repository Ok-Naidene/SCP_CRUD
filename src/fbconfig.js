import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
        apiKey: "AIzaSyDWdv_ndUnANbEm1EZa_u2yKSVW1_ZN0bA",
        authDomain: "marcelnaidene.firebaseapp.com",
        projectId: "marcelnaidene",
        storageBucket: "marcelnaidene.appspot.com",
        messagingSenderId: "682918572937",
        appId: "1:682918572937:web:96383a7cff2f930973e758",
        measurementId: "G-MLC8CWM7EV"
      };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)