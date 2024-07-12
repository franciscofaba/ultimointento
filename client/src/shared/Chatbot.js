import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../shared/Chatbot.css";
import { useTranslation } from "react-i18next";

function Chatbot() {
  const [t, i18n] = useTranslation("global");
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: t("Chatbot.t1"),
      date: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (inputMessage.trim() === '') return;

    const newMessage = {
      sender: 'user',
      text: inputMessage,
      date: new Date(),
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    await processMessageToAssistant(newMessage.text);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  async function processMessageToAssistant(userMessage) {
    try {
      // Verificar la pregunta en la base de datos
      const dbResponse = await fetch(`http://localhost:5000/api/Respuesta/${userMessage}`, {
        method: 'GET',
      });

      const dbData = await dbResponse.json();

      if (dbData.respuesta) {
        // Si hay una respuesta en la base de datos, usarla
        const botResponse = {
          sender: 'bot',
          text: dbData.respuesta,
          date: new Date(),
        };

        setMessages(prevMessages => [...prevMessages, botResponse]);
        setIsTyping(false);
      } else {
        // Si no hay respuesta en la base de datos, llamar a la API del chatbot
        const apiResponse = await fetch('http://localhost:5000/api/executeAssistant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question: userMessage }),
        });

        const apiData = await apiResponse.text();

        const botResponse = {
          sender: 'bot',
          text: apiData || "Lo siento, no pude procesar tu mensaje.",
          date: new Date(),
        };

        setMessages(prevMessages => [...prevMessages, botResponse]);

        // Guardar la pregunta y la respuesta en la base de datos
        await fetch('http://localhost:5000/api/Pregunta', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pregunta: userMessage, respuesta: apiData }),
        });

        setIsTyping(false);
      }
    } catch (error) {
      console.error("Error processing message to assistant:", error);
      const botResponse = {
        sender: 'bot',
        text: "Lo siento, hubo un error procesando tu mensaje.",
        date: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, botResponse]);
      setIsTyping(false);
    }
  }

  return (
    <div className="chat-container card">
      <div className="card-body chat-body">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <div className="message-text">{message.text}</div>
            <div className="message-date">{message.date.toLocaleTimeString()}</div>
          </div>
        ))}
        {isTyping && (
          <div className="message bot">
            <div className="message-text">...</div>
          </div>
        )}
      </div>
      <div className="card-footer">
        <input
          type="text"
          className="form-control"
          placeholder={t("Chatbot.t2")}
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="btn btn-primary send-button" onClick={handleSend}>
        {t("Chatbot.t3")}
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
