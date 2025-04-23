import React, { useEffect, useState } from 'react';
import Header from './Componentes/Header';
import Footer from './Componentes/Footer';
import { useLocation } from 'react-router-dom';

const ProductosHombre = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [colores, setColores] = useState([]); // Added state for colors
    const [minPrecio, setMinPrecio] = useState(0);
    const [maxPrecio, setMaxPrecio] = useState(1000);
    const [favoritos, setFavoritos] = useState({}); // State to track favorite products
    const [searchTerm, setSearchTerm] = useState(""); // State for search term
    const location = useLocation(); // Get state from navigation
    const user = location.state?.user; // Safely access user data

    const [selectedCategoria, setSelectedCategoria] = useState(""); // State for selected category
    const [selectedColor, setSelectedColor] = useState(""); // State for selected color
    const [selectedPrecio, setSelectedPrecio] = useState(maxPrecio); // State for selected price range

    useEffect(() => {
        fetch('http://localhost/Trendify/backend/getProducto.php') // Updated URL
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
                    setMaxPrecio(Math.max(...precios));

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

    return (
        <div className="bg-gray-200"> {/* Changed background to light gray */}
            <Header isLoggedIn={!!user} user={user} />
            <div className="relative">
                <img src="/img/header-producto.svg" alt="Header Producto" className="w-full" /> {/* Full-width image */}
                <main className="bg-white relative mt-[-100px] rounded-2xl w-4/5 mx-auto z-10"> {/* Further adjusted container position */}
                    <div className="px-5 py-4">
                        <div className="flex flex-row items-center justify-between">
                            <h1 className="text-2xl uppercase font-bold text-gray-900 font-konkhmer-sleokchher">Productos para hombre</h1>
                            <div className="w-2/5">
                                <input
                                    type="text"
                                    placeholder="Buscar productos"
                                    className="w-3/5 p-2 rounded-full border bg-gray-200 outline-none font-[Montserrat]"
                                    value={searchTerm} // Bind input to searchTerm state
                                    onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on input change
                                />
                                <button
                                    className="w-1/4 ml-4 rounded-full bg-gray-900 text-white h-10 font-[Montserrat] font-bold hover:bg-gray-700"
                                    onClick={() => {
                                        const filteredProductos = productos.filter(producto =>
                                            producto.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase())
                                        );
                                        setProductos(filteredProductos); // Update productos with filtered results
                                    }}
                                >
                                    Buscar
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-4">
                            <aside className="bg-gray-100 rounded-lg p-4 font-montserrat"> {/* Changed background to light gray */}
                                <h2 className="text-lg mb-4 font-konkhmer-sleokchher">Filtrar Productos</h2>
                                <label htmlFor="categoria" className="block font-bold mb-2">Categoría:</label>
                                <select
                                    id="categoria"
                                    className="w-full p-2 mb-4"
                                    value={selectedCategoria} // Bind to selectedCategoria state
                                    onChange={(e) => setSelectedCategoria(e.target.value)} // Update selectedCategoria on change
                                >
                                    <option value="">Todas</option>
                                    {categorias.map(categoria => (
                                        <option key={categoria} value={categoria}>{categoria}</option>
                                    ))}
                                </select>
                                <label htmlFor="color" className="block font-bold mb-2">Color:</label>
                                <select
                                    id="color"
                                    className="w-full p-2 mb-4"
                                    value={selectedColor} // Bind to selectedColor state
                                    onChange={(e) => setSelectedColor(e.target.value)} // Update selectedColor on change
                                >
                                    <option value="">Todos</option>
                                    {colores.map(color => (
                                        <option key={color} value={color}>{color}</option>
                                    ))}
                                </select>
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
                            <section className="col-span-3 grid grid-cols-3 gap-4">
                                {Array.from(new Map(productos.map(producto => [producto.idProducto, producto])).values()).map(producto => {
                                    const isFavorito = favoritos[producto.idProducto] || false; // Check if product is a favorite

                                    return (
                                        <a href="../verProducto/verProducto.html" key={producto.idProducto}>
                                            <div className="product-card hover:shadow-lg transform hover:scale-105 transition-all p-4 rounded-lg relative"> {/* Added relative for positioning */}
                                                <button
                                                    className={`absolute top-2 right-5 text-5xl ${isFavorito ? 'text-red-500' : 'text-gray-400'}`} // Adjusted right to 4
                                                    onClick={(e) => {
                                                        e.preventDefault(); // Prevent navigation on click
                                                        setFavoritos(prev => ({
                                                            ...prev,
                                                            [producto.idProducto]: !isFavorito, // Toggle favorite state
                                                        }));
                                                    }}
                                                >
                                                    ♥
                                                </button>
                                                <img src={producto.url_imagen} alt={producto.nombre_producto} className="w-full h-55 object-contain rounded-lg" /> {/* Added rounded corners */}
                                                <h2 className="text-sm font-[Montserrat] font-bold mt-2">{producto.nombre_producto}</h2> {/* Updated font to Montserrat */}
                                                <span className="text-gray-700 text-sm font-[Montserrat]">${producto.precio}</span> {/* Updated font to Montserrat */}
                                            </div>
                                        </a>
                                    );
                                })}
                            </section>
                        </div>
                    </div>
                </main>
            </div>
            <div className="h-10"></div> {/* Spacer div */}
            <Footer />
        </div>
    );
};

export default ProductosHombre;
