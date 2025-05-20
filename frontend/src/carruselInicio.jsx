import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carrusel = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

    return (
      <div className="max-w-5xl mx-auto mt-5">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">EXPLORA NUESTROS ESTILOS</h2>
        <div className="relative overflow-hidden"> 
          <div className="flex transition-transform duration-500">
            {items.map((item, index) => (
              <div key={index} className="flex min-w-full max-w-full flex-shrink-0 p-2 items-center justify-center transition-transform duration-500"
                  style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
              {item}
              </div>
            ))}
          </div>
          <button onClick={handlePrev} className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-black text-white rounded-full">
            <ChevronLeft />
          </button>
          <button onClick={handleNext} className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black text-white rounded-full">
            <ChevronRight />
          </button>
        </div>
        <div className="flex justify-center gap-2 m-4">
          {items.map((_, index) => (
            <div
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full ${index === activeIndex ? 'bg-gray-800' : 'bg-gray-400'} cursor-pointer`}
            />
          ))}
        </div>
      </div>
    );
  };

export default Carrusel;