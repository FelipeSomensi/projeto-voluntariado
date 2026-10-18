import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { isAdmin } from '../services/auth';
import { formatDate } from '../utils/format';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const admin = isAdmin();

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await api.get('/events');
        setEvents(response.data);
      } catch (err) {
        console.error('Erro ao carregar eventos:', err);
        setError(
          err.code === 'ECONNABORTED'
            ? 'O carregamento dos eventos demorou demais. Tente novamente.'
            : 'Erro ao carregar eventos.',
        );
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  async function handleDelete(event) {
    const confirmed = window.confirm(
      `Excluir o evento "${event.title}"? As inscrições dele também serão removidas.`,
    );
    if (!confirmed) return;

    setActionError(null);
    try {
      await api.delete(`/events/${event.id}`);
      setEvents((current) => current.filter((item) => item.id !== event.id));
    } catch (err) {
      setActionError(
        err.response?.data?.message || 'Erro ao excluir o evento.',
      );
    }
  }

  if (loading) return <p>Carregando...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Eventos</h1>
        {admin && (
          <Link className="btn btn-primary" to="/events/new">
            Novo evento
          </Link>
        )}
      </div>

      {actionError && <div className="alert alert-danger">{actionError}</div>}

      {events.length === 0 ? (
        <p>Nenhum evento encontrado.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Título</th>
                <th>Local</th>
                <th>Data</th>
                <th>Vagas</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{event.location}</td>
                  <td>{formatDate(event.event_date)}</td>
                  <td>{event.max_volunteers}</td>
                  <td className="text-end">
                    <Link
                      className="btn btn-sm btn-outline-primary me-2"
                      to={`/events/${event.id}`}
                    >
                      Detalhes
                    </Link>
                    {admin && (
                      <>
                        <Link
                          className="btn btn-sm btn-outline-secondary me-2"
                          to={`/events/${event.id}/edit`}
                        >
                          Editar
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(event)}
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

export default Events;