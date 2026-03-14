import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
 getFirestore,
 collection,
 addDoc,
 getDocs,
 orderBy,
 query,
 serverTimestamp,
 doc,
 deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
 apiKey: "AIzaSyBLCGxMnraxFH
