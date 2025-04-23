import React from "react";
import { FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaPinterest } from "react-icons/fa";
import { TbLetterX } from "react-icons/tb"; // Import X icon

const Footer = () => {
  return (
    <footer className="bg-[#1E1E1E] w-full py-5 text-white relative mt-auto">
      <div className="flex justify-between px-10"> {/* Changed to flex with justify-between */}
        <div className="space-y-2">
          <div className="flex items-center">
            <FaPhone size={24} className="mr-2" />
            <span>Teléfono: 01 800 123 4567</span>
          </div>
          <div className="flex items-center">
            <FaEnvelope size={24} className="mr-2" />
            <span>soporte@trendify.com.mx</span>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl mb-3">Síguenos en:</h2>
          <div className="flex justify-center items-center gap-5">
            <a href="#" className="text-white text-2xl">
              <FaFacebook />
            </a>
            <a href="#" className="text-white text-2xl">
              <FaInstagram />
            </a>
            <a href="#" className="text-white text-2xl">
              <TbLetterX /> {/* Replaced Twitter icon with X icon */}
            </a>
            <a href="#" className="text-white text-2xl">
              <FaPinterest />
            </a>
          </div>
        </div>
      </div>
      <div className="text-center mt-2">
        <p className="text-sm">© 2025 Trendify. Todos los derechos reservados.</p> {/* Adjusted font size */}
      </div>
    </footer>
  );
};

export default Footer;
