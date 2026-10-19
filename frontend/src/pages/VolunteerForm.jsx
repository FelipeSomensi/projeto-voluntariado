import { useState } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import api from '../services/api';

const emptyForm = { name: '', email: '', phone: '' };

function VolunteerForm() {
  // Na edição o loader devolve o voluntário. Na criação não há loader.
  const volunteer = useLoaderData();
  const isEdit = Boolean(volunteer);
  const navigate = useNavigate();

  const [form, setForm] = useState(
    isEdit
      ? {
          name: volunteer.name,
          email: volunteer.email,
          phone: volunteer.phone ?? '',
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

    try {
      if (isEdit) {
        await api.put(`/volunteers/${volunteer.id}`, form);
      } else {
        await api.post('/volunteers', form);
      }
      navigate('/volunteers');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Não foi possível salvar o voluntário.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <Link to="/volunteers">&larr; Voltar para os voluntários</Link>

      <h1 className="mt-3 mb-4">
        {isEdit ? 'Editar voluntário' : 'Novo voluntário'}
      </h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="name">
            Nome
          </label>
          <input
            id="name"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="phone">
            Telefone
          </label>
          <input
            id="phone"
            name="phone"
            className="form-control"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}

export default VolunteerForm;
