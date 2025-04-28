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

        <section className="carrusel-main-uno" data-carousel>
          <h1>Explora nuestros estilos</h1>

          <ul className="carrusel-img" data-slides>
            <li className="carrusel-img-izquierda">
              <img src="/img/carrusel2.svg" alt="imagen del carrusel" />
            </li>

            <li className="carrusel-img-central" data-active>
              <img src="/img/carrusel1.svg" alt="imagen del carrusel" />
            </li>

            <li className="carrusel-img-derecha">
              <img src="/img/carrusel3.svg" alt="imagen del carrusel" />
            </li>
          </ul>

          <div className="boton-carrusel">
            <button type="button" className="boton-carrusel-direccion" data-carousel-button="prev">
              <FaArrowLeft />
            </button>
            <button type="button" className="boton-carrusel-direccion" data-carousel-button="next">
              <FaArrowRight />
            </button>
          </div>
        </section>

        <section className="section-conjunto">
          <div className="section-conjunto-uno">
            <a href="#">
              <img src="/img/conjunto1.svg" alt="Conjunto especial 1" />
            </a>
            <div className="div-conjunto-uno">
              <h2>Conjunto Especial</h2>
            </div>
          </div>

          <div className="section-conjunto-dos">
            <a href="#">
              <img src="/img/conjunto2.svg" alt="Conjunto especial 2" />
            </a>
            <div className="div-conjunto-dos">
              <h2>Conjunto Especial</h2>
            </div>
          </div>

          <div className="section-conjunto-tres">
            <a href="#">
              <img src="/img/conjunto3.svg" alt="Conjunto especial 3" />
            </a>
            <div className="div-conjunto-tres">
              <h2>Conjunto Especial</h2>
            </div>
          </div>
        </section>

        <section className="carrusel-main-dos">
          <h1>Lo más popular</h1>

          <div className="carrusel-dos-img">
            <div>
              <a href="#">
                <img src="/img/camisa2.svg" alt="Camiseta Y2K para hombre" />
              </a>
              <p>Camiseta Y2K para hombre</p>
              <p>$199.00</p>
            </div>

            <div>
              <a href="#">
                <img src="/img/Chamarra.svg" alt="Chamarra para hombre" />
              </a>
              <p>Chamarra para hombre</p>
              <p>$199.00</p>
            </div>

            <div>
              <a href="#">
                <img src="/img/camisa1.svg" alt="Camiseta Y2K para hombre" />
              </a>
              <p>Camiseta Y2K para hombre</p>
              <p>$199.00</p>
            </div>
          </div>
        </section>

        <section className="section-about_us">
          <img src="/img/img-about_us.svg" alt="Imagen de la sección sobre nosotros" />

          <div className="section-about_us-div">
            <h1>Sobre nosotros</h1>
            <div className="section-about_us-div_texto">
              <p>En Trendify la moda es más que ropa: es una forma de expresión...</p>
              <p>Nos inspiramos en la cultura urbana, las últimas tendencias globales y el espíritu libre de nuestra generación...</p>
              <p>Ya sea que busques un look casual, streetwear o algo más atrevido, aquí encontrarás las piezas perfectas para hacerlo realidad.</p>
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
