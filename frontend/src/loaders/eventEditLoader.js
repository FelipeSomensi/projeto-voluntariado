import api from '../services/api';

/**
 * Loader da rota /events/:id/edit.
 * Busca o evento para preencher o formulário de edição.
 */
export async function eventEditLoader({ params }) {
  try {
    const response = await api.get(`/events/${params.id}`);
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || 'Não foi possível carregar o evento.',
      { cause: err },
    );
  }
}
