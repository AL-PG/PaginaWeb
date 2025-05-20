import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Registro from "./Registro";
import Inicio from "./Inicio";
import DatosUsuario from "./DatosUsuario";
import ProductosHombre from "./ProductosHombre";
import Producto from "./VerProducto";
import Favoritos from "./Favoritos";
import Carrito from "./Carrito";
import Ventas from "./Ventas";
import Colecciones from "./Colecciones";
import ProductosMujer from "./ProductosMujer";

// Importa el chatbot
import Chatbot from "./Componentes/Chatbot";

function App() {
  return (
    <>
      <Routes> 
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/mis-datos" element={<DatosUsuario />} /> 
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/hombre" element={<ProductosHombre />} /> 
        <Route path="/producto" element={<Producto />} /> 
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/mis-compras" element={<Ventas />} />
        <Route path="/colecciones" element={<Colecciones />} />
        <Route path="/mujer" element={<ProductosMujer />} />
      </Routes>

      <Chatbot /> {/* Chatbot siempre presente */}
    </>
  );
}

export default App;

