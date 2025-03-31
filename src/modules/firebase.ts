import firebaseDB from "../../firebase";
import { collection } from "firebase/firestore";

export const POSTS_DB = collection(firebaseDB, "posts");
