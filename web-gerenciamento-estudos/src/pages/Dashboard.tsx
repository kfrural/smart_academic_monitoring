// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { auth } from "../services/firebaseConfig";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <h1>Bem-vindo ao seu Dashboard</h1>
      {user && <p>Logado como: {user.email}</p>}
      <button onClick={handleLogout}>Logout</button>
      <div>
        <a href="/calendar">Ver Calendário</a>
      </div>
    </div>
  );
};

export default Dashboard;
