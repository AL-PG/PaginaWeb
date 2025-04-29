import React from 'react';
import { FaSearch, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Header from "./Componentes/Header";
import Footer from "./Componentes/Footer";
function Trendify() {
  return (
    <div>
        <Header />

      <main>
        <section className="bg-[#1E1E1E] w-full">
          <div className="bg-[#1E1E1E] w-full max-w-full m-0 p-0">
            <h1 className="font-[Gabarito] font-black tracking-[4vw] text-white text-center text-[8vw] m-0">TRENDIFY</h1>
            <div className="absolute top-[50vh] left-[35vw] w-[300px] h-[300px] rounded-full bg-white filter blur-[30rem]"></div>
            <div className="grid grid-cols-3">
              <div className="m-[0%_10%] text-white">
                <h2 className='font-[Gabarito] text-[4.5rem] m-0'>Nuevo</h2>
                <h2 className='font-[Gabarito] justify-self-center text-[4.5rem] m-0 text-black'
                  style={{ 
                    textShadow: `
                        -1px -1px 0 white,  
                        1px -1px 0 white,  
                        -1px  1px 0 white,  
                        1px  1px 0 white`}}>
                    Modelo</h2>
                <p className='text-[1.2rem]'>
                  Descubre nuestra nueva chamarra, diseñada para combinar estilo, comodidad y funcionalidad. 
                  Fabricada con materiales de alta calidad, ofrece la protección ideal contra el frío sin sacrificar ligereza y movilidad.
                </p>
              </div>

              <img src="./img/portada.png" alt="Una persona utilizando una prenda de TRENDIFY" 
              className="relative top-0 w-[40vw] h-[40vw] transform -translate-y-[15%] object-contain [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_70%,rgba(0,0,0,0.5)_85%,rgba(0,0,0,0))]" />

              <div className="self-center justify-self-end m-[25%] text-center">
                <div className='border-[2px] border-dotted border-white rounded-[80px] animate-pulso text-center'>
                  <a href="#" className='flex flex-col items-center justify-center'>
                    <img src="./img/chaqueta-port.png" alt="chaqueta de TRENDIFY"className='w-[70%]'/>
                  </a>
                </div>
                <span className='text-white text-[1.2rem]'>¡Cómprala ahora!</span>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center bg-white w-screen max-w-full" data-carousel>
          <h1 className='uppercase mb-5 text-[2.8rem] font-extrabold'>Explora nuestros estilos</h1>

          <ul className="flex justify-center items-center flex-row gap-2" data-slides>
            <li className="rounded-[28px] aspect-[2/1] w-4/5 opacity-50 transition-opacity duration-300 ease-in-out">
              <img src="./img/carrusel2.svg" alt="imagen del carrusel" className='rounded-[28px] w-full h-full object-cover'/>
            </li>

            <li className="rounded-[28px] aspect-[2/1] w-4/5 opacity-50 transition-opacity duration-300 ease-in-out" data-active>
              <img src="./img/carrusel1.svg" alt="imagen del carrusel" className='rounded-[28px] w-full h-full object-cover'/>
            </li>

            <li className="rounded-[28px] aspect-[2/1] w-4/5 opacity-50 transition-opacity duration-300 ease-in-out">
              <img src="./img/carrusel3.svg" alt="imagen del carrusel" className='rounded-[28px] w-full h-full object-cover'/>
            </li>
          </ul>

          <div className="flex flex-row justify-center items-center gap-2 my-4">
            <button type="button" data-carousel-button="prev"
            className="flex justify-center items-center border-none rounded-[10px] bg-[#D99D6C] h-16 w-1/5 cursor-pointer relative z-10 hover:bg-[#a87247]">
              <FaArrowLeft />
            </button>
            <button type="button" data-carousel-button="next"
            className='flex justify-center items-center border-none rounded-[10px] bg-[#D99D6C] h-16 w-1/5 cursor-pointer relative z-10 hover:bg-[#a87247]'>
              <FaArrowRight />
            </button>
          </div>
        </section>

        <section className="grid grid-cols-2 grid-rows-2 w-full h-auto">
          <div className="relative z-[1] row-span-2 w-full">
            <a href="#">
              <img src="./img/conjunto1.svg" alt="Conjunto especial 1" 
              className='w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105 hover:drop-shadow-[5px_5px_15px_rgba(0,0,0,0.3)]'/>
            </a>
            <div className="flex flex-col items-center justify-center absolute top-1/2 left-0 w-[40%] h-[8%] bg-[rgba(161,160,160,0.6)] rounded-[28px]">
              <h2 className='text-white text-3xl font-[montserrat] font-black text-center opacity-100'>Conjunto Especial</h2>
            </div>
          </div>

          <div className="relative z-[1] w-full">
            <a href="#">
              <img src="./img/conjunto2.svg" alt="Conjunto especial 2" 
              className='w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105 hover:drop-shadow-[5px_5px_15px_rgba(0,0,0,0.3)]'/>
            </a>
            <div className="flex flex-col items-center justify-center absolute top-[5%] left-[55%] w-[45%] h-[15%] bg-[rgba(161,160,160,0.6)] rounded-[28px]">
              <h2 className='text-white text-3xl font-[montserrat] font-black text-center opacity-100'>Conjunto Especial</h2>
            </div>
          </div>

          <div className="relative z-[1] w-full">
            <a href="#">
              <img src="./img/conjunto3.svg" alt="Conjunto especial 3" 
              className='w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105 hover:drop-shadow-[5px_5px_15px_rgba(0,0,0,0.3)]'/>
            </a>
            <div className="flex flex-col items-center justify-center absolute top-[70%] left-0 w-[45%] h-[15%] bg-[rgba(161,160,160,0.6)] rounded-[28px]">
              <h2 className='text-white text-3xl font-[montserrat] font-black text-center opacity-100'>Conjunto Especial</h2>
            </div>
          </div>
        </section>

        <section className="text-center bg-white w-screen max-w-full h-auto">
          <h1 className='uppercase text-[2.8rem] font-extrabold'>Lo más popular</h1>

          <div className="grid grid-cols-3 items-center justify-center justify-items-center gap-2 p-4">
            <div>
              <a href="#">
                <img src="./img/camisa2.svg" alt="Camiseta Y2K para hombre" className='w-full bg-[#D9D9D9] rounded-[40px] overflow-hidden'/>
              </a>
              <p className='font-bold uppercase'>Camiseta Y2K para hombre</p>
              <p>$199.00</p>
            </div>

            <div>
              <a href="#">
                <img src="./img/Chamarra.svg" alt="Chamarra para hombre" className='w-full bg-[#D9D9D9] rounded-[40px] overflow-hidden'/>
              </a>
              <p className='font-bold uppercase'>Chamarra para hombre</p>
              <p>$199.00</p>
            </div>

            <div>
              <a href="#">
                <img src="./img/camisa1.svg" alt="Camiseta Y2K para hombre" className='w-full bg-[#D9D9D9] rounded-[40px] overflow-hidden'/>
              </a>
              <p className='font-bold uppercase'>Camiseta Y2K para hombre</p>
              <p>$199.00</p>
            </div>
          </div>
        </section>

        <section className="relative z-10 w-screen">
          <img src="./img/img-about_us.svg" alt="Imagen de la sección sobre nosotros" className='w-full object-cover'/>

          <div className="flex flex-col items-center justify-center absolute top-0 left-1/2 w-1/2 h-full bg-[rgba(185,185,185,0.2)] backdrop-blur-md">
            <h1 className='uppercase text-center font-black text-white text-7xl mb-10 pr-12 pl-12'>Sobre nosotros</h1>
            <div className="flex flex-col text-center text-white mx-10 gap-5">
            <p className='text-justify font-medium text-2xl m-0 pr-10 pl-10'>En Trendify la moda es más que ropa: es una forma de expresión. Nacimos con la misión de ofrecer tendencias frescas, 
            auténticas y accesibles para jóvenes que quieren destacar con su propio estilo. </p>
            <p className='text-justify font-medium text-2xl m-0 pr-10 pl-10'>Nos inspiramos en la cultura urbana, las últimas tendencias globales y el espíritu libre de nuestra generación. 
            Cada prenda en nuestra tienda está cuidadosamente seleccionada para que puedas combinar comodidad, actitud y originalidad en cada outfit.
            Creemos en la moda sin reglas, en la creatividad sin límites y en la libertad de ser quien quieras ser.</p>    
            <p className='text-justify font-medium text-2xl m-0 pr-10 pl-10'>Ya sea que busques un look casual, streetwear o algo más atrevido, aquí encontrarás las piezas perfectas para hacerlo realidad.</p>
            </div>
          </div>
        </section>

        <div className="top-bar"></div>
        <Footer />
      </main>
    </div>
  );
}

export default Trendify;
