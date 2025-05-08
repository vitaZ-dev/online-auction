import firebaseDB from "../libs/firebase";
import { collection } from "firebase/firestore";

export const USER_DB = collection(firebaseDB, "user");

export const POSTS_DB = collection(firebaseDB, "posts");
