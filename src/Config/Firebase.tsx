import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyAS4TskW6Df_0nHNKVz9PRlA0MtSV3JUho",
	authDomain: "text-image-post-get.firebaseapp.com",
	projectId: "text-image-post-get",
	storageBucket: "text-image-post-get.appspot.com",
	messagingSenderId: "847522651951",
	appId: "1:847522651951:web:b65a0a596a0a32ce5c0bda",
	measurementId: "G-GZGBXZ7G1N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);

export const db = getFirestore(app);
