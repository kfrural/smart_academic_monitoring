import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../services/firebaseConfig";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/ProfilePage.css";

interface UserData {
  name: string;
  phone: string;
  profileImage: string;
  courses: string[];
  grades: { course: string; grade: string }[];
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    phone: "",
    profileImage: "",
    courses: [],
    grades: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserData(currentUser.uid);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const fetchUserData = async (uid: string) => {
    try {
      const docRef = doc(db, "usuarios", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data() as UserData);
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
    const userRef = doc(db, "usuarios", uid);
    const userData: UserData = {
      name: "",
      phone: "",
      profileImage: "",
      courses: [],
      grades: [],
    };

    try {
      await setDoc(userRef, userData);
      console.log("Documento do usuário criado com sucesso.");
    } catch (error) {
      console.error("Erro ao criar documento do usuário:", error);
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Erro ao sair:", error);
      });
  };

  const calculateAverageGrade = (): string => {
    if (userData.grades.length === 0) return "Sem notas registradas.";

    const gradesAsNumbers = userData.grades
      .map((grade) => parseFloat(grade.grade))
      .filter((grade) => !isNaN(grade));
    
    if (gradesAsNumbers.length === 0) return "Sem notas válidas.";

    const sum = gradesAsNumbers.reduce((acc, grade) => acc + grade, 0);
    const average = sum / gradesAsNumbers.length;

    return average.toFixed(2); // Retorna a média com duas casas decimais
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const userRef = doc(db, "usuarios", user.uid);
      const updatedData: Partial<UserData> = {
        name: userData.name,
        phone: userData.phone,
      };
  
      if (imageFile) {
        try {
          const storageRef = ref(storage, `profileImages/${user.uid}`);
          await uploadBytes(storageRef, imageFile);
          const imageUrl = await getDownloadURL(storageRef);
          updatedData.profileImage = imageUrl;
  
          // Atualiza o estado com a nova imagem
          setUserData((prevData) => ({
            ...prevData,
            profileImage: imageUrl,
          }));
        } catch (uploadError) {
          console.error("Erro ao fazer upload da imagem:", uploadError);
          alert("Erro ao fazer upload da imagem: " + uploadError);
          return; // Sai da função para não tentar salvar o usuário sem imagem
        }
      }
  
      await updateDoc(userRef, updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar as alterações:", error);
      alert("Erro ao salvar as alterações: " + error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleAddCourse = () => {
    const newCourse = prompt("Digite o nome do novo curso:");
    if (newCourse) {
      setUserData((prevData: UserData) => ({
        ...prevData,
        courses: [...prevData.courses, newCourse],
      }));
    }
  };

  const handleAddGrade = () => {
    const course = prompt("Digite o nome do curso:");
    const grade = prompt("Digite a nota:");
    if (course && grade) {
      setUserData((prevData: UserData) => ({
        ...prevData,
        grades: [...prevData.grades, { course, grade }],
      }));
    }
  };

  return (
    <div className="profile-page">
      <Header />
      <div className="profile-container">
        <h1>Perfil do Usuário</h1>

        {user ? (
          <>
            <div className="user-info">
              {isEditing ? (
                <>
                  <div>
                    <label>Nome:</label>
                    <input
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>Telefone:</label>
                    <input
                      type="text"
                      name="phone"
                      value={userData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>Imagem de Perfil:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </>
              ) : (
                <>
                  <h3>Nome: {userData.name || user.displayName}</h3>
                  <h4>Email: {user.email}</h4>
                  <h4>Telefone: {userData.phone || "Não informado"}</h4>
                  {userData.profileImage && (
                    <img
                      src={userData.profileImage}
                      alt="Imagem de perfil"
                      className="profile-image"
                    />
                  )}
                </>
              )}
            </div>

            <div className="grades-section">
              <h3>Notas</h3>
              {userData.grades.length > 0 ? (
                <ul>
                  {userData.grades.map((grade, index) => (
                    <li key={index}>
                      <strong>{grade.course}:</strong> {grade.grade}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Sem notas registradas.</p>
              )}
              {isEditing && (
                <button onClick={handleAddGrade}>Adicionar Nota</button>
              )}
            </div>

            <div className="courses-section">
              <h3>Cursos Matriculados</h3>
              {userData.courses.length > 0 ? (
                <ul>
                  {userData.courses.map((course, index) => (
                    <li key={index}>{course}</li>
                  ))}
                </ul>
              ) : (
                <p>Sem cursos registrados.</p>
              )}
              {isEditing && (
                <button onClick={handleAddCourse}>Adicionar Curso</button>
              )}
            </div>

            <div className="average-grade-section">
              <h3>Média das Notas: {calculateAverageGrade()}</h3>
            </div>

            {isEditing ? (
              <button
                className="save-button"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Salvando..." : "Salvar Alterações"}
              </button>
            ) : (
              <button
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                Editar Perfil
              </button>
            )}

            <button className="logout-button" onClick={handleLogout}>
              Sair
            </button>
          </>
        ) : (
          <h2>Carregando dados do usuário...</h2>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
