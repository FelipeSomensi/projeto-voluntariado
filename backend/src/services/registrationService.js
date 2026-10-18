const eventModel = require('../models/eventModel');
const volunteerModel = require('../models/volunteerModel');
const registrationModel = require('../models/registrationModel');
const AppError = require('../utils/AppError');

/**
 * Camada Service de inscrições: regra do limite de voluntários por evento.
 */
const registrationService = {
  /**
   * Inscreve um voluntário em um evento.
   * @param {number} eventId - Id do evento.
   * @param {number} volunteerId - Id do voluntário.
   * @returns {Promise<Object>} Mensagem de sucesso com os ids.
   * @throws {AppError} 400 se faltar id ou o evento estiver lotado;
   * 404 se evento ou voluntário não existirem; 409 se já estiver inscrito.
   */
  async register(eventId, volunteerId) {
    if (!Number.isInteger(volunteerId)) {
      throw new AppError(
        'volunteer_id é obrigatório e deve ser um número',
        400,
      );
    }

    const event = await eventModel.findById(eventId);
    if (!event) {
      throw new AppError('Evento não encontrado', 404);
    }

    const volunteer = await volunteerModel.findById(volunteerId);
    if (!volunteer) {
      throw new AppError('Voluntário não encontrado', 404);
    }

    if (await registrationModel.exists(volunteerId, eventId)) {
      throw new AppError('Voluntário já inscrito neste evento', 409);
    }

    const registered = await eventModel.countRegistrations(eventId);
    if (registered >= event.max_volunteers) {
      throw new AppError('Evento lotado: limite de voluntários atingido', 400);
    }

    await registrationModel.create(volunteerId, eventId);
    return {
      message: 'Inscrição realizada com sucesso',
      event_id: eventId,
      volunteer_id: volunteerId,
    };
  },

  /**
   * Lista os voluntários inscritos em um evento.
   * @param {number} eventId - Id do evento.
   * @returns {Promise<Array>} Voluntários inscritos.
   * @throws {AppError} 404 se o evento não existir.
   */
  async listByEvent(eventId) {
    const event = await eventModel.findById(eventId);
    if (!event) {
      throw new AppError('Evento não encontrado', 404);
    }
    return registrationModel.findVolunteersByEvent(eventId);
  },
};

module.exports = registrationService;
