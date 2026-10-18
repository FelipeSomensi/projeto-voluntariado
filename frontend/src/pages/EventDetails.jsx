import { Link, useLoaderData } from 'react-router-dom';
import { formatDate } from '../utils/format';

function EventDetails() {
  const { event, volunteers } = useLoaderData();

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
          </p>

          {volunteers.length === 0 ? (
            <p>Nenhum voluntário inscrito ainda.</p>
          ) : (
            <ul className="list-group">
              {volunteers.map((volunteer) => (
                <li key={volunteer.id} className="list-group-item">
                  {volunteer.name} <small>({volunteer.email})</small>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default EventDetails;