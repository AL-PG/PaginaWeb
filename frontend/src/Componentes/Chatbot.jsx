import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  const toggleChat = () => setIsOpen(!isOpen);

  // 1) Cuando se abre el chat por primera vez, saludo inicial
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          from: 'bot',
          text: '¡Hola! 👋 Soy tu asistente personal de Trendify. ¿Cómo puedo ayudarte hoy?'
        }
      ]);
    }
  }, [isOpen, messages.length]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const res = await axios.post('http://localhost/Trendify/backend/chat.php', { message: userMessage.text });

      // 🔥 Aquí imprimes los mensajes debug del backend
      console.log('Respuesta completa del backend:', res.data);
      console.log('DEBUG backend:', res.data.debug);

      const botMessage = {
        from: 'bot',
        text: res.data.response,
        productos: res.data.productos || []
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error en la petición:', error);
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: 'Error de conexión, intenta más tarde.' }
      ]);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-[#D99D6C] text-white p-4 rounded-full shadow-lg hover:bg-[#C68B5F] transition z-50"
      >
        {isOpen ? <X /> : <MessageSquare />}
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden z-50"
        >
          <div className="bg-[#D99D6C] text-white p-4 font-bold text-lg">Trendify Bot</div>

          <div className="flex-1 p-3 space-y-2 overflow-y-auto max-h-80 text-sm font-[Montserrat]">
            {messages.map((msg, idx) => (
              <div key={idx} className="space-y-1">
                <div
                  className={`p-2 rounded-lg max-w-[70%] ${
                    msg.from === 'user' ? 'bg-black text-white ml-auto' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.productos && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {msg.productos.map((p, i) => (
                      <div
                        key={i}
                        className="bg-white border rounded-lg p-1 text-center cursor-pointer"
                        onClick={() => navigate('/producto', { state: { producto: p } })}
                      >
                        <img
                          src={p.url_imagen}
                          alt={p.nombre_producto}
                          className="w-full h-16 object-cover rounded"
                        />
                        <p className="text-xs font-[Montserrat]">{p.nombre_producto}</p>
                        <p className="text-xs font-bold">MXN {p.precio}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="flex border-t p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Escribe tu mensaje..."
              className="flex-1 text-sm font-[Montserrat] p-2 border rounded-lg mr-2"
            />
            <button
              onClick={sendMessage}
              className="bg-[#D99D6C] text-white px-3 rounded-lg hover:bg-[#C68B5F]"
            >
              Enviar
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Chatbot;
