import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { isAdmin } from '../services/auth';

function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const admin = isAdmin();

  useEffect(() => {
    async function fetchVolunteers() {
      try {
        const response = await api.get('/volunteers');
        setVolunteers(response.data);
      } catch (err) {
        console.error('Erro ao carregar voluntários:', err);
        setError(
          err.code === 'ECONNABORTED'
            ? 'O carregamento dos voluntários demorou demais. Tente novamente.'
            : 'Erro ao carregar voluntários.',
        );
      } finally {
        setLoading(false);
      }
    }
    fetchVolunteers();
  }, []);

  async function handleDelete(volunteer) {
    const confirmed = window.confirm(
      `Excluir o voluntário "${volunteer.name}"? As inscrições dele também serão removidas.`,
    );
    if (!confirmed) return;

    setActionError(null);
    try {
      await api.delete(`/volunteers/${volunteer.id}`);
      setVolunteers((current) =>
        current.filter((item) => item.id !== volunteer.id),
      );
    } catch (err) {
      setActionError(
        err.response?.data?.message || 'Erro ao excluir o voluntário.',
      );
    }
  }

  if (loading) return <p>Carregando...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Voluntários</h1>
        {admin && (
          <Link className="btn btn-primary" to="/volunteers/new">
            Novo voluntário
          </Link>
        )}
      </div>

      {actionError && <div className="alert alert-danger">{actionError}</div>}

      {volunteers.length === 0 ? (
        <p>Nenhum voluntário encontrado.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((volunteer) => (
                <tr key={volunteer.id}>
                  <td>{volunteer.name}</td>
                  <td>{volunteer.email}</td>
                  <td>{volunteer.phone || '-'}</td>
                  <td className="text-end">
                    {admin && (
                      <>
                        <Link
                          className="btn btn-sm btn-outline-secondary me-2"
                          to={`/volunteers/${volunteer.id}/edit`}
                        >
                          Editar
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(volunteer)}
                        >
                          Excluir
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Volunteers;
