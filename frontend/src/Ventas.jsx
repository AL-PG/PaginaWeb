import React, { useEffect, useState } from 'react';
import Header from './Componentes/Header';
import Footer from './Componentes/Footer';
import { useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const formatFecha = (fechaStr) => {
    const meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    const fecha = new Date(fechaStr);
    return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
};

const Ventas = () => {
    const location = useLocation();
    const user = location.state?.user;
    const [ventas, setVentas] = useState([]);
    const [calificarProducto, setCalificarProducto] = useState(null); // {idProducto, idVenta}
    const [calificacion, setCalificacion] = useState(0);
    const [mensaje, setMensaje] = useState("");
    const [productosCalificados, setProductosCalificados] = useState({}); // <--- Añade este estado

    useEffect(() => {
        if (!user?.id) return;
        fetch(`http://localhost/Trendify/backend/getVentasUsuario.php?idUsuario=${user.id}`)
            .then(res => res.json())
            .then(data => setVentas(data))
            .catch(() => setVentas([]));
    }, [user]);

    // Consulta y guarda el estado de calificación de cada producto
    useEffect(() => {
        if (!user?.id || ventas.length === 0) return;
        const productos = Array.from(new Set(ventas.map(v => v.idProducto)));
        Promise.all(
            productos.map(idProducto =>
                fetch(`http://localhost/Trendify/backend/checkCalificacion.php?idUsuario=${user.id}&idProducto=${idProducto}`)
                    .then(res => res.json())
                    .then(data => {
                        // Imprime el resultado del endpoint para debug
                        console.log(`checkCalificacion usuario:${user.id} producto:${idProducto}`, data);
                        return { idProducto, calificado: !!data.calificado };
                    })
                    .catch(() => ({ idProducto, calificado: false }))
            )
        ).then(results => {
            const calificados = {};
            results.forEach(({ idProducto, calificado }) => {
                calificados[idProducto] = calificado;
            });
            setProductosCalificados(calificados);
        });
    }, [user, ventas]);



    // Agrupar ventas por idVenta
    const ventasAgrupadas = ventas.reduce((acc, venta) => {
        if (!acc[venta.idVenta]) {
            acc[venta.idVenta] = {
                fecha: venta.fecha,
                total: venta.total,
                productos: []
            };
        }
        acc[venta.idVenta].productos.push(venta);
        return acc;
    }, {});

    const handleOpenCalificar = (producto) => {
        setCalificarProducto(producto);
        setCalificacion(0);
    };

    const handleCloseCalificar = () => {
        setCalificarProducto(null);
        setCalificacion(0);
    };

    const handleEnviarCalificacion = async () => {
        if (!calificarProducto || !user?.id) return;
        try {
            const res = await fetch('http://localhost/Trendify/backend/addCalificacion.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idUsuario: user.id,
                    idProducto: calificarProducto.idProducto,
                    calificacion
                })
            });
            const data = await res.json();
            if (res.ok) {
                setMensaje("¡Gracias por tu calificación!");
                setTimeout(() => setMensaje(""), 2500);
            } else {
                setMensaje(data.error || "Error al calificar");
                setTimeout(() => setMensaje(""), 2500);
            }
        } catch {
            setMensaje("Error al calificar");
            setTimeout(() => setMensaje(""), 2500);
        }
        handleCloseCalificar();
    };

    return (
        <div className="bg-gray-200 min-h-screen">
            <Header isLoggedIn={!!user} user={user} />
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-2xl uppercase font-bold text-gray-900 font-konkhmer-sleokchher mb-6">Mis Compras</h1>
                {Object.keys(ventasAgrupadas).length === 0 ? (
                    <div className="bg-white rounded-lg p-8 text-center">
                        <p className="text-lg">No tienes compras registradas.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                        {Object.entries(ventasAgrupadas).map(([idVenta, venta]) => (
                            <div key={idVenta} className="bg-white rounded-2xl shadow p-6">
                                <div className="mb-4">
                                    <span className="text-lg font-bold font-montserrat">
                                        {formatFecha(venta.fecha)}
                                    </span>
                                    <span className="float-right text-gray-700 font-montserrat font-semibold">
                                        Total: ${venta.total}
                                    </span>
                                </div>
                                <div>
                                    {venta.productos.map((producto, idx) => (
                                        <div key={producto.idProducto + '-' + idx} className="flex items-center py-4 border-b border-gray-200 last:border-b-0">
                                            <img
                                                src={producto.url_imagen}
                                                alt={producto.nombre}
                                                className="w-24 h-24 object-contain rounded-lg mr-6"
                                            />
                                            <div className="flex-1">
                                                <h2 className="font-bold text-md font-montserrat">{producto.nombre}</h2>
                                                <div className="text-gray-600 text-sm font-montserrat">
                                                    <span>Cantidad: {producto.cantidad}</span> &nbsp;|&nbsp;
                                                    <span>Precio: ${producto.precio_unitario}</span>
                                                </div>
                                                <div className="text-gray-600 text-sm font-montserrat">
                                                    Género: {producto.genero}
                                                </div>
                                            </div>
                                            <button
                                                className={`bg-[#D99D6C] text-white px-4 py-2 rounded-lg hover:bg-[#C68B5F] font-konkhmer-sleokchher ${productosCalificados[producto.idProducto] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                onClick={() => handleOpenCalificar(producto)}
                                                disabled={!!productosCalificados[producto.idProducto]}
                                            >
                                                {productosCalificados[producto.idProducto] ? 'Calificado' : 'Calificar'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Modal de calificación */}
            {calificarProducto && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xs relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-black"
                            onClick={handleCloseCalificar}
                        >
                            <i className="fas fa-times"></i>
                        </button>
                        <h2 className="text-lg font-bold mb-4 font-montserrat">Califica el producto</h2>
                        <div className="flex justify-center mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <i
                                    key={star}
                                    className={`fa-star text-2xl cursor-pointer transition-colors ${
                                        calificacion >= star ? 'fas text-yellow-400' : 'far text-gray-400'
                                    }`}
                                    onClick={() => setCalificacion(star)}
                                ></i>
                            ))}
                        </div>
                        <button
                            className="w-full bg-[#D99D6C] text-white p-2 rounded-lg hover:bg-[#C68B5F] font-konkhmer-sleokchher"
                            onClick={handleEnviarCalificacion}
                            disabled={calificacion === 0}
                        >
                            Enviar calificación
                        </button>
                    </div>
                </div>
            )}
            {/* Mensaje de éxito */}
            {mensaje && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 text-green-800 px-6 py-3 rounded-lg font-[Montserrat] animate-fade-in">
                    {mensaje}
                </div>
            )}
            <Footer />
        </div>
    );
};

export default Ventas;
