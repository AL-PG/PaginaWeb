import React from "react";
import Header from "./Componentes/Header";
import Footer from "./Componentes/Footer";
import { useLocation } from "react-router-dom";
import { FaArrowLeft } from 'react-icons/fa';
import { FaArrowRight } from 'react-icons/fa';

const Inicio = () => {
  const location = useLocation();
  const user = location.state?.user;
  const isLoggedIn = location.state?.isLoggedIn || false;
  const [popularProducts, setPopularProducts] = React.useState([]);

  React.useEffect(() => {
    fetch("http://localhost/Trendify/backend/getPopularProducts.php")
      .then(res => res.json())
      .then(data => setPopularProducts(data))
      .catch(() => setPopularProducts([]));
  }, []);

  console.log("User data:", user);


  return (
    <div>
      <Header isLoggedIn={!!user} user={user} />

      <main>
        <section className="bg-[#1E1E1E] w-full">
          <div className="bg-[#1E1E1E] w-full max-w-full m-0 p-0">
            <h1 className="font-[Gabarito] font-black tracking-[4vw] text-white text-center text-[8vw] m-0">TRENDIFY</h1>
            <div className="absolute top-[50vh] left-[35vw] w-[300px] h-[300px] rounded-full bg-white filter blur-[30rem]"></div>
            <div className="grid grid-cols-3">
              <div className="m-[0%_10%] text-white">
                <div className="flex items-center space-x-2">
                  <h2 className="font-[Gabarito] text-[4.5rem] m-0">Nuevo</h2>
                  <h2
                    className="font-[Gabarito] justify-self-center text-[4.5rem] m-0 text-black"
                    style={{
                      textShadow: `
        -1px -1px 0 white,  
        1px -1px 0 white,  
        -1px  1px 0 white,  
        1px  1px 0 white`
                    }}
                  >
                    Modelo
                  </h2>
                </div>
                <p className='text-[1 rem] font-[Montserrat]'>
                  Descubre nuestra nueva chamarra, diseñada para combinar estilo, comodidad y funcionalidad.
                  Fabricada con materiales de alta calidad, ofrece la protección ideal contra el frío sin sacrificar ligereza y movilidad.
                </p>
              </div>

              <img src="./img/portada.png" alt="Una persona utilizando una prenda de TRENDIFY"
                className="relative top-0 w-[40vw] h-[40vw] transform -translate-y-[15%] object-contain [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_70%,rgba(0,0,0,0.5)_85%,rgba(0,0,0,0))]" />

              <div className="self-center justify-self-end m-[25%] text-center">
                <div className='border-[2px] border-dotted border-white rounded-[80px] text-center'>
                  <a href="#" className='flex flex-col items-center justify-center'>
                    <img src="./img/chaqueta-port.png" alt="chaqueta de TRENDIFY" className='w-[70%] animate-pulse-scale' />
                  </a>
                </div>
                <span className='text-white text-[1.2rem] font-[Montserrat]'>¡Cómprala ahora!</span>
              </div>
            </div>
          </div>
        </section>



        <section className="grid grid-cols-2 grid-rows-2 w-full h-auto"> {/* Imagen grande izquierda */} <div className="relative z-[1] row-span-2 w-full"> <a href="#"> <img src="./img/inicio1.png" alt="Conjunto especial 1" className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105 hover:drop-shadow-[5px_5px_15px_rgba(0,0,0,0.3)]" /> </a> <div className="absolute inset-0 flex items-center justify-center"> <div className="bg-[rgba(0,0,0,0.4)] border border-white rounded-3xl px-4 py-2 transition duration-300 hover:bg-[rgba(0,0,0,0.7)]"> <h2 className="text-white text-base font-[montserrat] text-center">Conjunto Especial</h2> </div> </div> </div>
          {/* Imagen arriba derecha */}

          <div className="relative z-[1] w-full"> <a href="#"> <img src="./img/inicio2.png" alt="Conjunto especial 2" className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105 hover:drop-shadow-[5px_5px_15px_rgba(0,0,0,0.3)]" /> </a> <div className="absolute inset-0 flex items-center justify-center"> <div className="bg-[rgba(0,0,0,0.4)] border border-white rounded-3xl px-4 py-2 transition duration-300 hover:bg-[rgba(0,0,0,0.7)]"> <h2 className="text-white text-base font-[montserrat] text-center">Conjunto Especial</h2> </div> </div> </div>
          {/* Imagen abajo derecha */}

          <div className="relative z-[1] w-full"> <a href="#"> <img src="./img/inicio3.png" alt="Conjunto especial 3" className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105 hover:drop-shadow-[5px_5px_15px_rgba(0,0,0,0.3)]" /> </a> <div className="absolute inset-0 flex items-center justify-center"> <div className="bg-[rgba(0,0,0,0.4)] border border-white rounded-3xl px-4 py-2 transition duration-300 hover:bg-[rgba(0,0,0,0.7)]"> <h2 className="text-white text-base font-[montserrat] text-center">Conjunto Especial</h2> </div> </div> </div> </section>

        <div className="h-10"></div> {/* Espaciador extra entre popular y sobre nosotros */}

        <section className="text-center bg-gray-100 w-screen max-w-full h-auto">
          <h1 className='uppercase text-[2.8rem] font-extrabold'>Lo más popular</h1>
          <div className="flex justify-center gap-8 p-4">
            {popularProducts.length === 0 ? (
              <div className="text-gray-500 text-lg">No hay productos populares.</div>
            ) : (
              popularProducts.map(producto => (
                <div
                  key={producto.idProducto}
                  className="bg-white rounded-lg flex flex-col items-center hover:shadow-sm transition cursor-pointer"
                  style={{
                    width: "220px",
                    minHeight: "350px",
                    padding: "1.25rem",
                    transition: "transform 0.2s",
                    height: "auto",
                    boxSizing: "border-box"
                  }}
                  onClick={() => window.location.href = `/producto?id=${producto.idProducto}`}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.07)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  <img
                    src={producto.url_imagen}
                    alt={producto.nombre_producto}
                    className="rounded mb-2"
                    style={{
                      width: "100%",
                      height: "245px", // altura ligeramente mayor
                      objectFit: "cover",
                      aspectRatio: "2/3"
                    }}
                  />
                  <h3 className="font-bold text-md font-montserrat text-center mt-2 break-words line-clamp-3">{producto.nombre_producto}</h3>
                  <span className="text-gray-700 font-montserrat text-center">MXN ${producto.precio}</span>
                  {/* Eliminado el contador de ventas */}
                </div>
              ))
            )}
          </div>
        </section>

        <div className="h-10"></div> {/* Espaciador extra entre popular y sobre nosotros */}

        <section className="relative z-10 w-screen">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full object-cover"
          >
            <source src="./img/aboutus.mp4" type="video/mp4" />
            {/* Texto de respaldo si el navegador no soporta vídeo */}
            Tu navegador no soporta la reproducción de vídeo.
          </video>
          <div className="flex flex-col items-center justify-center absolute top-0 left-1/2 w-1/2 h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-md">            <h1 className='uppercase text-center font-black text-white text-6xl mb-10 pr-12 pl-12'>Sobre nosotros</h1>
            <div className="flex flex-col font-[montserrat] text-center text-white mx-10 gap-5">
              <p className='text-justify text-base m-0 pr-10 pl-10 font-[montserrat]'>En Trendify la moda es más que ropa: es una forma de expresión. Nacimos con la misión de ofrecer tendencias frescas,
                auténticas y accesibles para jóvenes que quieren destacar con su propio estilo. </p>
              <p className='text-justify  text-base m-0 pr-10 pl-10 font-[montserrat]'>Nos inspiramos en la cultura urbana, las últimas tendencias globales y el espíritu libre de nuestra generación.
                Cada prenda en nuestra tienda está cuidadosamente seleccionada para que puedas combinar comodidad, actitud y originalidad en cada outfit.
                Creemos en la moda sin reglas, en la creatividad sin límites y en la libertad de ser quien quieras ser.</p>
              <p className='text-justify text-base m-0 pr-10 pl-10 font-[montserrat]'>Ya sea que busques un look casual, streetwear o algo más atrevido, aquí encontrarás las piezas perfectas para hacerlo realidad.</p>
            </div>
          </div>
        </section>

        <div className="top-bar"></div>
        <Footer />
      </main>
    </div>
  );
};



export default Inicio;
