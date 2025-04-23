import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Header from './Componentes/Header';
import Footer from './Componentes/Footer'; // Import Footer

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para sesión activa
  const [user, setUser] = useState(null); // State to store user info
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('⚠️ Todos los campos son obligatorios');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      alert('⚠️ Formato de email inválido');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost/Trendify/backend/auth.php', {
        method: 'POST',
        body: new FormData(e.target),
      });

      if (response.ok) {
        const result = await response.json();
        setIsLoggedIn(true); // Activar sesión
        setUser(result.user); // Store user info
        navigate('/inicio', { state: { user: result.user } }); // Redirect to Inicio
      } else {
        const result = await response.json();
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f8f8] min-h-screen font-montserrat flex flex-col">
      <Header isLoggedIn={isLoggedIn} /> {/* Pasar estado de sesión al Header */}
      <div className="flex justify-center items-center flex-grow px-5 gap-[50px]"> {/* Removed mt-14 and mb-10 */}
        <div className="w-[40%] max-w-[400px] sticky">
          <h2 className="text-2xl mb-5 font-konkhmer font-light">INICIA SESIÓN</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              name="email"
              placeholder="E-MAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-2 border-b border-gray-400 bg-transparent outline-none font-montserrat placeholder-gray-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="CONTRASEÑA"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-2 border-b border-gray-400 bg-transparent outline-none font-montserrat placeholder-gray-500"
              required
            />
            <a href="#" className="block text-sm text-black hover:underline font-montserrat">
              ¿Has olvidado tu contraseña?
            </a>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#c08b5c] text-white rounded-full font-konkhmer font-light hover:bg-[#b08158] disabled:bg-gray-300"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  Cargando...
                  <span className="ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </span>
              ) : (
                'INICIAR SESIÓN'
              )}
            </button>
          </form>
        </div>
        <div className="w-[40%] flex justify-center items-center h-full">
          <img
            src="/img/Login-Portada.png"
            alt="Login"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <Footer /> {/* Add Footer */}
    </div>
  );
};

export default Login;
