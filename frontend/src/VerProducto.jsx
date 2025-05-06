import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import Header from './Componentes/Header';
import Footer from './Componentes/Footer';

const ProductPage = () => {
  const location = useLocation(); // Get state from navigation
  const producto = location.state?.producto; // Extract producto from state
  const user = location.state?.user; // Safely access user data
  const isLoggedIn = !!user;  // Safely access login state
  console.log('Producto:', producto); // Log producto for debugging

  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [mainImage, setMainImage] = useState(producto?.url_imagen || 'img/main-image.webp'); // Use product image or fallback
  const [rating, setRating] = useState(0); // Add state for rating
  const [ratingData, setRatingData] = useState({ promedio_calificacion: 0, numero_calificaciones: 0 }); // State for rating data
  const [thumbnails, setThumbnails] = useState([
    { thumb: producto?.url_imagen, full: producto?.url_imagen, alt: 'Vista 1' },
  ]);
  const [stock, setStock] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [measurements, setMeasurements] = useState([]);

  const [favoritosMessage, setFavoritosMessage] = useState("");

  const [cartMessage, setCartMessage] = useState("");


  useEffect(() => {
    if (producto?.idProducto) {
      fetch(`http://localhost/Trendify/backend/Producto-Imagenes.php?idProducto=${producto.idProducto}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('Imagenes recibidas:', data); // Log fetched images for debugging
          const images = data.map((item, index) => ({
            thumb: item.url_imagen, // Use the correct property for the thumbnail
            full: item.url_imagen, // Use the correct property for the full image
            alt: `Vista ${index + 1}`,
          }));
          setThumbnails(images);
        })
        .catch((error) => console.error('Error fetching images:', error));
    }
  }, [producto?.idProducto]);

  useEffect(() => {
    const checkFavorito = async () => {
      if (user?.id && producto?.idProducto) {
        try {
          const response = await fetch(`http://localhost/Trendify/backend/getFavoritos.php?idUsuario=${user.id}`);
          const data = await response.json();
          const isFavorito = data.some(item => item.idProducto === producto.idProducto);
          setIsWishlisted(isFavorito);
        } catch (error) {
          console.error('Error verificando favorito:', error);
        }
      }
    };
    checkFavorito();
  }, [user, producto]);

  useEffect(() => {
    if (producto?.idProducto && selectedSize) {
      const sizeMapping = { XS: 1, S: 2, M: 3, L: 4, XL: 5 };
      const sizeId = sizeMapping[selectedSize];

      fetch(`http://localhost/Trendify/backend/getStock.php?idProducto=${producto.idProducto}&idTalla=${sizeId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.stock !== undefined) {
            setStock(data.stock);
          } else {
            setStock(0); // Default to 0 if no stock is found
          }
        })
        .catch((error) => {
          console.error('Error fetching stock:', error);
          setStock(null); // Reset stock on error
        });
    }
  }, [producto?.idProducto, selectedSize]);

  useEffect(() => {
    if (producto?.idProducto) {
      fetch(`http://localhost/Trendify/backend/getCalificacion.php?idProducto=${producto.idProducto}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.promedio_calificacion !== undefined && data.numero_calificaciones !== undefined) {
            setRatingData(data);
          }
        })
        .catch((error) => console.error('Error fetching rating data:', error));
    }
  }, [producto?.idProducto]);

  useEffect(() => {
    if (cartMessage) {
      const timer = setTimeout(() => {
        setCartMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [cartMessage]);
  
  useEffect(() => {
    if (favoritosMessage) {
      const timer = setTimeout(() => {
        setFavoritosMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [favoritosMessage]);

  const handleToggleFavoritos = async () => {
    if (!user?.id) {
      setFavoritosMessage("Debes iniciar sesión para gestionar favoritos.");
      return;
      
    }


    

    const endpoint = isWishlisted ? 'deleteFavoritos.php' : 'addFavoritos.php';

    try {
      const response = await fetch(`http://localhost/Trendify/backend/${endpoint}`, {
        method: isWishlisted ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idUsuario: user.id,
          idProducto: producto.idProducto
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error en la operación");

      setIsWishlisted(!isWishlisted);
      setFavoritosMessage(isWishlisted
        ? "Producto eliminado de favoritos"
        : "Producto agregado a favoritos");

    } catch (error) {
      setFavoritosMessage(error.message || "Error al procesar la solicitud");
    }
  };

  const handleAddToCart = async () => {
    if (!user?.id) {
      setCartMessage("Debes iniciar sesión para añadir productos al carrito.");
      return;
    }

    if (!producto?.idProducto) {
      setCartMessage("Error: Producto no válido.");
      return;
    }

    if (stock === 0 || stock === null) {
      setCartMessage("No hay stock disponible para este producto.");
      return;
    }

    try {
      const response = await fetch('http://localhost/Trendify/backend/addCarrito.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idUsuario: user.id,
          idProducto: producto.idProducto,
          cantidad: quantity
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al añadir al carrito");

      setCartMessage("Producto añadido al carrito");
    } catch (error) {
      setCartMessage(error.message);
    }
  };

  const openModal = () => {
    if (producto?.idProducto) {
      fetch(`http://localhost/Trendify/backend/getMedidas.php?idProducto=${producto.idProducto}`)
        .then((response) => response.json())
        .then((data) => setMeasurements(data))
        .catch((error) => console.error('Error fetching measurements:', error));
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  return (
    <>
      <Header isLoggedIn={isLoggedIn} user={user} />
      <div className={`max-w-[1200px] mx-auto my-4 bg-white p-5 rounded-lg ${isModalOpen ? 'blur-sm' : ''}`}>
        <div className="flex gap-5">
          {/* Galería */}
          <div className="flex flex-col gap-3">
            {thumbnails.map((thumbnail, index) => (
              <img
                key={index}
                src={thumbnail.thumb}
                alt={thumbnail.alt}
                className={`w-20 h-28 object-cover rounded-lg border cursor-pointer transition-all ${mainImage === thumbnail.full
                  ? 'border-2 border-amber-600'
                  : 'border-gray-200 hover:border-amber-600'
                  }`}
                onClick={() => setMainImage(thumbnail.full)}
              />
            ))}
          </div>

          {/* Imagen principal */}
          <div className="flex-1">
            <img
              src={mainImage}
              alt={producto?.nombre_producto || 'Producto'}
              className="w-[450px] rounded-xl"
            />
          </div>

          {/* Detalles del producto */}
          <div className="flex-1 pl-5 bg-gray-100 p-5 rounded-lg"> {/* Fondo gris claro con esquinas redondeadas */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600 font-bold text-sm font-[Montserrat]">{producto?.genero || 'Género'}</span>
              <div className="flex items-center">
                <div className="flex mr-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`fa-star ${star <= Math.round(ratingData.promedio_calificacion)
                        ? 'fas text-yellow-400'  // Estrella llena en amarillo
                        : 'fas text-gray-300'     // Estrella vacía en gris
                        }`}
                    ></i>
                  ))}
                </div>
                <span className="text-gray-600 text-sm font-[Montserrat]">
                  ({ratingData.numero_calificaciones} reseñas)
                </span>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-3">{producto?.nombre_producto || 'Nombre del Producto'}</h2>
            <p className="text-2xl font-bold text-gray-800 mb-4">MXN {producto?.precio || '0.00'}</p>
            <p className="text-gray-800 mb-4 font-[Montserrat]">Color: {producto?.color || 'Color'}</p>
            <p className="text-gray-600 mb-4 font-[Montserrat]">
              {stock !== null ? `${stock} Disponibles` : 'No hay disponibles'} {/* Show stock or loading message */}
            </p>

            {/* Selector de tallas */}
            <div className="flex flex-wrap gap-2 mb-4 font-[Montserrat]">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`w-10 h-10 flex items-center justify-center border rounded 
                    ${selectedSize === size
                      ? 'bg-black text-white border-black'
                      : 'border-gray-400 hover:bg-gray-100'
                    }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 mb-4 text-sm font-[Montserrat] text-gray-600 cursor-pointer">
              <span className="hover:underline" onClick={openModal}>Guía de tallas</span> {/* Text underlines on hover */}
              <i className="fas fa-ruler text-xs"></i> {/* Ruler icon remains unaffected */}
            </div>

            {/* Selector de cantidad */}
            <div className="flex items-center gap-2 mb-6">
              <button
                className="w-8 h-8 border font-bold bg-gray-200 rounded flex items-center justify-center"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <i className="fas fa-minus text-sm"></i> {/* Reduced icon size */}
              </button>
              <input
                type="number"
                value={quantity}
                className="w-16 h-8 border text-center font-[Montserrat] pl-3.5"
                readOnly
              />
              <button
                className="w-8 h-8 border font-bold bg-gray-200 rounded flex items-center justify-center"
                onClick={() => setQuantity(quantity + 1)}
              >
                <i className="fas fa-plus text-sm"></i> {/* Reduced icon size */}
              </button>
            </div>

            {/* Botones */}
            <div className="flex gap-3 mb-6">
              <button
                className="flex-1 bg-[#D99D6C] text-white p-2 rounded-lg hover:bg-[#C68B5F] font-konkhmer-sleokchher transition"
                onClick={handleAddToCart}
              >
                AÑADIR AL CARRITO
              </button>
              <button
                className="text-2xl text-gray-600 hover:text-red-500"
                onClick={handleToggleFavoritos}
              >
                <i className={isWishlisted ? 'fas fa-heart text-red-500' : 'far fa-heart'}></i>
              </button>
            </div>

            {/* Acordeón */}
            <div className="border-t border-b py-4">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsAccordionOpen(!isAccordionOpen)} // Toggle accordion on click
              >
                <span className="font-medium font-konkhmer-sleokchher text-sm">Composición y cuidado</span> {/* Smaller font size */}
                <i className={`fas fa-plus transition-transform ${isAccordionOpen ? 'rotate-45' : ''
                  }`}></i>
              </div>

              {isAccordionOpen && (
                <div className="mt-3 font-[Montserrat] text-sm" onClick={() => setIsAccordionOpen(false)}> {/* Smaller font size */}
                  <p className="font-bold">Composición:</p> {/* Label in bold */}
                  <p>{producto?.composicion || 'Información no disponible'}</p> {/* Regular text */}
                  <p className="font-bold mt-2">Cuidado:</p> {/* Label in bold */}
                  <p>{producto?.instrucciones_cuidado || 'Información no disponible'}</p> {/* Regular text */}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Productos relacionados */}
        <section className="mt-10">
          <h3 className="text-xl font-bold mb-5">Esto podría gustarte</h3>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white p-4 rounded-lg relative hover:shadow-lg transition">
                <button className="absolute top-3 right-3 text-white bg-black/30 p-2 rounded-full">
                  <i className="far fa-heart"></i>
                </button>
                <img
                  src={`img/related${item}.webp`}
                  alt={`Producto ${item}`}
                  className="w-full rounded mb-3"
                />
                <p className="font-medium">Playera STWD</p>
                <p className="font-bold">MXN {499 + (item * 50)}.00</p>
              </div>
            ))}
          </div>
        </section>
        {favoritosMessage && (
  <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 text-green-800 px-6 py-3 rounded-lg font-[Montserrat] animate-fade-in">
    {favoritosMessage}
  </div>
)}
{cartMessage && (
  <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg font-[Montserrat] animate-fade-in ${
    cartMessage.includes("añadido") 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }`}>
    {cartMessage}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg w-[90%] max-w-[600px] relative">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              onClick={closeModal}
            >
              <i className="fas fa-times"></i>
            </button>
            <h2 className="text-xl font-bold mb-4">Guía de tallas</h2>
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 text-center">Talla</th>
                  <th className="border border-gray-300 p-2 text-center">Pecho</th>
                  <th className="border border-gray-300 p-2 text-center">Cintura</th>
                  <th className="border border-gray-300 p-2 text-center">Largo</th>
                  <th className="border border-gray-300 p-2 text-center">Ancho</th>
                </tr>
              </thead>
              <tbody>
                {measurements.map((measure, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                    <td className="border border-gray-300 p-2 text-center">{measure.Talla}</td>
                    <td className="border border-gray-300 p-2 text-center">{measure.pecho} cm</td>
                    <td className="border border-gray-300 p-2 text-center">{measure.cintura} cm</td>
                    <td className="border border-gray-300 p-2 text-center">{measure.largo} cm</td>
                    <td className="border border-gray-300 p-2 text-center">{measure.ancho} cm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      )}
      <Footer />
    </>
  );
};

export default ProductPage;