import api from '../services/api';

/**
 * Loader da rota /volunteers/:id/edit.
 * Busca o voluntário para preencher o formulário de edição.
 */
export async function volunteerEditLoader({ params }) {
  try {
    const response = await api.get(`/volunteers/${params.id}`);
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || 'Não foi possível carregar o voluntário.',
      { cause: err },
    );
  }
}
