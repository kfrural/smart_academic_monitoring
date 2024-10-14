import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

export const authService = {
  login: (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  },
  register: (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  },
  async logout() {
    return await signOut(auth);
  }
};
