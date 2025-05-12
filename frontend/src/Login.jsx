import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Componentes/Header';
import Footer from './Componentes/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
        setIsLoggedIn(true);
        setUser(result.user);
        navigate('/inicio', { state: { user: result.user, isLoggedIn: true } });
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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!forgotEmail) {
      setError('⚠️ Por favor ingresa tu correo electrónico');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(forgotEmail)) {
      setError('⚠️ Formato de email inválido');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost/Trendify/backend/forgot_password.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const result = await response.json();

      if (response.ok) {
        setCodeSent(true);
      } else {
        setError(result.error || 'Error al enviar el código');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!verificationCode) {
      setError('⚠️ Por favor ingresa el código de verificación');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError('⚠️ Por favor ingresa y confirma tu nueva contraseña');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('⚠️ Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
    const response = await fetch('http://localhost/Trendify/backend/reset_password.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: forgotEmail,
        codigo: verificationCode,  // Cambiado de 'code' a 'codigo'
        nuevaContrasena: newPassword  // Cambiado de 'newPassword' a 'nuevaContrasena'
      }),
    });

      const result = await response.json();

      if (response.ok) {
        setPasswordResetSuccess(true);
        setTimeout(() => {
          setShowForgotPassword(false);
          setPasswordResetSuccess(false);
          setCodeSent(false);
          setForgotEmail('');
          setVerificationCode('');
          setNewPassword('');
          setConfirmPassword('');
        }, 2000);
      } else {
        setError(result.error || 'Error al restablecer la contraseña');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-[#f8f8f8] min-h-screen font-montserrat flex flex-col ${showForgotPassword ? 'overflow-hidden' : ''}`}>
      <Header isLoggedIn={isLoggedIn} user={user}  />
      <div className="flex justify-center items-center flex-grow px-5 gap-[50px]">
        <div className="w-[40%] max-w-[400px] sticky">
          <h2 className="text-2xl mb-5 font-konkhmer-sleokchher">INICIA SESIÓN</h2>
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
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="block text-sm text-black hover:underline font-montserrat"
            >
              ¿Has olvidado tu contraseña?
            </button>
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
      <Footer />

      {/* Modal de recuperación de contraseña */}
      {showForgotPassword && (
  <>
    {/* 1. Fondo semi-transparente con blur que cubre TODA la pantalla (incluyendo espacio del Header) */}
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"></div>
    
    {/* 2. Header con z-index mayor para que NO se le aplique el blur y permanezca nítido */}
    <div className="fixed top-0 w-full z-50">
      <Header isLoggedIn={isLoggedIn} user={user} />
    </div>

    {/* 3. Contenedor del modal (con padding-top para evitar solapamiento con el Header) */}
    <div className="fixed inset-0 flex items-center justify-center z-50 pt-16"> {/* pt-16 = 4rem (altura aproximada del Header) */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-4"> {/* mx-4 para márgenes en móviles */}
        
        <h2 className="text-2xl mb-6 font-konkhmer-sleokchher text-center">
          RECUPERAR CONTRASEÑA
        </h2>
        
        {passwordResetSuccess ? (
          <div className="text-center py-4">
            <p className="text-green-600 mb-4">¡Contraseña restablecida con éxito!</p>
            <button
              onClick={() => setShowForgotPassword(false)}
              className="mt-4 py-2 px-4 bg-[#c08b5c] text-white rounded-full font-konkhmer font-light hover:bg-[#b08158]"
            >
              Cerrar
            </button>
          </div>
        ) : codeSent ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-sm mb-4">
              Hemos enviado un código a <strong>{forgotEmail}</strong>.
              Ingresa el código y tu nueva contraseña:
            </p>
            
            <input
              type="text"
              placeholder="Código de verificación"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full py-2 border-b border-gray-400 bg-transparent outline-none font-montserrat placeholder-gray-500"
              required
            />
            
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full py-2 border-b border-gray-400 bg-transparent outline-none font-montserrat placeholder-gray-500"
              required
            />
            
            <input
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full py-2 border-b border-gray-400 bg-transparent outline-none font-montserrat placeholder-gray-500"
              required
            />
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => {
                  setCodeSent(false);
                  setError('');
                }}
                className="py-2 px-4 text-gray-600 hover:text-gray-800 font-montserrat"
              >
                Volver
              </button>
              
              <button
                type="submit"
                className="py-2 px-4 bg-[#c08b5c] text-white rounded-full font-konkhmer font-light hover:bg-[#b08158] disabled:bg-gray-300"
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Restablecer contraseña'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <p className="text-sm mb-4">
              Ingresa tu correo electrónico registrado:
            </p>
            
            <input
              type="email"
              placeholder="E-MAIL"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full py-2 border-b border-gray-400 bg-transparent outline-none font-montserrat placeholder-gray-500"
              required
            />
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="py-2 px-4 text-gray-600 hover:text-gray-800 font-montserrat"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                className="py-2 px-4 bg-[#c08b5c] text-white rounded-full font-konkhmer font-light hover:bg-[#b08158] disabled:bg-gray-300"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar código'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  </>
)}
    </div>
  );
};

export default Login;