const eventModel = require('../models/eventModel');
const AppError = require('../utils/AppError');

/**
 * Camada Service de eventos: regras de negócio.
 */
const eventService = {
  /**
   * Lista todos os eventos.
   * @returns {Promise<Array>} Lista de eventos.
   */
  async list() {
    return eventModel.findAll();
  },

  /**
   * Busca um evento pelo id.
   * @param {number} id - Id do evento.
   * @returns {Promise<Object>} O evento encontrado.
   * @throws {AppError} 404 se o evento não existir.
   */
  async getById(id) {
    const event = await eventModel.findById(id);
    if (!event) {
      throw new AppError('Evento não encontrado', 404);
    }
    return event;
  },

  /**
   * Cria um evento após validar os dados.
   * @param {Object} data - Dados do evento.
   * @returns {Promise<Object>} O evento criado.
   * @throws {AppError} 400 se os dados forem inválidos.
   */
  async create(data) {
    validateEventData(data);
    const id = await eventModel.create(data);
    return eventModel.findById(id);
  },

  /**
   * Atualiza um evento.
   * Impede reduzir o limite abaixo do número de inscritos atuais.
   * @param {number} id - Id do evento.
   * @param {Object} data - Novos dados.
   * @returns {Promise<Object>} O evento atualizado.
   * @throws {AppError} 404 se não existir; 400 se os dados forem inválidos.
   */
  async update(id, data) {
    await this.getById(id);
    validateEventData(data);

    const registered = await eventModel.countRegistrations(id);
    if (data.max_volunteers < registered) {
      throw new AppError(
        `O limite não pode ser menor que os ${registered} voluntários já inscritos`,
        400,
      );
    }

    await eventModel.update(id, data);
    return eventModel.findById(id);
  },

  /**
   * Exclui um evento.
   * @param {number} id - Id do evento.
   * @throws {AppError} 404 se o evento não existir.
   */
  async remove(id) {
    await this.getById(id);
    await eventModel.remove(id);
  },
};

/**
 * Valida os campos obrigatórios de um evento.
 * @param {Object} data - Dados do evento.
 * @throws {AppError} 400 se algum campo for inválido.
 */
function validateEventData({ title, location, event_date, max_volunteers }) {
  if (!title || !location || !event_date) {
    throw new AppError('Título, local e data são obrigatórios', 400);
  }
  if (!Number.isInteger(max_volunteers) || max_volunteers < 1) {
    throw new AppError(
      'O limite de voluntários deve ser um número inteiro maior que zero',
      400,
    );
    
  }
}

module.exports = eventService;
