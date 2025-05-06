import React from 'react';
import Header from './Componentes/Header';
import Footer from './Componentes/Footer';
import { useLocation } from 'react-router-dom';

const Carrito = () => {
    const location = useLocation();
    const user = location.state?.user;
    const [cartItems, setCartItems] = React.useState([
        {
            id: 1,
            nombre: 'Camiseta Blanca con Estampado de Flor',
            precio: 299.00,
            cantidad: 2,
            imagen: 'img/camiseta-blanca.jpg',
        },
        {
            id: 2,
            nombre: 'Pantalón Negro Slim Fit',
            precio: 599.00,
            cantidad: 1,
            imagen: 'img/pantalon-negro.jpg',
        }
    ]);

    const handleIncrement = (id) => {
        setCartItems(cartItems.map(item => 
            item.id === id ? {...item, cantidad: item.cantidad + 1} : item
        ));
    };

    const handleDecrement = (id) => {
        setCartItems(cartItems.map(item => 
            item.id === id && item.cantidad > 1 
                ? {...item, cantidad: item.cantidad - 1} 
                : item
        ));
    };

    const handleRemove = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const envio = 99.00;
    const total = subtotal + envio;

    return (
        <div className="bg-gray-200 min-h-screen flex flex-col">
            <Header isLoggedIn={!!user} user={user} />
            
            <main className="flex-grow container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold text-gray-900 font-konkhmer-sleokchher mb-6">Carrito de Compras</h2>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Lista de Productos */}
                    <div className="lg:w-2/3 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <img 
                                        src={item.imagen} 
                                        alt={item.nombre} 
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                    
                                    <div className="flex-1 w-full">
                                        <h3 className="text-lg font-[Montserrat] font-semibold text-center sm:text-left">{item.nombre}</h3>
                                        <p className="text-gray-600 font-[Montserrat] text-center sm:text-left">MXN {item.precio.toFixed(2)}</p>
                                        
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                                            <div className="flex items-center border rounded-lg">
                                                <button 
                                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                                                    onClick={() => handleDecrement(item.id)}
                                                >
                                                    -
                                                </button>
                                                <span className="px-4 min-w-[40px] text-center">{item.cantidad}</span>
                                                <button 
                                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                                                    onClick={() => handleIncrement(item.id)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button 
                                                className="text-red-500 hover:text-red-600  font-[Montserrat] flex items-center gap-2 hover:underline decoration-1"
                                                onClick={() => handleRemove(item.id)}
                                            >
                                                <svg 
                                                    xmlns="http://www.w3.org/2000/svg" 
                                                    className="h-5 w-5" 
                                                    viewBox="0 0 20 20" 
                                                    fill="currentColor"
                                                >
                                                    <path 
                                                        fillRule="evenodd" 
                                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                                                        clipRule="evenodd" 
                                                    />
                                                </svg>
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Resumen del Pedido */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-xl font-bold font-konkhmer-sleokchher mb-4">Resumen del Pedido</h3>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="font-[Montserrat]">Subtotal:</span>
                                    <span className="font-[Montserrat]">MXN {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-[Montserrat]">Envío:</span>
                                    <span className="font-[Montserrat]">MXN {envio.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between border-t pt-3">
                                    <span className="font-[Montserrat] font-bold">Total:</span>
                                    <span className="font-[Montserrat] font-bold">MXN {total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button className="w-full bg-[#D99D6C] text-white py-3 rounded-lg hover:bg-[#C68B5F] transition-colors font-konkhmer-sleokchher">
                                Proceder al Pago
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Carrito;