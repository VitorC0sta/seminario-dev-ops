import React, { useState, useEffect } from 'react';
import './App.css';

const BACKEND_URL = 'http://backend-alb-437047329.us-east-1.elb.amazonaws.com';

function App() {
  const [backendMessage, setBackendMessage] = useState('Carregando...');
  const [dbMessage, setDbMessage] = useState('Testando DB...');

  useEffect(() => {
    // 1. Testa o endpoint /
    fetch(BACKEND_URL + '/')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.text();
      })
      .then(text => setBackendMessage(text))
      .catch(err => setBackendMessage(`Erro ao conectar no backend: ${err.message}`));

    // 2. Testa o endpoint /test-db
    fetch(BACKEND_URL + '/test-db')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.message.includes('SUCESSO')) {
          setDbMessage(`Sucesso! Hora do banco: ${data.db_time}`);
        } else {
          setDbMessage(`Falha: ${data.message}`);
        }
      })
      .catch(err => setDbMessage(`Erro ao chamar /test-db: ${err.message}`));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Meu App de Seminário DevOps (v1.1)</h1>
        <p>
          <strong>Status do Backend:</strong> {backendMessage}
        </p>
        <p>
          <strong>Status do Banco (RDS):</strong> {dbMessage}
        </p>
      </header>
    </div>
  );
}

export default App;
