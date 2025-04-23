import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Componentes/Header";
import Footer from "./Componentes/Footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles/datepicker.css";

const DatosUsuario = () => {
  const location = useLocation();
  const initialUser = location.state?.user || {};
  const [formData, setFormData] = useState(initialUser);
  const [selectedDate, setSelectedDate] = useState(
    new Date(initialUser.fechaNacimiento || Date.now())
  );
  const [addresses, setAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    calle: "",
    numero: "",
    colonia: "",
    ciudad: "",
    estado: "",
    cp: "",
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch(
          `http://localhost/Trendify/backend/getAddresses.php?id_usuario=${formData.idUsuario || formData.id}`
        );
        const data = await response.json();
        if (response.ok) {
          setAddresses(data.addresses || []);
        } else {
          console.error("Error fetching addresses:", data);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    if (formData.idUsuario || formData.id) {
      fetchAddresses();
    }
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const isoDate = date.toISOString().split("T")[0];
    setFormData({ ...formData, fechaNacimiento: isoDate });
  };

  const handleAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleAddAddress = async () => {
    try {
      const payload = { ...newAddress, id_usuario: formData.idUsuario || formData.id };
      const response = await fetch("http://localhost/Trendify/backend/createAddress.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setAddresses([...addresses, { ...newAddress, idDireccion: data.idDireccion }]);
        setShowModal(false);
        setNewAddress({
          calle: "",
          numero: "",
          colonia: "",
          ciudad: "",
          estado: "",
          cp: "",
        });
        alert("Dirección agregada correctamente");
      } else {
        console.error("Error adding address:", data);
        alert(`Error: ${data.message || data.error || "Error desconocido"}`);
      }
    } catch (error) {
      console.error("Error adding address:", error);
      alert("Error de conexión");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        id: formData.idUsuario || formData.id,
      };

      const response = await fetch(
        "http://localhost/Trendify/backend/updateUser.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (response.ok) {
        const fullName = `${payload.nombre} ${payload.apaterno} ${payload.amaterno}`.trim();
        const updatedUser = {
          ...payload,
          nombreCompleto: fullName,
        };
        delete updatedUser.password;
        delete updatedUser.confirmPassword;

        setFormData(updatedUser);
        alert("Datos actualizados correctamente");

        window.location.href = "/login";
      } else {
        console.error("Error response:", data);
        alert(`Error: ${data.message || data.error || "Error desconocido"}`);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Error de conexión");
    }
  };

  return (
    <div className="min-h-screen bg-[#e0e0e0] font-montserrat flex flex-col">
      <Header isLoggedIn={true} user={formData} />
      <div className="flex-grow flex flex-row bg-[#e0e0e0] px-10 py-5 gap-5">
        {/* Left Section: User Data */}
        <div className="w-1/2 p-5 bg-white rounded-lg">
          <h1 className="text-3xl font-bold my-5 font-[Konkhmer Sleokchher]">
            MIS DATOS
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="nombre" className="block text-sm font-bold">
              Nombre
            </label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              value={formData.nombre || ""}
              onChange={handleChange}
              placeholder="Nombre"
              className="w-full py-2 px-4 border rounded-full"
            />
            <label htmlFor="apaterno" className="block text-sm font-bold">
              Apellido Paterno
            </label>
            <input
              id="apaterno"
              type="text"
              name="apaterno"
              value={formData.apaterno || ""}
              onChange={handleChange}
              placeholder="Apellido Paterno"
              className="w-full py-2 px-4 border rounded-full"
            />
            <label htmlFor="amaterno" className="block text-sm font-bold">
              Apellido Materno
            </label>
            <input
              id="amaterno"
              type="text"
              name="amaterno"
              value={formData.amaterno || ""}
              onChange={handleChange}
              placeholder="Apellido Materno"
              className="w-full py-2 px-4 border rounded-full"
            />
            <label htmlFor="email" className="block text-sm font-bold">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="Email"
              className="w-full py-2 px-4 border rounded-full"
            />
            <label htmlFor="fechaNacimiento" className="block text-sm font-bold">
              Fecha de Nacimiento
            </label>
            <DatePicker
              id="fechaNacimiento"
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              className="w-full py-2 px-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#c08b5c]"
              placeholderText="Selecciona tu fecha de nacimiento"
            />
            <label htmlFor="genero" className="block text-sm font-bold">
              Género
            </label>
            <select
              id="genero"
              name="genero"
              value={formData.genero || "O"}
              onChange={handleChange}
              className="w-full py-2 px-4 border rounded-full"
            >
              <option value="H">Hombre</option>
              <option value="M">Mujer</option>
              <option value="O">Otro</option>
            </select>
            <label htmlFor="password" className="block text-sm font-bold">
              Nueva Contraseña
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              placeholder="Nueva Contraseña"
              className="w-full py-2 px-4 border rounded-full"
            />
            <label htmlFor="confirmPassword" className="block text-sm font-bold">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword || ""}
              onChange={handleChange}
              placeholder="Confirmar Contraseña"
              className="w-full py-2 px-4 border rounded-full"
            />
            <button
              type="submit"
              className="w-full py-3 mt-10 bg-[#c08b5c] text-white rounded-full hover:bg-[#a06f4b] font-konkhmer uppercase"
            >
              Guardar Cambios
            </button>
          </form>
        </div>

        {/* Right Section: Addresses */}
        <div className="w-1/2 p-5 bg-white rounded-lg ">
          <h1 className="text-3xl font-bold my-5 font-[Konkhmer Sleokchher]">
            MIS DIRECCIONES
          </h1>
          <ul className="space-y-4">
            {addresses.map((address) => (
              <li key={address.idDireccion} className="border p-4 rounded-lg">
                <p><strong>Calle:</strong> {address.calle}</p>
                <p><strong>Número:</strong> {address.numero}</p>
                <p><strong>Colonia:</strong> {address.colonia}</p>
                <p><strong>Ciudad:</strong> {address.ciudad}</p>
                <p><strong>Estado:</strong> {address.estado}</p>
                <p><strong>CP:</strong> {address.cp}</p>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setShowModal(true)}
            className="mt-5 py-2 px-4 bg-[#c08b5c] text-white rounded-full hover:bg-[#a06f4b] font-konkhmer uppercase"
          >
            Agregar Dirección
          </button>
        </div>
      </div>

      {/* Modal for Adding Address */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg w-1/3">
            <h3 className="text-xl font-bold mb-4">Agregar Dirección</h3>
            <form className="space-y-4">
              <input
                type="text"
                name="calle"
                value={newAddress.calle}
                onChange={handleAddressChange}
                placeholder="Calle"
                className="w-full py-2 px-4 border rounded-full"
              />
              <input
                type="text"
                name="numero"
                value={newAddress.numero}
                onChange={handleAddressChange}
                placeholder="Número"
                className="w-full py-2 px-4 border rounded-full"
              />
              <input
                type="text"
                name="colonia"
                value={newAddress.colonia}
                onChange={handleAddressChange}
                placeholder="Colonia"
                className="w-full py-2 px-4 border rounded-full"
              />
              <input
                type="text"
                name="ciudad"
                value={newAddress.ciudad}
                onChange={handleAddressChange}
                placeholder="Ciudad"
                className="w-full py-2 px-4 border rounded-full"
              />
              <select
                name="estado"
                value={newAddress.estado}
                onChange={handleAddressChange}
                className="w-full py-2 px-4 border rounded-full"
              >
                <option value="">Selecciona un estado</option>
                <option value="Aguascalientes">Aguascalientes</option>
                <option value="Baja California">Baja California</option>
                <option value="Baja California Sur">Baja California Sur</option>
                <option value="Campeche">Campeche</option>
                <option value="Chiapas">Chiapas</option>
                <option value="Chihuahua">Chihuahua</option>
                <option value="Ciudad de México">Ciudad de México</option>
                <option value="Coahuila">Coahuila</option>
                <option value="Colima">Colima</option>
                <option value="Durango">Durango</option>
                <option value="Estado de México">Estado de México</option>
                <option value="Guanajuato">Guanajuato</option>
                <option value="Guerrero">Guerrero</option>
                <option value="Hidalgo">Hidalgo</option>
                <option value="Jalisco">Jalisco</option>
                <option value="Michoacán">Michoacán</option>
                <option value="Morelos">Morelos</option>
                <option value="Nayarit">Nayarit</option>
                <option value="Nuevo León">Nuevo León</option>
                <option value="Oaxaca">Oaxaca</option>
                <option value="Puebla">Puebla</option>
                <option value="Querétaro">Querétaro</option>
                <option value="Quintana Roo">Quintana Roo</option>
                <option value="San Luis Potosí">San Luis Potosí</option>
                <option value="Sinaloa">Sinaloa</option>
                <option value="Sonora">Sonora</option>
                <option value="Tabasco">Tabasco</option>
                <option value="Tamaulipas">Tamaulipas</option>
                <option value="Tlaxcala">Tlaxcala</option>
                <option value="Veracruz">Veracruz</option>
                <option value="Yucatán">Yucatán</option>
                <option value="Zacatecas">Zacatecas</option>
              </select>
              <input
                type="text"
                name="cp"
                value={newAddress.cp}
                onChange={handleAddressChange}
                placeholder="Código Postal"
                className="w-full py-2 px-4 border rounded-full"
              />
              <button
                type="button"
                onClick={handleAddAddress}
                className="w-full py-3 bg-[#c08b5c] text-white rounded-full hover:bg-[#a06f4b] font-konkhmer uppercase"
              >
                Guardar Dirección
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full py-3 mt-2 bg-gray-300 text-black rounded-full hover:bg-gray-400 font-konkhmer uppercase"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default DatosUsuario;
