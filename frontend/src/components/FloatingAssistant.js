import React, { useState } from 'react';


export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAssistant = () => setIsOpen(!isOpen);

  return (
    <div className="floating-assistant">
      {isOpen && (
        <div className="assistant-menu">
          <button className="assistant-button">☀️ Bana Uygunu Bul!</button>
          <button className="assistant-button">📞 Telefon</button>
          <button className="assistant-button">📧 Email</button>
          <button className="assistant-button">📝 Feedback</button>
        </div>
      )}
      <button className="assistant-toggle" onClick={toggleAssistant}>
      ☁️
      </button>
    </div>
  );
}
