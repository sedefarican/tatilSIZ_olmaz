import React, { useState } from 'react';

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [geminiResponse, setGeminiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleAssistant = () => setIsOpen(!isOpen);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return; // Boş mesaj göndermeyi engelle

    setIsLoading(true);
    setGeminiResponse(''); // Önceki cevabı temizle
    setError(''); // Hataları temizle

    try {
      const response = await fetch('http://localhost:5000/api/ask-gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend hata yanıtı:', errorData);
        throw new Error(`HTTP error! Status: ${response.status}, Mesaj: ${errorData.error || 'Bilinmeyen hata'}`);
      }

      const data = await response.json();
      setGeminiResponse(data.response);
      setInputText(''); // Mesaj gönderdikten sonra inputu temizle
    } catch (err) {
      console.error('Mesaj gönderme hatası:', err);
      setError(`Mesaj gönderilirken bir hata oluştu: ${err.message}. Lütfen backend konsolunu kontrol edin.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="floating-assistant">
      {isOpen && (
        <div className="assistant-menu"
          style={{ 
            flexGrow: 1,
            overflow:'auto',
            position: 'fixed',
            bottom: '140px', 
            right: '20px',
            width: '300px',
            height: 'auto',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
            padding: '15px',
            display: 'flex',
            flexDirection: 'column', 
            justifyContent: 'space-between', 
            zIndex: 999 
          }}
        >
          <hr style={{ margin: '10px 0', borderColor: '#eee' }} /> 

          <div className="gemini-chat-area" style={{
            flexGrow: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            overflowY: 'auto',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            backgroundColor: '#f9f9f9',
            marginBottom: '10px'
          }}>
            {geminiResponse && (
              <div className="gemini-response" style={{ marginBottom: '10px', whiteSpace: 'pre-wrap', backgroundColor: '#e6f7ff', padding: '8px', borderRadius: '4px' }}>
                <strong>Asistan:</strong> {geminiResponse}
              </div>
            )}
            {error && <div style={{ color: 'red', marginBottom: '10px', padding: '5px', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>{error}</div>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Merhaba! Size nasıl yardımcı olabilirim?"
              rows="3"
              style={{ width: 'calc(100% - 16px)', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical', marginBottom: '5px' }}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputText.trim()}
              style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', opacity: (isLoading || !inputText.trim()) ? 0.6 : 1 }}
            >
              {isLoading ? 'Gönderiliyor...' : 'Gönder'}
            </button>
          </div>
        </div>
      )}
      <button className="assistant-toggle" onClick={toggleAssistant} style={{
        position: 'fixed',
        bottom: '60px',
        right: '40px',
        width: '60px',
        height: '70px',
        borderRadius: '50%',
        backgroundColor: '#007bff',
        color: 'white',
        fontSize: '30px',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        ☁️
      </button>
    </div>
  );
}
