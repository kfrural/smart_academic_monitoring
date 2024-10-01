// src/services/firebaseService.ts
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const firebaseConfig = {
  credential: /* seu método de credenciais, ex: serviceAccount */,
};

initializeApp(firebaseConfig);

const auth = getAuth();

export { auth };
