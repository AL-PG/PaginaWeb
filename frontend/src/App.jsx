import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Registro from "./Registro";
import Inicio from "./Inicio"; // Import Inicio
import DatosUsuario from "./DatosUsuario"; // Import DatosUsuario
import ProductosHombre from "./ProductosHombre";
import Producto from "./VerProducto"; // Import Producto
import Favoritos from "./Favoritos";
import Carrito from "./Carrito"; // Import Carrito


function App() {
  return (
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
    </Routes>
  );
}

export default App;