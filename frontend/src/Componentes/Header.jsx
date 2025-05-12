import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaUser, FaHeart, FaBox, FaCreditCard, FaUserEdit, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../public/img/logo.png";

const Header = ({ isLoggedIn, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      fetch(`http://localhost/Trendify/backend/getCarrito.php?idUsuario=${user.id}`)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            setCartCount(data.length);
          }
        })
        .catch(error => console.error('Error fetching cart count:', error));
    } else {
      setCartCount(0);
    }
  }, [isLoggedIn, user]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery("");
      setSearchResults([]);
      setActiveFilter(null);
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogoutClick = () => {
    navigate("/inicio", { state: { isLoggedIn: false, user: null } });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSearchResults();
  };

  const fetchSearchResults = () => {
    setIsLoading(true);
    fetch("http://localhost/Trendify/backend/GetAllProducto.php")
      .then(response => response.json())
      .then(data => {
        let filteredProducts = data;
        
        // Filtrar por búsqueda
        if (searchQuery) {
          filteredProducts = filteredProducts.filter(producto => 
            producto.nombre_producto.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        // Filtrar por género si hay un filtro activo
        if (activeFilter) {
          filteredProducts = filteredProducts.filter(producto => 
            producto.genero === activeFilter || producto.genero === 'Unisex'
          );
        }
        
        setSearchResults(filteredProducts);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      });
  };

  const handleFilterClick = (filter) => {
    const newFilter = filter === activeFilter ? null : filter;
    setActiveFilter(newFilter);
    // Actualizamos los resultados inmediatamente cuando se cambia el filtro
    fetchSearchResults();
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
          {!isSearchOpen && (
            <motion.div 
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center bg-[#313131] px-3 py-1 rounded-full"
              onClick={toggleSearch}
            >
              <input
                type="text"
                placeholder="Buscar"
                className="bg-transparent outline-none text-white placeholder-[#bcbcbc] text-sm font-montserrat w-[150px] cursor-pointer"
                readOnly
              />
              <FaSearch className="text-white ml-2" />
            </motion.div>
          )}
          
          <div
            className="relative flex items-center gap-2 bg-[#313131] text-white px-3 py-1 rounded-full border border-white cursor-pointer hover:bg-[#3a3a3a]"
            onClick={toggleMenu}
          >
            <FaUser className="text-lg" />
            {isLoggedIn && user && (
              <span className="text-sm font-montserrat">{user.nombreCompleto}</span>
            )}
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-[200px] bg-white text-black rounded shadow-lg font-montserrat">
                {isLoggedIn ? (
                  <>
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/favoritos", { state: { user } });
                      }}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <FaHeart className="mr-2" /> Favoritos
                    </a>
                    <a
                      onClick={() => navigate("/mis-compras", { state: { user } })}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <FaBox className="mr-2" /> Mis Compras
                    </a>
                    <a
                      onClick={() => navigate("/metodos-pago", { state: { user } })}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <FaCreditCard className="mr-2" /> Métodos de Pago
                    </a>
                    <a
                      onClick={() => navigate("/mis-datos", { state: { user } })}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <FaUserEdit className="mr-2" /> Mis Datos
                    </a>
                    <a
                      onClick={handleLogoutClick}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <FaSignInAlt className="mr-2" /> Cerrar Sesión
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      onClick={handleLoginClick}
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
          
          <div className="relative">
            <FaShoppingCart
              className="text-lg cursor-pointer hover:text-gray-300 transition-colors"
              onClick={() => navigate('/carrito', { state: { user } })}
            />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-montserrat rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Panel de búsqueda expandido */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-white w-full overflow-hidden shadow-md"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="px-5 py-4"
              >
                <form onSubmit={handleSearchSubmit} className="flex flex-col items-center">
                  <div className="relative w-full max-w-3xl mb-4">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="¿Qué estás buscando?"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        // Realizar búsqueda mientras se escribe
                        if (e.target.value.length > 2 || e.target.value.length === 0) {
                          fetchSearchResults();
                        }
                      }}
                      className="w-full pl-10 pr-4 py-2 border-b-2 border-black outline-none text-gray-700 placeholder-gray-300 font-konkhmer-sleokchher text-lg"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={toggleSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Filtros de género */}
                  <div className="flex gap-8 font-konkhmer-sleokchher text-lg mb-4">
                    <button
                      type="button"
                      onClick={() => handleFilterClick('hombre')}
                      className={`pb-1 relative font-montserrat font-bold ${activeFilter === 'hombre' ? 'text-[#D99D6C] ' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      Hombre
                      {activeFilter === 'hombre' && (
                        <motion.div
                          layoutId="underline"
                          className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D99D6C] "
                          initial={false}
                          animate={{ width: "100%" }}
                        />
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleFilterClick('mujer')}
                      className={`pb-1 relative font-montserrat font-bold  ${activeFilter === 'mujer' ? 'text-[#D99D6C] ' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      Mujer
                      {activeFilter === 'mujer' && (
                        <motion.div
                          layoutId="underline"
                          className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D99D6C] "
                          initial={false}
                          animate={{ width: "100%" }}
                        />
                      )}
                    </button>
                  </div>
                </form>

                {/* Resultados de búsqueda */}
                <div className="max-w-4xl mx-auto">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Buscando productos...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-4">
                      {searchResults.map((producto) => (
                        <div 
                          key={producto.idProducto} 
                          className="flex items-center p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                          onClick={() => navigate('/producto', { state: { producto, user, isLoggedIn: !!user } })}
                        >
                          <div className="w-16 h-16 flex-shrink-0">
                            <img 
                              src={producto.url_imagen || '/img/placeholder-product.jpg'} 
                              alt={producto.nombre_producto}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-grow">
                            <h3 className="font-konkhmer-sleokchher text-lg text-gray-800">
                              {producto.nombre_producto}
                            </h3>
                            <p className="font-montserrat text-sm text-gray-600">
                              {producto.tipo_producto} • {producto.color}
                            </p>
                            <p className="font-montserrat text-sm text-gray-600">
                              Género: {producto.genero}
                            </p>
                          </div>
                          <div className="ml-4">
                            <p className="font-montserrat font-bold text-gray-900">
                              ${producto.precio}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchQuery || activeFilter ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No se encontraron productos que coincidan con tu búsqueda.</p>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;