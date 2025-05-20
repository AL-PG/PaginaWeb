import React from "react";
import Header from "./Componentes/Header";
import Footer from "./Componentes/Footer";
import { useLocation } from "react-router-dom"; // Import hooks
import { FaArrowLeft } from 'react-icons/fa';
import { FaArrowRight } from 'react-icons/fa';
import { useState } from "react";
import Carrusel from "./carruselInicio";// Import the Carousel component

const Inicio = () => {
  const location = useLocation(); 
  const user = location.state?.user; 
  const isLoggedIn = location.state?.isLoggedIn || false;

  console.log("User data:", user);
  return (
    <div>
        <Header isLoggedIn={!!user} user={user} />

      <main className="overflow-x-hidden"> 
        <section className="bg-[#1E1E1E] w-full">
          <div className="bg-[#1E1E1E] w-full max-w-full m-0 p-0">
            <h1 className="font-[Gabarito] font-black tracking-[4vw] text-white text-center text-[10vw] md:text-[4rem] m-0">TRENDIFY</h1>
            <div className="hidden md:block absolute top-[50vh] left-[35vw] w-[300px] h-[300px] rounded-full bg-white filter blur-[30rem]"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
              <div className="text-white md:m-[0%_10%]">
                <h2 className="font-[Gabarito] text-[8vw] text-center md:text-start md:text-[4.5rem] m-0">Nuevo</h2>
                <h2 className="font-[Gabarito] text-[8vw] text-center md:text-[4.5rem] m-0 text-black" style={{ textShadow: `-1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white` }}>
                  Modelo
                </h2>
                <p className='text-[4 vw] md:text-[1rem] lg:text-[1.4rem] font-[Montserrat] w-full'>
                  Descubre nuestra nueva chamarra, diseñada para combinar estilo, comodidad y funcionalidad. 
                  Fabricada con materiales de alta calidad, ofrece la protección ideal contra el frío sin sacrificar ligereza y movilidad.
                </p>
              </div>

              <img src="./img/portada.png" alt="Una persona utilizando una prenda de TRENDIFY" 
                className="w-50 md:w-[80vw] h-auto object-contain 
                [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_70%,rgba(0,0,0,0.5)_85%,rgba(0,0,0,0))]"
              />
              <div className="self-center justify-self-center hidden md:justify-self-end md:block text-center">
                <div className='border-[2px] border-dotted border-white rounded-[80px] animate-pulso text-center'>
                  <a href="#" className='flex flex-col items-center justify-center'>
                    <img src="./img/chaqueta-port.png" alt="chaqueta de TRENDIFY" className='w-[70%]'/>
                  </a>
                </div>
                <span className='text-white text-[4vw] md:text-[1.2rem] font-[Montserrat]'>¡Cómprala ahora!</span>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-gray-100">
          <Carrusel
            items={[
              <img src="./img/carrusel1.svg" alt="Slide 1" className="rounded-3xl aspect-[20/9] w-[70%]"/>,
              <img src="./img/carrusel2.webp" alt="Slide 2" className="rounded-3xl aspect-[20/9] w-[70%]"/>,
              <img src="./img/carrusel3.webp" alt="Slide 3" className="rounded-3xl aspect-[20/9] w-[70%]"/>
            ]}
          />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 w-full h-auto">
          <div className="relative z-[1] row-span-2 w-full">
            <a href="#">
              <img src="./img/conjunto1.svg" alt="Conjunto especial 1" 
              className='w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105 hover:drop-shadow-[5px_5px_15px_rgba(0,0,0,0.3)]'/>
            </a>
            <div className="flex flex-col items-center justify-center absolute top-1/2 left-0 w-[40%] h-[10%] bg-[rgba(161,160,160,0.6)] rounded-[px]">
              <h2 className='text-white text-md sm:text-xl xl:text-3xl font-[montserrat] font-black text-center opacity-100'>Conjunto Especial</h2>
            </div>
          </div>

          <div className="relative z-[1] w-full">
            <a href="#">
              <img src="./img/conjunto2.svg" alt="Conjunto especial 2" 
              className='w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105 hover:drop-shadow-[5px_5px_15px_rgba(0,0,0,0.3)]'/>
            </a>
            <div className="flex flex-col items-center justify-center absolute top-[5%] left-[55%] w-[45%] h-[15%] bg-[rgba(161,160,160,0.6)] rounded-10px]">
              <h2 className='text-white text-md sm:text-xl xl:text-3xl font-[montserrat] font-black text-center opacity-100'>Conjunto Especial</h2>
            </div>
          </div>

          <div className="relative z-[1] w-full">
            <a href="#">
              <img src="./img/conjunto3.svg" alt="Conjunto especial 3" 
              className='w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105 hover:drop-shadow-[5px_5px_15px_rgba(0,0,0,0.3)]'/>
            </a>
            <div className="flex flex-col items-center justify-center absolute top-[70%] left-0 w-[45%] h-[15%] bg-[rgba(161,160,160,0.6)] rounded-[10px]">
              <h2 className='text-white text-md sm:text-xl xl:text-3xl font-[montserrat] font-black text-center opacity-100'>Conjunto Especial</h2>
            </div>
          </div>
        </section>

        <section className="text-center bg-white w-screen max-w-full h-auto">
          <h1 className='uppercase text-xl md:text-[2.8rem] font-extrabold my-2 md:my-4'>Lo más popular</h1>

          <div className="grid grid-cols-3 items-center justify-center justify-items-center gap-2 p-1 md:p-4">
            <div>
              <a href="#">
                <img src="./img/camisa2.svg" alt="Camiseta Y2K para hombre" className='w-full max-w-full bg-[#D9D9D9] rounded-xl overflow-hidden'/>
              </a>
              <p className='font-bold md:uppercase font-[Montserrat] text-sm'>Camiseta Y2K para hombre</p>
              <p>$199.00</p>
            </div>

            <div>
              <a href="#">
                <img src="./img/Chamarra.svg" alt="Chamarra para hombre" className='w-full max-w-full bg-[#D9D9D9] rounded-xl overflow-hidden'/>
              </a>
              <p className='font-bold md:uppercase font-[Montserrat] text-sm'>Chamarra para hombre</p>
              <p>$199.00</p>
            </div>

            <div>
              <a href="#">
                <img src="./img/camisa1.svg" alt="Camiseta Y2K para hombre" className='w-full max-w-full bg-[#D9D9D9] rounded-xl overflow-hidden'/>
              </a>
              <p className='font-bold md:uppercase font-[Montserrat] text-sm'>Camiseta Y2K para hombre</p>
              <p>$199.00</p>
            </div>
          </div>
        </section>

        <section className="relative z-10 w-full">
          <img src="./img/img-about_us.svg" alt="Imagen de la sección sobre nosotros" className='w-full object-cover'/>

          <div className="flex flex-col items-center justify-center absolute top-5 sm:top-1/4 w-full lg:top-0 lg:left-1/2 lg:w-1/2 lg:h-full bg-[rgba(185,185,185,0.2)] backdrop-blur-md">
            <h1 className='uppercase text-center font-black text-white text-xl lg:text-5xl lg:mb-10 lg:pr-12 lg:pl-12'>Sobre nosotros</h1>
            <div className="flex flex-col text-center text-white mx-10 gap-5">
            <p className='hidden sm:block text-justify sm:font-medium text-sm sm:text-md lg:text-lg m-0 md:pr-10 md:pl-10'>En Trendify la moda es más que ropa: es una forma de expresión. Nacimos con la misión de ofrecer tendencias frescas, 
            auténticas y accesibles para jóvenes que quieren destacar con su propio estilo. </p>
            <p className='pb-2 text-justify sm:font-medium text-sm sm:text-md lg:text-lg m-0 md:pr-10 md:pl-10'>Nos inspiramos en la cultura urbana, las últimas tendencias globales y el espíritu libre de nuestra generación. 
            Cada prenda en nuestra tienda está cuidadosamente seleccionada para que puedas combinar comodidad, actitud y originalidad en cada outfit.
            Creemos en la moda sin reglas, en la creatividad sin límites y en la libertad de ser quien quieras ser.</p>    
            <p className='hidden sm:block text-justify sm:font-medium text-sm sm:text-md lg:text-lg m-0 md:pr-10 md:pl-10'>Ya sea que busques un look casual, streetwear o algo más atrevido, aquí encontrarás las piezas perfectas para hacerlo realidad.</p>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </div>
      );
};



export default Inicio;
