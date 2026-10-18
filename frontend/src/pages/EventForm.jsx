import { useState } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toDateInput } from '../utils/format';

const emptyForm = {
  title: '',
  description: '',
  location: '',
  event_date: '',
  max_volunteers: '',
};

function EventForm() {
  // Na edição o loader devolve o evento. Na criação não há loader.
  const event = useLoaderData();
  const isEdit = Boolean(event);
  const navigate = useNavigate();

  const [form, setForm] = useState(
    isEdit
      ? {
          title: event.title,
          description: event.description ?? '',
          location: event.location,
          event_date: toDateInput(event.event_date),
          max_volunteers: event.max_volunteers,
        }
      : emptyForm,
  );
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  function handleChange(changeEvent) {
    const { name, value } = changeEvent.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(submitEvent) {
    submitEvent.preventDefault();
    setError(null);
    setSaving(true);

    // O campo numérico chega como texto, e a API exige número inteiro
    const payload = { ...form, max_volunteers: Number(form.max_volunteers) };

    try {
      if (isEdit) {
        await api.put(`/events/${event.id}`, payload);
      } else {
        await api.post('/events', payload);
      }
      navigate('/events');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Não foi possível salvar o evento.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <Link to="/events">&larr; Voltar para os eventos</Link>

      <h1 className="mt-3 mb-4">{isEdit ? 'Editar evento' : 'Novo evento'}</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="title">
            Título
          </label>
          <input
            id="title"
            name="title"
            className="form-control"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="description">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            rows={3}
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="location">
            Local
          </label>
          <input
            id="location"
            name="location"
            className="form-control"
            value={form.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label" htmlFor="event_date">
              Data
            </label>
            <input
              id="event_date"
              name="event_date"
              type="date"
              className="form-control"
              value={form.event_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label" htmlFor="max_volunteers">
              Limite de voluntários
            </label>
            <input
              id="max_volunteers"
              name="max_volunteers"
              type="number"
              min="1"
              className="form-control"
              value={form.max_volunteers}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}

export default EventForm;