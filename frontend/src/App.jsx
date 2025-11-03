import React, { useState, useEffect } from 'react';
import './App.css';

//const BACKEND_URL = 'http://backend-alb-437047329.us-east-1.elb.amazonaws.com';
const BACKEND_URL = 'http://localhost:8080';

function App() {
  const [backendMessage, setBackendMessage] = useState('A ligar ao backend...');
  const [dbMessage, setDbMessage] = useState('A testar o RDS...');
  const [tecnologias, setTecnologias] = useState([]); 

  useEffect(() => {
    fetch(BACKEND_URL + '/')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.text();
      })
      .then(text => setBackendMessage(text))
      .catch(err => setBackendMessage(`Erro ao ligar ao backend: ${err.message}`));

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

    fetch(BACKEND_URL + '/api/tecnologias')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => setTecnologias(data))
      .catch(err => console.error("Erro ao buscar tecnologias:", err));
      
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Meu Seminário de DevOps na AWS</h1>
        
        <div className="status-container">
          <p>
            <strong>Status do Backend:</strong> {backendMessage}
          </p>
          <p>
            <strong>Status do Banco (RDS):</strong> {dbMessage}
          </p>
        </div>

        
        <div className="tecnologias-container">
          <h2>Tecnologias Usadas neste Projeto (v1.4):</h2>
          {tecnologias.length === 0 ? (
            <p>A carregar tecnologias do backend...</p>
          ) : (
            <ul>
              {tecnologias.map(tech => (
                <li key={tech.id}>{tech.nome}</li>
              ))}
            </ul>
          )}
        </div>

      </header>
    </div>
  );
}

export default App;