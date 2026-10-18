import api from '../services/api';
import { getUser } from '../services/auth';

/**
 * Loader da rota /events/:id.
 * Roda ANTES de a página ser renderizada.
 * Os inscritos só são buscados se houver usuário logado.
 */
export async function eventLoader({ params }) {
  try {
    const eventResponse = await api.get(`/events/${params.id}`);
    let volunteers = null;

    if (getUser()) {
      const volunteersResponse = await api.get(
        `/events/${params.id}/volunteers`,
      );
      volunteers = volunteersResponse.data;
    }

    return { event: eventResponse.data, volunteers };
  } catch (err) {
    throw new Error(
      err.response?.data?.message || 'Não foi possível carregar o evento.',
      { cause: err },
    );
  }
}