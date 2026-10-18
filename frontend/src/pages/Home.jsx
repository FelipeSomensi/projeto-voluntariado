import { useState, useEffect } from 'react';
import api from '../services/api';
import { getUser } from '../services/auth';

function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await api.get('/dashboard');
        setData(response.data);
      } catch (err) {
        console.error('Erro ao carregar o painel:', err);
        setError('Erro ao carregar o painel.');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="lead">{data.message}</p>
      <p>
        Usuário: <strong>{data.user}</strong>
        <br />
        Perfil: <strong>{getUser().role}</strong>
      </p>
    </div>
  );
}

export default Home;