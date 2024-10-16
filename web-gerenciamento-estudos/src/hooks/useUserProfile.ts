import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../services/firebaseConfig';
import { UserData } from "../models/UserData";

interface UserProfileHook {
  user: User | null;
  userData: UserData;
  isEditing: boolean;
  isSaving: boolean;
  imageFile: File | null;
  handleLogout: () => void;
  handleSave: () => Promise<void>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddCourse: () => void;
}

export const useUserProfile = (): UserProfileHook => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    phone: '',
    profileImage: '',
    courses: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const auth = useRef(getAuth());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth.current, (currentUser) => {
      setUser(currentUser);
      fetchUserData(currentUser?.uid || '');
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid: string) => {
    try {
      const docRef = doc(db, 'usuarios', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const fetchedData = docSnap.data() as UserData;
        setUserData(fetchedData);
      } else {
        console.error("Usuário não encontrado! Criando novo documento...");
        await createUserDocument(uid);
        const newDocSnap = await getDoc(docRef);
        setUserData(newDocSnap.data() as UserData);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    }
  };

  const createUserDocument = async (uid: string) => {
    const userRef = doc(db, 'usuarios', uid);
    const initialData: UserData = {
      name: '',
      phone: '',
      profileImage: '',
      courses: [],
    };

    try {
      await setDoc(userRef, initialData);
      console.log("Documento do usuário criado com sucesso.");
    } catch (error) {
      console.error("Erro ao criar documento do usuário:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth.current);
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    const userRef = doc(db, 'usuarios', user.uid);
    const updatedData: Partial<UserData> = {
      name: userData.name,
      phone: userData.phone,
      courses: userData.courses,
    };

    if (imageFile) {
      try {
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);
        updatedData.profileImage = imageUrl;
        setUserData((prevData) => ({ ...prevData, profileImage: imageUrl }));
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        alert("Erro ao fazer upload da imagem.");
        setIsSaving(false);
        return;
      }
    }

    try {
      await updateDoc(userRef, updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar as alterações:", error);
      alert("Erro ao salvar as alterações.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleAddCourse = () => {
    const newCourse = prompt("Digite o nome do novo curso:");
    if (newCourse) {
      setUserData((prevData) => ({
        ...prevData,
        courses: [...prevData.courses, newCourse],
      }));
    }
  };

  return {
    user,
    userData,
    isEditing,
    isSaving,
    imageFile,
    handleLogout,
    handleSave,
    handleChange,
    handleFileChange,
    handleAddCourse,
  };
};
