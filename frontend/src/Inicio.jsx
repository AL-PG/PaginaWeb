import React from "react";
import Header from "./Componentes/Header";
import { useLocation } from "react-router-dom"; // Import hooks

const Inicio = () => {
  const location = useLocation(); // Get state from navigation
  const user = location.state?.user; // Safely access user data

  return (
    <div className="bg-[#f8f8f8] min-h-screen font-montserrat">
      <Header isLoggedIn={!!user} user={user} /> {/* Pass user info if available */}
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-3xl font-konkhmer">
          ¡Bienvenido, {user?.nombreCompleto || "Visitante"}!
        </h1>
      </div>
    </div>
  );
};

export default Inicio;
