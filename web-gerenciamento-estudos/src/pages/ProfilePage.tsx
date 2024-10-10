import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/ProfilePage.css";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>({
    name: "",
    phone: "",
    academicStatus: "",
    courses: [],
    grades: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
        setUserData(docSnap.data());
      } else {
        console.error("Usuário não encontrado!");
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
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

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const userRef = doc(db, "usuarios", user.uid);
      await updateDoc(userRef, {
        name: userData.name,
        phone: userData.phone,
        academicStatus: userData.academicStatus,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar as alterações:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
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
                    <label>Status Acadêmico:</label>
                    <input
                      type="text"
                      name="academicStatus"
                      value={userData.academicStatus}
                      onChange={handleChange}
                    />
                  </div>
                </>
              ) : (
                <>
                  <h3>Nome: {userData.name || user.displayName}</h3>
                  <h4>Email: {user.email}</h4>
                  <h4>Telefone: {userData.phone || "Não informado"}</h4>
                  <h4>Status Acadêmico: {userData.academicStatus || "Não informado"}</h4>
                </>
              )}
            </div>

            <div className="grades-section">
              <h3>Notas</h3>
              {userData.grades.length > 0 ? (
                <ul>
                  {userData.grades.map((grade: any, index: number) => (
                    <li key={index}>
                      <strong>{grade.course}:</strong> {grade.grade}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Sem notas registradas.</p>
              )}
            </div>

            <div className="courses-section">
              <h3>Cursos Matriculados</h3>
              {userData.courses.length > 0 ? (
                <ul>
                  {userData.courses.map((course: string, index: number) => (
                    <li key={index}>{course}</li>
                  ))}
                </ul>
              ) : (
                <p>Sem cursos registrados.</p>
              )}
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
