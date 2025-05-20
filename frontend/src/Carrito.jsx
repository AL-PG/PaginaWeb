import React from 'react';
import Header from './Componentes/Header';
import Footer from './Componentes/Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Carrito = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Nueva constante para navegación
    const user = location.state?.user;
    const [cartItems, setCartItems] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [successMessage, setSuccessMessage] = React.useState(""); // Nuevo estado para mensaje de éxito
    const [addresses, setAddresses] = React.useState([]);
    const [selectedAddress, setSelectedAddress] = React.useState(null);

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
                    imagen: item.url_imagen || 'img/default-product.jpg',
                    talla: item.id_talla 
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
            item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
        ));
    };

    const handleDecrement = (id) => {
        console.log('Decrementando producto ID:', id);
        setCartItems(cartItems.map(item =>
            item.id === id && item.cantidad > 1
                ? { ...item, cantidad: item.cantidad - 1 }
                : item
        ));
    };

    const handleRemove = async (id) => {
        if (!user?.id) return;
        try {
            const response = await fetch('http://localhost/Trendify/backend/deleteCarrito.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idUsuario: user.id,
                    idProducto: id
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                console.error('Error al eliminar del carrito:', data.error);
                return;
            }
            setCartItems(cartItems.filter(item => item.id !== id));
        } catch (err) {
            console.error('Error al eliminar del carrito:', err);
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const envio = 99.00;
    const total = subtotal + envio;

    React.useEffect(() => {
        // Obtener direcciones del usuario
        if (user?.id) {
            fetch(`http://localhost/Trendify/backend/getAddresses.php?id_usuario=${user.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setAddresses(data.addresses);
                        if (data.addresses.length > 0) setSelectedAddress(data.addresses[0]);
                    }
                });
        }
    }, [user?.id]);

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

            {/* Mensaje de compra exitosa */}
            {successMessage && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 text-green-800 px-6 py-3 rounded-lg font-[Montserrat] animate-fade-in">
                    {successMessage}
                </div>
            )}

            <main className="flex-grow container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold text-gray-900 font-konkhmer-sleokchher mb-6">Carrito de Compras</h2>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-lg p-8 text-center">
                        <p className="text-lg">Tu carrito está vacío</p>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Listado de productos */}
                        <div className="lg:w-2/3" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-white rounded-lg p-4 mb-4">
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
                                            <p className="text-gray-500 text-sm">
                                              Talla: {
                                                {1: 'XS', 2: 'S', 3: 'M', 4: 'L', 5: 'XL'}[item.talla] || 'N/A'
                                              }
                                            </p>
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
                                                className="text-red-500 hover:text-red-700 flex items-center gap-1"
                                            >
                                                <span>✖</span>
                                                <span className="hover:underline">Eliminar</span>
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
                        <div className="lg:w-1/3" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            <div className="bg-white rounded-lg p-4">
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
                                {/* Reemplazar botón antiguo por PayPalScriptProvider + PayPalButtons */}
                                <div className="w-full mt-4">
                                    <PayPalScriptProvider options={{ "client-id": "AbRZrANfmlch8C1v-BcDTBQVa8dsTRnNarMwclCmdbg1f1Sk6Vm60duPcYCdzLqVnKA7xmNGvt3t6PpX", currency: "MXN" }}>
                                        <PayPalButtons
                                            style={{ layout: "vertical", color: "blue", shape: "rect", label: "paypal" }}
                                            createOrder={(data, actions) => {
                                                return actions.order.create({
                                                    purchase_units: [{
                                                        amount: { value: total.toFixed(2) }
                                                    }]
                                                });
                                            }}
                                            onApprove={(data, actions) => {
                                                return actions.order.capture().then(async details => {
                                                    console.log("Pago exitoso", details);

                                                    // Actualizar stock después de la compra
                                                    try {
                                                        const productosStock = cartItems.map(item => ({
                                                            idProducto: item.id,
                                                            idTalla: item.talla,
                                                            cantidad: item.cantidad
                                                        }));
                                                        const stockRes = await fetch("http://localhost/Trendify/backend/updateStock.php", {
                                                            method: "POST",
                                                            headers: {
                                                                "Content-Type": "application/json"
                                                            },
                                                            body: JSON.stringify({
                                                                productos: productosStock
                                                            })
                                                        });
                                                        const stockData = await stockRes.json();
                                                        if (!stockRes.ok) {
                                                            console.error("Error al actualizar stock:", stockData.error);
                                                            alert("Error al actualizar el stock.");
                                                            return;
                                                        }
                                                        console.log("Stock actualizado:", stockData);
                                                    } catch (err) {
                                                        console.error("Error al contactar updateStock.php:", err);
                                                        alert("Error al actualizar el stock.");
                                                        return;
                                                    }

                                                    // 🔁 Llamada al backend para registrar la venta
                                                    fetch("http://localhost/Trendify/backend/generateVenta.php", {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type": "application/json"
                                                        },
                                                        body: JSON.stringify({
                                                            idUsuario: user.id,
                                                            metodo_pago_id: 1 , 
                                                            total: total
                                                        })
                                                    })
                                                        .then(res => res.json())
                                                        .then(data => {
                                                            if (data.success) {
                                                                console.log("Venta registrada en la base de datos:", data);
                                                                setSuccessMessage("¡Compra exitosa! Gracias por tu pedido.");
                                                                setTimeout(() => {
                                                                    setSuccessMessage("");
                                                                    navigate("/inicio", { state: { user } }); // Mantener sesión
                                                                }, 2500);
                                                            } else {
                                                                console.error("Error al guardar la venta:", data.error);
                                                                alert("Error al guardar la venta en la base de datos.");
                                                            }
                                                        })
                                                        .catch(err => {
                                                            console.error("Error al contactar el backend:", err);
                                                            alert("Error al registrar la venta.");
                                                        });
                                                });
                                            }}
                                            onError={(err) => {
                                                console.error("Error en PayPal", err);
                                            }}
                                        />
                                    </PayPalScriptProvider>
                                </div>
                                {/* Selector de direcciones */}
                                <div className="w-full mt-6">
                                    <label className="block font-bold mb-2">Selecciona una dirección de envío:</label>
                                    {addresses.length === 0 ? (
                                        <div className="text-gray-500 text-sm">No tienes direcciones registradas.</div>
                                    ) : (
                                        <select
                                            className="w-full border rounded p-2 font-montserrat mb-2"
                                            value={selectedAddress?.id_direccion || ""}
                                            onChange={e => {
                                                const addr = addresses.find(a => a.id_direccion === e.target.value || a.id_direccion === Number(e.target.value));
                                                setSelectedAddress(addr);
                                            }}
                                        >
                                            {addresses.map(addr => (
                                                <option key={addr.id_direccion} value={addr.id_direccion}>
                                                    {`${addr.calle} ${addr.numero_ext}${addr.numero_int ? ' Int. ' + addr.numero_int : ''}, ${addr.colonia}, ${addr.ciudad}, ${addr.estado}, CP ${addr.cp}`}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                    {selectedAddress && (
                                        <div className="bg-gray-100 rounded p-3 text-sm font-montserrat">
                                            <div><span className="font-bold">Calle:</span> {selectedAddress.calle}</div>
                                            <div><span className="font-bold">Número ext:</span> {selectedAddress.numero_ext}</div>
                                            {selectedAddress.numero_int && <div><span className="font-bold">Número int:</span> {selectedAddress.numero_int}</div>}
                                            <div><span className="font-bold">Colonia:</span> {selectedAddress.colonia}</div>
                                            <div><span className="font-bold">Ciudad:</span> {selectedAddress.ciudad}</div>
                                            <div><span className="font-bold">Estado:</span> {selectedAddress.estado}</div>
                                            <div><span className="font-bold">CP:</span> {selectedAddress.cp}</div>
                                            <div><span className="font-bold">Referencia:</span> {selectedAddress.referencia}</div>
                                        </div>
                                    )}
                                </div>
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