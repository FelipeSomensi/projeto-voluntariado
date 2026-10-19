import { useState } from 'react';
import { Link, useLoaderData, useRevalidator } from 'react-router-dom';
import api from '../services/api';
import { formatDate } from '../utils/format';

function EventDetails() {
  const { event, volunteers, allVolunteers } = useLoaderData();
  const revalidator = useRevalidator();

  const [selectedId, setSelectedId] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState(null);

  const isFull =
    volunteers !== null && volunteers.length >= event.max_volunteers;

  // Voluntários que ainda não estão inscritos neste evento
  const available = allVolunteers
    ? allVolunteers.filter(
        (volunteer) => !volunteers.some((item) => item.id === volunteer.id),
      )
    : [];

  async function handleEnroll(submitEvent) {
    submitEvent.preventDefault();
    setMessage(null);
    setEnrolling(true);

    try {
      await api.post(`/events/${event.id}/volunteers`, {
        volunteer_id: Number(selectedId),
      });
      setSelectedId('');
      setMessage({ type: 'success', text: 'Voluntário inscrito com sucesso.' });
      revalidator.revalidate(); // roda o loader de novo e atualiza a lista
    } catch (err) {
      setMessage({
        type: 'danger',
        text:
          err.response?.data?.message ||
          'Não foi possível realizar a inscrição.',
      });
    } finally {
      setEnrolling(false);
    }
  }

  return (
    <div>
      <Link to="/events">&larr; Voltar para os eventos</Link>

      <h1 className="mt-3">{event.title}</h1>
      <p className="lead">{event.description || 'Sem descrição.'}</p>

      <ul className="list-unstyled">
        <li>
          <strong>Local:</strong> {event.location}
        </li>
        <li>
          <strong>Data:</strong> {formatDate(event.event_date)}
        </li>
        <li>
          <strong>Limite de voluntários:</strong> {event.max_volunteers}
        </li>
      </ul>

      <h2 className="h4 mt-4">Voluntários inscritos</h2>

      {volunteers === null && (
        <div className="alert alert-info">
          Faça login para ver os voluntários inscritos.
        </div>
      )}

      {volunteers !== null && (
        <>
          <p>
            {volunteers.length} de {event.max_volunteers} vagas preenchidas
            {isFull && <span className="badge bg-danger ms-2">Lotado</span>}
          </p>

          {volunteers.length === 0 ? (
            <p>Nenhum voluntário inscrito ainda.</p>
          ) : (
            <ul className="list-group mb-4">
              {volunteers.map((volunteer) => (
                <li key={volunteer.id} className="list-group-item">
                  {volunteer.name} <small>({volunteer.email})</small>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {allVolunteers && (
        <div className="card">
          <div className="card-body">
            <h3 className="h5">Inscrever voluntário</h3>

            {message && (
              <div className={`alert alert-${message.type}`}>
                {message.text}
              </div>
            )}

            {isFull ? (
              <p className="mb-0">
                Evento lotado: o limite de voluntários foi atingido.
              </p>
            ) : available.length === 0 ? (
              <p className="mb-0">
                Todos os voluntários cadastrados já estão inscritos.
              </p>
            ) : (
              <form className="d-flex gap-2" onSubmit={handleEnroll}>
                <select
                  className="form-select"
                  value={selectedId}
                  onChange={(changeEvent) =>
                    setSelectedId(changeEvent.target.value)
                  }
                  required
                >
                  <option value="">Selecione um voluntário</option>
                  {available.map((volunteer) => (
                    <option key={volunteer.id} value={volunteer.id}>
                      {volunteer.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={enrolling}
                >
                  {enrolling ? 'Inscrevendo...' : 'Inscrever'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EventDetails;
