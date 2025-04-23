import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaSearch, FaShoppingCart, FaUser, FaHeart, FaBox, FaCreditCard, FaUserEdit, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import logo from "/img/logo.png";

const Header = ({ isLoggedIn, user }) => { // Accept user info
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLoginClick = () => {
    navigate("/login"); // Navigate to login page
  };

  const handleLogoutClick = () => {
    navigate("/inicio"); // Redirect to the "Inicio" page
  };

  return (
    <>
      <div className="flex justify-end bg-[#D99D6C] px-5 py-1 text-xs font-montserrat">
        <a href="#" className="text-black hover:underline ml-4">Ayuda</a>
        <a href="#" className="text-black hover:underline ml-4">Pedidos y devoluciones</a>
        <a href="#" className="text-black hover:underline ml-4">Unete al club</a>
      </div>
      <header className="flex justify-between items-center bg-[#1A1A1A] text-white px-5 py-3 sticky top-0 z-50">
        <div className="logo" onClick={() => navigate("/inicio", { state: { user } })} style={{ cursor: "pointer" }}>
          <img src={logo} alt="Logo" className="h-[50px] w-[50px]" />
        </div>
        <nav>
          <ul className="flex list-none font-konkhmer-sleokchher">
            <li className="mx-4 hover:bg-[#373737] px-2 py-1 rounded cursor-pointer">
              <a onClick={() => navigate("/inicio", { state: { user } })} style={{ cursor: "pointer" }}>Inicio</a>
            </li>
            <li className="mx-4 hover:bg-[#373737] px-2 py-1 rounded cursor-pointer">
              <a onClick={() => navigate("/ofertas")} style={{ cursor: "pointer" }}>Ofertas</a>
            </li>
            <li className="mx-4 hover:bg-[#373737] px-2 py-1 rounded cursor-pointer">
              <a onClick={() => navigate("/mujer")} style={{ cursor: "pointer" }}>Mujer</a>
            </li>
            <li className="mx-4 hover:bg-[#373737] px-2 py-1 rounded cursor-pointer">
              <a onClick={() => navigate("/hombre", { state: { user } })} style={{ cursor: "pointer" }}>Hombre</a>
            </li>
          </ul>
        </nav>
        <div className="flex items-center gap-4 relative">
          <div className="flex items-center bg-[#313131] px-3 py-1 rounded-full">
            <input
              type="text"
              placeholder="Buscar"
              className="bg-transparent outline-none text-white placeholder-[#bcbcbc] text-sm font-montserrat w-[150px]"
            />
            <FaSearch className="text-white ml-2" />
          </div>
          <div
            className="relative flex items-center gap-2 bg-[#313131] text-white px-3 py-1 rounded-full border border-white cursor-pointer hover:bg-[#3a3a3a]"
            onClick={toggleMenu} // Toggle menu on click
          >
            <FaUser className="text-lg" />
            {isLoggedIn && user && ( // Display user's name if logged in
              <span className="text-sm font-montserrat">{user.nombreCompleto}</span>
            )}
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-[200px] bg-white text-black rounded shadow-lg font-montserrat">
                {isLoggedIn ? ( // Mostrar opciones según el estado de sesión
                  <>
                    <a
                      onClick={() => navigate("/favoritos", { state: { user } })} // Pass user info
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <FaHeart className="mr-2" /> Favoritos
                    </a>
                    <a
                      onClick={() => navigate("/mis-compras", { state: { user } })} // Pass user info
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <FaBox className="mr-2" /> Mis Compras
                    </a>
                    <a
                      onClick={() => navigate("/metodos-pago", { state: { user } })} // Pass user info
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <FaCreditCard className="mr-2" /> Métodos de Pago
                    </a>
                    <a
                      onClick={() => navigate("/mis-datos", { state: { user } })} // Pass user info
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <FaUserEdit className="mr-2" /> Mis Datos
                    </a>
                    <a
                      onClick={handleLogoutClick} // Add click handler for logout
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <FaSignInAlt className="mr-2" /> Cerrar Sesión
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      onClick={handleLoginClick} // Add click handler for login
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <FaSignInAlt className="mr-2" /> Iniciar Sesión
                    </a>
                    <a href="/registro" className="flex items-center px-4 py-2 hover:bg-gray-100">
                      <FaUserPlus className="mr-2" /> Registrarse
                    </a>
                  </>
                )}
              </div>
            )}
          </div>
          <FaShoppingCart className="text-lg cursor-pointer" />
        </div>
      </header>
    </>
  );
};

export default Header;
