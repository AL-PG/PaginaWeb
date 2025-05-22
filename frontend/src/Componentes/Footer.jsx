import React from "react";
import {
  FaPhone,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaPinterest,
} from "react-icons/fa";
import { TbLetterX } from "react-icons/tb"; // Icono de X (Twitter)

const Footer = () => {
  return (
    <footer className="bg-[#1E1E1E] w-full py-6 text-white relative mt-auto font-montserrat">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start px-6 md:px-10 gap-6 md:gap-0">
        {/* Contacto */}
        <div className="space-y-3 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start">
            <FaPhone size={20} className="mr-2" />
            <span>Teléfono: 01 800 123 4567</span>
          </div>
          <div className="flex items-center justify-center md:justify-start">
            <FaEnvelope size={20} className="mr-2" />
            <span>soporte@trendify.com.mx</span>
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="text-center">
          <h2 className="text-xl md:text-2xl mb-3 font-semibold">Síguenos en:</h2>
          <div className="flex justify-center items-center gap-5">
            <a href="#" aria-label="Facebook" className="text-white text-2xl hover:text-gray-300">
              <FaFacebook />
            </a>
            <a href="#" aria-label="Instagram" className="text-white text-2xl hover:text-gray-300">
              <FaInstagram />
            </a>
            <a href="#" aria-label="X (antes Twitter)" className="text-white text-2xl hover:text-gray-300">
              <TbLetterX />
            </a>
            <a href="#" aria-label="Pinterest" className="text-white text-2xl hover:text-gray-300">
              <FaPinterest />
            </a>
          </div>
        </div>
      </div>

      {/* Derechos */}
      <div className="text-center mt-5">
        <p className="text-sm">&copy; 2025 Trendify. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
