import React from 'react';
import Header from './Componentes/Header';
import Footer from './Componentes/Footer';
import { useLocation } from 'react-router-dom';

const Carrito = () => {
    const location = useLocation();
    const user = location.state?.user;
    const [cartItems, setCartItems] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    // Debug: imprimir usuario
    console.log('Usuario:', user);

    React.useEffect(() => {
        const fetchCartItems = async () => {
            if (!user?.id) {
                console.log('No hay usuario o idUsuario, no se cargará el carrito');
                setIsLoading(false);
                return;
            }

            try {
                console.log(`Fetching carrito para usuario ID: ${user.id}`);
                const response = await fetch(`http://localhost/Trendify/backend/getCarrito.php?idUsuario=${user.id}`);
                
                console.log('Respuesta del servidor:', response);
                
                if (!response.ok) {
                    throw new Error('Error al obtener el carrito');
                }
                const data = await response.json();
                
                console.log('Datos del carrito recibidos:', data);
                
                const mappedItems = data.map(item => ({
                    id: item.idProducto,
                    nombre: item.nombre,
                    precio: parseFloat(item.precio),
                    cantidad: item.cantidad,
                    imagen: item.url_imagen || 'img/default-product.jpg'
                }));
                
                console.log('Carrito mapeado:', mappedItems);
                setCartItems(mappedItems);
            } catch (err) {
                console.error('Error al obtener el carrito:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCartItems();
    }, [user?.id]);

    // Debug: imprimir carrito cuando cambia
    React.useEffect(() => {
        console.log('Carrito actualizado:', cartItems);
    }, [cartItems]);

    const handleIncrement = (id) => {
        console.log('Incrementando producto ID:', id);
        setCartItems(cartItems.map(item => 
            item.id === id ? {...item, cantidad: item.cantidad + 1} : item
        ));
    };

    const handleDecrement = (id) => {
        console.log('Decrementando producto ID:', id);
        setCartItems(cartItems.map(item => 
            item.id === id && item.cantidad > 1 
                ? {...item, cantidad: item.cantidad - 1} 
                : item
        ));
    };

    const handleRemove = (id) => {
        console.log('Eliminando producto ID:', id);
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const envio = 99.00;
    const total = subtotal + envio;

    if (isLoading) {
        console.log('Estado: Cargando...');
        return (
            <div className="bg-gray-200 min-h-screen flex flex-col">
                <Header isLoggedIn={!!user} user={user} />
                <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
                    <p className="text-lg">Cargando carrito...</p>
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        console.log('Estado: Error', error);
        return (
            <div className="bg-gray-200 min-h-screen flex flex-col">
                <Header isLoggedIn={!!user} user={user} />
                <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
                    <p className="text-lg text-red-500">Error: {error}</p>
                </main>
                <Footer />
            </div>
        );
    }

    console.log('Renderizando componente con carrito:', cartItems);
    return (
        <div className="bg-gray-200 min-h-screen flex flex-col">
            <Header isLoggedIn={!!user} user={user} />
            
            <main className="flex-grow container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold text-gray-900 font-konkhmer-sleokchher mb-6">Carrito de Compras</h2>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-lg p-8 text-center">
                        <p className="text-lg">Tu carrito está vacío</p>
                        <p className="text-sm text-gray-500 mt-2">Usuario ID: {user?.id || 'No logueado'}</p>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-6">
    {/* Listado de productos */}
    <div className="lg:w-2/3">
        {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg p-4 mb-4 shadow-md">
                <div className="flex items-center gap-4">
                    {/* Imagen del producto */}
                    <img 
                        src={item.imagen} 
                        alt={item.nombre} 
                        className="w-20 h-20 object-cover rounded"
                    />
                    
                    {/* Detalles del producto */}
                    <div className="flex-grow">
                        <h3 className="font-semibold">{item.nombre}</h3>
                        <p className="text-gray-600">${item.precio.toFixed(2)}</p>
                    </div>

                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => handleDecrement(item.id)}
                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            -
                        </button>
                        <span>{item.cantidad}</span>
                        <button 
                            onClick={() => handleIncrement(item.id)}
                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            +
                        </button>
                    </div>

                    {/* Eliminar y subtotal */}
                    <div className="flex flex-col items-end gap-2">
                        <button 
                            onClick={() => handleRemove(item.id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            Eliminar
                        </button>
                        <p className="font-semibold">
                            ${(item.precio * item.cantidad).toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
        ))}
    </div>

    {/* Resumen del pedido */}
    <div className="lg:w-1/3">
        <div className="bg-white rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Resumen del pedido</h3>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Envío:</span>
                    <span>${envio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>
            <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Proceder al pago
            </button>
        </div>
    </div>
</div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Carrito;