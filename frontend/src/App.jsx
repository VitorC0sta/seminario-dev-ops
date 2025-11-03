import React, { useState, useEffect } from 'react';
import './App.css'; 

//const BACKEND_URL = 'http://localhost:8080'; 
const BACKEND_URL = 'http://backend-alb-437047329.us-east-1.elb.amazonaws.com'; 

const StatusIndicator = ({ status }) => {
  const getStatusClass = () => {
    if (status === 'operational') return 'status-dot operational';
    if (status === 'outage') return 'status-dot outage';
    return 'status-dot loading'; 
  };
  const getStatusText = () => {
    if (status === 'operational') return 'Operacional';
    if (status === 'outage') return 'Falha / Indisponível';
    return 'Verificando...';
  };
  return (
    <div className="status-item">
      <span className={getStatusClass()}></span>
      <span>{getStatusText()}</span>
    </div>
  );
};

function App() {
  const [guestbook, setGuestbook] = useState([]);
  const [guestName, setGuestName] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [systemStatus, setSystemStatus] = useState({ backend: null, database: null });
  const [lastCheckTime, setLastCheckTime] = useState(null);

  const fetchGuestbook = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/guestbook`);
      const data = await res.json();
      setGuestbook(data);
    } catch (err) {
      console.error("Erro ao buscar recados:", err);
      setError("Não foi possível carregar os recados.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!guestName || !guestMessage) {
      setError("Por favor, preencha o seu nome e o recado.");
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/guestbook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: guestName, message: guestMessage }),
      });
      if (!res.ok) throw new Error(`O servidor respondeu com ${res.status}`);
      setGuestName('');
      setGuestMessage('');
      fetchGuestbook();
    } catch (err) {
      setError(`Erro ao enviar o recado: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem a certeza que quer apagar este recado?")) {
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/api/guestbook/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`O servidor respondeu com ${res.status}`);
      fetchGuestbook();
    } catch (err) {
      setError(`Erro ao apagar o recado: ${err.message}`);
    }
  };

  const fetchSystemStatus = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/system-status`);
      if (!res.ok) throw new Error('Falha na verificação de status');
      const data = await res.json();
      setSystemStatus({
        backend: data.backendStatus,
        database: data.databaseStatus
      });
      setLastCheckTime(new Date(data.lastChecked));
    } catch (err) {
      console.error("Erro ao buscar status do sistema:", err);
      setSystemStatus({ backend: 'outage', database: 'outage' });
      setLastCheckTime(new Date());
    }
  };

  useEffect(() => {
    fetchGuestbook(); 
    fetchSystemStatus(); 
  }, []);

  return (
    <div className="container">
      <header>
        <h1>Seminário DevOps v1.5</h1>
        <p className="subtitle">Aplicação Full-Stack com Monitor de Status e Mural de Recados</p>
      </header>

      <div className="content-grid">
        <div className="guestbook-container">
          <h2>Mural de Recados</h2>
          <form onSubmit={handleSubmit} className="guestbook-form">
            <input
              type="text"
              placeholder="Seu nome"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              disabled={submitting}
            />
            <textarea
              placeholder="Deixe seu recado..."
              value={guestMessage}
              onChange={(e) => setGuestMessage(e.target.value)}
              disabled={submitting}
            />
            <button type="submit" disabled={submitting}>
              {submitting ? 'Enviando...' : 'Enviar Recado'}
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>
          <div className="guestbook-list">
            {guestbook.length === 0 && !error ? (
              <p>Carregando recados...</p>
            ) : (
              guestbook.map(entry => (
                <div key={entry.id} className="guestbook-entry">
                  <button className="delete-button" onClick={() => handleDelete(entry.id)}>X</button>
                  <strong>{entry.name}:</strong>
                  <p>{entry.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="status-monitor-container">
          <h2>Status do Sistema (v1.5)</h2>
          <ul className="status-list">
            <li>
              <span>Serviço de Backend</span>
              <StatusIndicator status={systemStatus.backend} />
            </li>
            <li>
              <span>Banco de Dados (RDS)</span>
              <StatusIndicator status={systemStatus.database} />
            </li>
          </ul>
          <p className="status-footer">
            Última verificação: 
            {lastCheckTime ? lastCheckTime.toLocaleTimeString('pt-PT') : '...'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;

