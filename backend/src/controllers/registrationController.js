const registrationService = require('../services/registrationService');

/**
 * Camada Controller de inscrições de voluntários em eventos.
 */
const registrationController = {
  /**
   * POST /events/:id/volunteers: inscreve um voluntário no evento.
   * @param {import('express').Request} req - Requisição com volunteer_id no body.
   * @param {import('express').Response} res - Resposta 201 com a confirmação.
   * @param {import('express').NextFunction} next - Repassa erros.
   */
  async register(req, res, next) {
    try {
      const result = await registrationService.register(
        Number(req.params.id),
        req.body.volunteer_id,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /events/:id/volunteers: lista os inscritos do evento.
   * @param {import('express').Request} req - Requisição.
   * @param {import('express').Response} res - Resposta com a lista.
   * @param {import('express').NextFunction} next - Repassa erros.
   */
  async listByEvent(req, res, next) {
    try {
      const volunteers = await registrationService.listByEvent(
        Number(req.params.id),
      );
      res.json(volunteers);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = registrationController;
