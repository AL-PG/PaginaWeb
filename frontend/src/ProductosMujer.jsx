import React, { useEffect, useState } from 'react';
import Header from './Componentes/Header';
import Footer from './Componentes/Footer';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import '@fortawesome/fontawesome-free/css/all.min.css'; // Añade esta línea al principio
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

const ProductosMujer = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [colores, setColores] = useState([]); // Added state for colors
    const [minPrecio, setMinPrecio] = useState(0);
    const [maxPrecio, setMaxPrecio] = useState(1000);
    const [favoritos, setFavoritos] = useState({}); // State to track favorite products
    const [searchTerm, setSearchTerm] = useState(""); // State for search term
    const location = useLocation(); // Get state from navigation
    const user = location.state?.user; // Safely access user data
    const navigate = useNavigate(); // Initialize navigate function
    const [favoritosMessage, setFavoritosMessage] = useState(""); // State for confirmation message

    const [selectedCategoria, setSelectedCategoria] = useState(""); // State for selected category
    const [selectedColor, setSelectedColor] = useState(""); // State for selected color
    const [selectedPrecio, setSelectedPrecio] = useState(maxPrecio); // State for selected price range

    const [ratings, setRatings] = useState({});

    console.log("User data:", user); // Debug: Log user data

    useEffect(() => {
        fetch('http://localhost/Trendify/backend/getProductoMujer.php') // Updated URL
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text(); // Read response as text
            })
            .then(text => {
                try {
                    const data = JSON.parse(text); // Attempt to parse JSON
                    console.log("Fetched products:", data); // Debug: Log fetched products
                    setProductos(data);

                    // Calculate min and max prices
                    const precios = data.map(producto => producto.precio);
                    setMinPrecio(Math.min(...precios));
                    const roundedMax = Math.ceil(Math.max(...precios));
                    setMaxPrecio(roundedMax); // max redondeado hacia arriba
                    setSelectedPrecio(roundedMax); // Asegura que el filtro por defecto muestre todo

                    // Extract unique categories from tipo_producto
                    const uniqueCategorias = [...new Set(data.map(producto => producto.tipo_producto))];
                    setCategorias(uniqueCategorias);

                    // Extract unique colors
                    const uniqueColores = [...new Set(data.map(producto => producto.color))];
                    setColores(uniqueColores);
                } catch (error) {
                    console.error('Error parsing JSON:', error, text); // Log response text for debugging
                }
            })
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    useEffect(() => {
        const fetchRatings = async () => {
            const ratingsData = {};
            for (const producto of productos) {
                try {
                    const response = await fetch(`http://localhost/Trendify/backend/getCalificacion.php?idProducto=${producto.idProducto}`);
                    const data = await response.json();
                    ratingsData[producto.idProducto] = {
                        promedio: data.promedio_calificacion || 0,
                        reseñas: data.numero_calificaciones || 0
                    };
                } catch (error) {
                    console.error(`Error fetching rating for product ${producto.idProducto}:`, error);
                    ratingsData[producto.idProducto] = { promedio: 0, reseñas: 0 };
                }
            }
            setRatings(ratingsData);
        };

        if (productos.length > 0) {
            fetchRatings();
        }
    }, [productos]);

    useEffect(() => {
        const loadFavoritos = async () => {
            if (user?.id) {
                try {
                    const response = await fetch(`http://localhost/Trendify/backend/getFavoritos.php?idUsuario=${user.id}`);
                    const data = await response.json();
                    const initialFavoritos = data.reduce((acc, curr) => {
                        acc[curr.idProducto] = true;
                        return acc;
                    }, {});
                    setFavoritos(initialFavoritos);
                } catch (error) {
                    console.error('Error cargando favoritos:', error);
                }
            }
        };
        loadFavoritos();
    }, [user]);

    useEffect(() => {
        if (favoritosMessage) {
            const timer = setTimeout(() => {
                setFavoritosMessage("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [favoritosMessage]);

    const applyFilters = () => {
        fetch('http://localhost/Trendify/backend/getProducto.php') // Fetch products again from backend
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text(); // Read response as text
            })
            .then(text => {
                try {
                    const data = JSON.parse(text); // Parse JSON response
                    console.log("Fetched products for filtering:", data); // Debug: Log fetched products

                    // Apply filters to the fetched data
                    const filteredProductos = data.filter(producto => {
                        const matchesCategoria = selectedCategoria ? producto.tipo_producto === selectedCategoria : true;
                        const matchesColor = selectedColor ? producto.color === selectedColor : true;
                        const matchesPrecio = producto.precio <= selectedPrecio;
                        return matchesCategoria && matchesColor && matchesPrecio;
                    });

                    setProductos(filteredProductos); // Update productos with filtered results
                } catch (error) {
                    console.error('Error parsing JSON during filtering:', error, text); // Log response text for debugging
                }
            })
            .catch(error => console.error('Error fetching products for filtering:', error));
    };

    const handleToggleFavoritos = async (e, producto) => {
        e.stopPropagation();

        if (!user?.id) {
            setFavoritosMessage("Debes iniciar sesión para gestionar favoritos.");
            return;
        }

        const isFavorito = favoritos[producto.idProducto];
        const endpoint = isFavorito ? 'deleteFavoritos.php' : 'addFavoritos.php';

        try {
            const response = await fetch(`http://localhost/Trendify/backend/${endpoint}`, {
                method: isFavorito ? 'DELETE' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idUsuario: user.id, idProducto: producto.idProducto }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Error en la operación");

            setFavoritos(prev => ({
                ...prev,
                [producto.idProducto]: !isFavorito
            }));

            setFavoritosMessage(isFavorito
                ? "Producto eliminado de favoritos"
                : "Producto agregado a favoritos");

        } catch (error) {
            setFavoritosMessage(error.message || "Error al procesar la solicitud");
        }
    };

    return (
        <div className="bg-gray-200"> {/* Changed background to light gray */}
            <Header isLoggedIn={!!user} user={user} />
            <div className="relative">
                <img src="./img/portadaMujer.png" alt="Header Producto" className="w-full" /> {/* Full-width image */}
                <main className="bg-white relative mt-[-100px] rounded-2xl w-4/5 mx-auto z-10"> {/* Further adjusted container position */}
                    <div className="px-5 py-4">
                        <div className="px-5 py-4">
                            {/* Título y selector de ordenación */}
                            <div className="flex flex-row items-center justify-between">
                                <h1 className="text-2xl uppercase font-bold text-gray-900 font-konkhmer-sleokchher">Productos para mujer</h1>

                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-montserrat">Ordenar por:</span>
                                   <select 
  className="text-sm font-montserrat border-0 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D99D6C]"
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            let sortedProducts = [...productos];

                                            switch (value) {
                                                case 'precio-asc':
                                                    sortedProducts.sort((a, b) => a.precio - b.precio);
                                                    break;
                                                case 'precio-desc':
                                                    sortedProducts.sort((a, b) => b.precio - a.precio);
                                                    break;
                                                case 'calificacion':
                                                    sortedProducts.sort((a, b) => (ratings[b.idProducto]?.promedio || 0) - (ratings[a.idProducto]?.promedio || 0));
                                                    break;
                                                default: // 'novedad'
                                                    // Mantener el orden original (por defecto)
                                                    break;
                                            }

                                            setProductos(sortedProducts);
                                        }}
                                    >
                                        <option value="novedad">Novedad</option>
                                        <option value="precio-asc">Precio: menor a mayor</option>
                                        <option value="precio-desc">Precio: mayor a menor</option>
                                        <option value="calificacion">Mejor calificados</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-4">
                            <aside className="bg-gray-100 rounded-lg p-4 font-montserrat">
                                <h2 className="text-lg mb-4 font-konkhmer-sleokchher">Filtrar Productos</h2>
                                <div className="mb-4">
                                    <label className="block font-bold mb-2">Categorías:</label>
                                    <div className="flex flex-col gap-2">
                                        {/* Botón "Todas" */}
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`flex justify-between items-center w-full px-4 py-3 rounded-full text-sm font-montserrat transition-all ${selectedCategoria === ""
                                                ? 'bg-gray-300 border-2 border-black'
                                                : 'bg-gray-200 hover:bg-gray-300'
                                                }`}
                                            onClick={() => setSelectedCategoria("")}
                                        >
                                            <span>Todas</span>
                                            <span className="bg-gray-400 text-white text-xs rounded-full px-2 py-1">
                                                {productos.length}
                                            </span>
                                        </motion.button>

                                        {/* Botones por categoría */}
                                        {categorias.map(categoria => {
                                            const count = productos.filter(p => p.tipo_producto === categoria).length;
                                            return (
                                                <motion.button
                                                    key={categoria}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className={`flex justify-between items-center w-full px-4 py-3 rounded-full text-sm font-montserrat transition-all ${selectedCategoria === categoria
                                                        ? 'bg-gray-300 border-2 border-black'
                                                        : 'bg-gray-200 hover:bg-gray-300'
                                                        }`}
                                                    onClick={() => setSelectedCategoria(categoria)}
                                                >
                                                    <span>{categoria}</span>
                                                    <span className="bg-gray-400 text-white text-xs rounded-full px-2 py-1">
                                                        {count}
                                                    </span>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block font-bold mb-3 text-sm font-montserrat">COLORES</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Opción "Todos" */}
                                        <div
                                            className="flex flex-col items-center cursor-pointer"
                                            onClick={() => setSelectedColor("")}
                                        >
                                            <div className={`w-12 h-12 rounded-full mb-2 flex items-center justify-center border-2 ${selectedColor === "" ? 'border-black' : 'border-gray-300'}`}>
                                                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                            </div>
                                            <span className="text-xs font-montserrat">Todos</span>
                                            <span className="text-xs font-montserrat text-gray-500">({productos.length})</span>
                                        </div>

                                        {/* Opciones de color */}
                                        {colores.map(color => {
                                            const count = productos.filter(p => p.color === color).length;
                                            const colorMap = {
                                                'rojo': 'bg-red-500',
                                                'azul': 'bg-blue-500',
                                                'verde': 'bg-green-500',
                                                'negro': 'bg-black',
                                                'blanco': 'bg-white border border-gray-300',
                                                'amarillo': 'bg-yellow-400',
                                                'gris': 'bg-gray-400',
                                                'rosa': 'bg-pink-400',
                                                'morado': 'bg-purple-500',
                                                'naranja': 'bg-orange-400',
                                                // Agrega más según necesites
                                            };

                                            const bgColor = colorMap[color.toLowerCase()] || 'bg-gray-200';

                                            return (
                                                <div
                                                    key={color}
                                                    className="flex flex-col items-center cursor-pointer"
                                                    onClick={() => setSelectedColor(color)}
                                                >
                                                    <div className={`w-12 h-12 rounded-full mb-2 flex items-center justify-center border-2 ${selectedColor === color ? 'border-black' : 'border-gray-300'}`}>
                                                        <div className={`w-10 h-10 rounded-full ${bgColor} ${color.toLowerCase() === 'blanco' ? 'border border-gray-300' : ''}`}></div>
                                                    </div>
                                                    <span className="text-xs font-montserrat capitalize">{color.toLowerCase()}</span>
                                                    <span className="text-xs font-montserrat text-gray-500">({count})</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <label htmlFor="precio" className="block font-bold mb-2">Rango de Precio:</label>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-bold">${minPrecio}</span> {/* Minimum price label */}
                                    <input
                                        type="range"
                                        id="precio"
                                        className="w-4/5 mx-2"
                                        min={minPrecio} // Dynamically set minimum price
                                        max={maxPrecio} // Dynamically set maximum price
                                        step="10"
                                        value={selectedPrecio} // Bind to selectedPrecio state
                                        onChange={(e) => setSelectedPrecio(Number(e.target.value))} // Update selectedPrecio on change
                                    />
                                    <span className="text-sm font-bold">${selectedPrecio}</span> {/* Selected price label */}
                                </div>
                                <label htmlFor="talla" className="block font-bold mb-2">Talla:</label>
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    {['S', 'M', 'L', 'XL', 'XXL'].map(talla => (
                                        <div key={talla} className="flex items-center gap-2">
                                            <input type="checkbox" id={talla} name="talla" value={talla} />
                                            <label htmlFor={talla}>{talla}</label> {/* Label separated from checkbox */}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    className="w-full bg-[#D99D6C] text-white p-2 rounded-lg hover:bg-[#C68B5F] font-konkhmer-sleokchher"
                                    onClick={applyFilters} // Fetch and apply filters on button click
                                >
                                    Aplicar filtros
                                </button>
                            </aside>
                            <section
                                className="col-span-3"
                            >
                                <div className="grid grid-cols-3 gap-4">
                                    {Array.from(new Map(productos.map(producto => [producto.idProducto, producto])).values()).map(producto => {
                                        const isFavorito = favoritos[producto.idProducto] || false;

                                        return (
                                            <div
                                                key={producto.idProducto}
                                                onClick={() => navigate('/producto', { state: { producto, user, isLoggedIn: !!user } })}
                                                className="product-card hover:shadow-lg transform hover:scale-105 transition-all p-4 rounded-lg relative cursor-pointer group h-auto"
                                            >
                                                {/* Botón de favoritos con FontAwesomeIcon */}
                                                <button
                                                    className={`absolute top-3 right-3 p-2 rounded-full transition-all ${isFavorito ? 'bg-red-500 text-white' : 'bg-black/30 text-white group-hover:bg-black/50'
                                                        }`}
                                                    onClick={(e) => handleToggleFavoritos(e, producto)}
                                                    aria-label={isFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={isFavorito ? fasHeart : farHeart}
                                                        className={isFavorito ? "text-white" : ""}
                                                    />
                                                </button>
                                                <img src={producto.url_imagen} alt={producto.nombre_producto} className="w-full h-55 object-contain rounded-lg" />

                                                {/* Sección de calificación */}
                                                <div className="flex items-center gap-1 mt-2">
                                                    <div className="flex">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <i
                                                                key={star}
                                                                className={`fas fa-star text-sm ${star <= Math.round(ratings[producto.idProducto]?.promedio || 0)
                                                                    ? 'text-yellow-400'
                                                                    : 'text-gray-300'
                                                                    }`}
                                                            ></i>
                                                        ))}
                                                    </div>
                                                    <span className="text-gray-600 text-xs font-[Montserrat]">
                                                        ({ratings[producto.idProducto]?.reseñas || 0})
                                                    </span>
                                                </div>

                                                <h2 className="text-sm font-[Montserrat] font-bold mt-2">{producto.nombre_producto}</h2>
                                                <span className="text-gray-700 text-sm font-[Montserrat]">${producto.precio}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                            {favoritosMessage && (
                                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 text-green-800 px-6 py-3 rounded-lg font-[Montserrat] animate-fade-in">
                                    {favoritosMessage}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
            <div className="h-10"></div> {/* Spacer div */}
            <Footer />
        </div>
    );
};

export default ProductosMujer;