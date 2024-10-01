// src/controllers/authController.ts
import { Request, Response } from "express";
import { auth } from "../services/firebaseService";

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    res.status(200).json({ user: userCredential.user });
  } catch (error) {
    res.status(400).json({ message: "Erro ao fazer login" });
  }
};
