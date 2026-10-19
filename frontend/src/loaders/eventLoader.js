import api from '../services/api';
import { getUser, isAdmin } from '../services/auth';

/**
 * Loader da rota /events/:id.
 * Roda ANTES de a página ser renderizada.
 * - Inscritos: só para usuário logado.
 * - Lista completa de voluntários: só para admin (usada para inscrever).
 */
export async function eventLoader({ params }) {
  try {
    const eventResponse = await api.get(`/events/${params.id}`);
    let volunteers = null;
    let allVolunteers = null;

    if (getUser()) {
      const registered = await api.get(`/events/${params.id}/volunteers`);
      volunteers = registered.data;
    }

    if (isAdmin()) {
      const all = await api.get('/volunteers');
      allVolunteers = all.data;
    }

    return { event: eventResponse.data, volunteers, allVolunteers };
  } catch (err) {
    throw new Error(
      err.response?.data?.message || 'Não foi possível carregar o evento.',
      { cause: err },
    );
  }
}
