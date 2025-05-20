import React, { useEffect, useState } from 'react';
import Header from './Componentes/Header';
import Footer from './Componentes/Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';

const Colecciones = () => {
    const [colecciones, setColecciones] = useState([]);
    const [productosPorColeccion, setProductosPorColeccion] = useState({});
    const location = useLocation();
    const user = location.state?.user;
    const navigate = useNavigate();

    // Favoritos
    const [favoritos, setFavoritos] = useState({});
    const [favoritosMessage, setFavoritosMessage] = useState("");

    useEffect(() => {
        fetch('http://localhost/Trendify/backend/getColecciones.php')
            .then(res => res.json())
            .then(data => setColecciones(data))
            .catch(() => setColecciones([]));
    }, []);

    useEffect(() => {
        // Por cada colección, obtener productos asociados
        const fetchProductos = async () => {
            let productosObj = {};
            for (const col of colecciones) {
                const res = await fetch(`http://localhost/Trendify/backend/getProductosPorColeccion.php?idColeccion=${col.idColeccion}`);
                const productos = await res.json();
                productosObj[col.idColeccion] = productos;
            }
            setProductosPorColeccion(productosObj);
        };
        if (colecciones.length > 0) fetchProductos();
    }, [colecciones]);

    // Cargar favoritos del usuario
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
        <div className="bg-gray-200 min-h-screen">
            <Header isLoggedIn={!!user} user={user} />
            <div className="container mx-auto py-8 px-8">
                <h1 className="text-2xl uppercase font-bold text-gray-900 font-konkhmer-sleokchher mb-6">Colecciones</h1>
                {colecciones.length === 0 ? (
                    <div className="bg-white rounded-lg p-8 text-center">
                        <p className="text-lg">No hay colecciones disponibles.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-12">
                        {colecciones.map(coleccion => (
                            <div key={coleccion.idColeccion} className="bg-white rounded-2xl  p-0 overflow-hidden">
                                {/* Banner con mayor altura, recorte desde arriba y label de género */}
                                <div className="relative">
                                    {coleccion.banner && (
                                        <img
                                            src={coleccion.banner}
                                            alt={coleccion.nombre}
                                            className="w-full"
                                            style={{ height: "600px", objectFit: "cover", objectPosition: "top" }}
                                        />
                                    )}
                                    <span
                                        className="absolute top-6 left-6 px-5 py-2 rounded-full font-montserrat font-bold text-sm border border-white"
                                        style={{
                                            zIndex: 2,
                                            background: "rgba(0,0,0,0.5)",
                                            color: "#fff"
                                        }}
                                    >
                                        {coleccion.sexo}
                                    </span>
                                </div>
                                <div className="p-6">
                                    <h2 className="text-xl font-bold font-montserrat mb-2 text-center">{coleccion.nombre}</h2>
                                    <p className="text-gray-600 mb-4 font-montserrat text-center">{coleccion.descripcion}</p>
                                    <div className="flex flex-wrap justify-center gap-8">
                                        {(productosPorColeccion[coleccion.idColeccion] || []).map(producto => {
                                            const isFavorito = favoritos[producto.idProducto] || false;
                                            return (
                                                <div
                                                    key={producto.idProducto}
                                                    className="bg-white rounded-lg flex flex-col items-center hover:shadow-md transition cursor-pointer relative"
                                                    style={{
                                                        width: "220px",
                                                        height: "330px",
                                                        padding: "1.25rem",
                                                        transition: "transform 0.2s"
                                                    }}
                                                    onClick={() => navigate('/producto', { state: { producto, user, isLoggedIn: !!user } })}
                                                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.07)"}
                                                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                                                >
                                                    {/* Botón de favoritos */}
                                                    <button
                                                        className={`absolute top-3 right-3 p-2 rounded-full transition-all ${isFavorito ? 'bg-red-500 text-white' : 'bg-black/30 text-white hover:bg-black/50'
                                                            }`}
                                                        onClick={ev => handleToggleFavoritos(ev, producto)}
                                                        aria-label={isFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={isFavorito ? fasHeart : farHeart}
                                                            className={isFavorito ? "text-white" : ""}
                                                        />
                                                    </button>
                                                    <img
                                                        src={producto.url_imagen}
                                                        alt={producto.nombre_producto}
                                                        className="rounded mb-2"
                                                        style={{
                                                            width: "100%",
                                                            height: "220px",
                                                            objectFit: "cover",
                                                            aspectRatio: "2/3"
                                                        }}
                                                    />
                                                    <h3 className="font-bold text-md font-montserrat text-center mt-2">{producto.nombre_producto}</h3>
                                                    <span className="text-gray-700 font-montserrat text-center">MXN ${producto.precio}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {favoritosMessage && (
                                        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 text-green-800 px-6 py-3 rounded-lg font-[Montserrat] animate-fade-in">
                                            {favoritosMessage}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Colecciones;
