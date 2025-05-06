import React, { useEffect, useState } from 'react';
import Header from './Componentes/Header';
import Footer from './Componentes/Footer';
import { useLocation, useNavigate } from 'react-router-dom';

const Favoritos = () => {
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const location = useLocation();
    const user = location.state?.user;
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchFavoritos = async () => {
            if (!user?.id) {
                setError('Debes iniciar sesión para ver tus favoritos');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost/Trendify/backend/getFavoritos.php?idUsuario=${user.id}`);
                if (!response.ok) throw new Error('Error al cargar favoritos');
                const data = await response.json();
                setFavoritos(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoritos();
    }, [user]);

    const handleDeleteFavorito = async (idProducto) => {
        try {
            const response = await fetch('http://localhost/Trendify/backend/deleteFavoritos.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idUsuario: user.id,
                    idProducto: idProducto
                })
            });

            const data = await response.json();
            
            if (!response.ok) throw new Error(data.error || "Error al eliminar");
            
            setFavoritos(prev => prev.filter(p => p.idProducto !== idProducto));
            setMessage('Producto eliminado de favoritos');
            setTimeout(() => setMessage(''), 3000);
            
        } catch (err) {
            setMessage(err.message);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <div className="bg-gray-200 min-h-screen flex flex-col">
            <Header isLoggedIn={!!user} user={user} />
            
            {/* Notificación */}
            {message && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 text-green-800 px-6 py-3 rounded-lg font-[Montserrat] animate-fade-in">
                    {message}
                </div>
            )}

            <main className="flex-1">
                <div className="bg-white rounded-2xl w-11/12 md:w-4/5 mx-auto mt-4 mb-8 p-4 md:p-6">
                    <h1 className="text-xl md:text-2xl uppercase font-bold text-gray-900 font-konkhmer-sleokchher mb-4 md:mb-6">
                        Tus Productos Favoritos
                    </h1>

                    {loading ? (
                        <p className="text-center text-gray-600">Cargando favoritos...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : favoritos.length === 0 ? (
                        <p className="text-center text-gray-600">No tienes productos favoritos</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {favoritos.map((producto) => (
                                <div
                                    key={producto.idProducto}
                                    className="bg-white p-3 rounded-lg relative hover:shadow-lg transition-shadow h-full flex flex-col"
                                >
                                    <div className="relative flex-1">
                                        <img
                                            src={producto.url_imagen}
                                            alt={producto.nombre}
                                            className="w-full h-[300px] md:h-[400px] object-cover rounded-lg mb-3"
                                        />
                                        <button 
                                            className="absolute top-2 right-2 text-5xl text-red-500 hover:text-red-600 transition-colors"
                                            onClick={() => handleDeleteFavorito(producto.idProducto)}
                                            style={{ lineHeight: '1' }}
                                        >
                                            ♥
                                        </button>
                                    </div>

                                    <div className="px-2 mt-auto">
                                        <h2 className="text-sm md:text-base font-[Montserrat] font-bold mb-1">
                                            {producto.nombre}
                                        </h2>
                                        <p className="text-gray-700 text-sm md:text-base font-[Montserrat] mb-3">
                                            ${producto.precio}
                                        </p>
                                        <div className="flex flex-col gap-2">
                                            <button 
                                                className="bg-[#D99D6C] text-white py-2 rounded-lg hover:bg-[#C68B5F] transition-colors font-konkhmer-sleokchher text-sm md:text-base"
                                                onClick={() => navigate('/producto', { state: { producto, user } })}
                                            >
                                                Ver Producto
                                            </button>
                                            <button
                                                className="border border-gray-400 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition-colors font-konkhmer-sleokchher text-sm md:text-base"
                                                disabled
                                            >
                                                Agregar al Carrito
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Favoritos;