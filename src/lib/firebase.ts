import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUTwy83owBYdSVGkXNC7wToVw3YiflnZA",
  authDomain: "domiflame-ffmsc.firebaseapp.com",
  projectId: "domiflame-ffmsc",
  storageBucket: "domiflame-ffmsc.firebasestorage.app",
  messagingSenderId: "91386828138",
  appId: "1:91386828138:web:c5962dbf38934db1988113"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);