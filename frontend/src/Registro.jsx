import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Header from "./Componentes/Header";
import Footer from "./Componentes/Footer"; // Import Footer

const Registro = () => {
  const [formData, setFormData] = useState({
    email: "",
    nombre: "",
    apaterno: "",
    amaterno: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("⚠️ Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost/Trendify/backend/registrar.php", {
        method: "POST",
        body: new FormData(e.target),
      });

      const result = await response.text();
      if (result.includes("Error")) {
        alert(result);
      } else {
        alert("Se ha registrado correctamente");
        navigate("/login"); // Redirect to /login
      }
    } catch (error) {
      alert("Error de conexión: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f8f8] min-h-screen font-montserrat flex flex-col">
      <Header />
      <div className="flex justify-center items-center flex-grow px-5 gap-[50px]"> {/* Removed mt-14 and mb-10 */}
        <div className="w-[40%] max-w-[400px] sticky">
          <h2 className="text-2xl mb-5 font-konkhmer font-light">INGRESA TUS DATOS</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              name="email"
              placeholder="E-MAIL"
              value={formData.email}
              onChange={handleChange}
              className="w-full py-2 border-b border-gray-400 bg-transparent outline-none placeholder-gray-500"
              required
            />
            <input
              type="text"
              name="nombre"
              placeholder="NOMBRE"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full py-2 border-b border-gray-400 bg-transparent outline-none placeholder-gray-500"
              required
            />
            <input
              type="text"
              name="apaterno"
              placeholder="APELLIDO PATERNO"
              value={formData.apaterno}
              onChange={handleChange}
              className="w-full py-2 border-b border-gray-400 bg-transparent outline-none placeholder-gray-500"
              required
            />
            <input
              type="text"
              name="amaterno"
              placeholder="APELLIDO MATERNO"
              value={formData.amaterno}
              onChange={handleChange}
              className="w-full py-2 border-b border-gray-400 bg-transparent outline-none placeholder-gray-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="CONTRASEÑA"
              value={formData.password}
              onChange={handleChange}
              className="w-full py-2 border-b border-gray-400 bg-transparent outline-none placeholder-gray-500"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="CONFIRMAR CONTRASEÑA"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full py-2 border-b border-gray-400 bg-transparent outline-none placeholder-gray-500"
              required
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="mr-2"
                required
              />
              <label className="text-sm">Acepto los términos y condiciones</label>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#c08b5c] text-white rounded-full font-konkhmer font-light hover:bg-[#b08158] disabled:bg-gray-300"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  Registrando...
                  <span className="ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </span>
              ) : (
                "REGISTRARSE"
              )}
            </button>
          </form>
        </div>
        <div className="w-[40%] flex justify-center items-center h-full">
          <img
            src="/img/Registro-Portada.png"
            alt="Registro"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Registro;
