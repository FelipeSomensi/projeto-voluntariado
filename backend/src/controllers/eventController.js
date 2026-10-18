const eventService = require('../services/eventService');

/**
 * Camada Controller de eventos: traduz HTTP em chamadas ao Service.
 */
const eventController = {
  /**
   * GET /events: lista todos os eventos.
   * @param {import('express').Request} req - Requisição.
   * @param {import('express').Response} res - Resposta.
   * @param {import('express').NextFunction} next - Repassa erros ao middleware.
   */
  async list(req, res, next) {
    try {
      const events = await eventService.list();
      res.json(events);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /events/:id: busca um evento.
   * @param {import('express').Request} req - Requisição.
   * @param {import('express').Response} res - Resposta.
   * @param {import('express').NextFunction} next - Repassa erros.
   */
  async getById(req, res, next) {
    try {
      const event = await eventService.getById(Number(req.params.id));
      res.json(event);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /events: cria um evento.
   * @param {import('express').Request} req - Requisição com os dados no body.
   * @param {import('express').Response} res - Resposta 201 com o evento criado.
   * @param {import('express').NextFunction} next - Repassa erros.
   */
  async create(req, res, next) {
    try {
      const event = await eventService.create(req.body);
      res.status(201).json(event);
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /events/:id: atualiza um evento.
   * @param {import('express').Request} req - Requisição.
   * @param {import('express').Response} res - Resposta com o evento atualizado.
   * @param {import('express').NextFunction} next - Repassa erros.
   */
  async update(req, res, next) {
    try {
      const event = await eventService.update(Number(req.params.id), req.body);
      res.json(event);
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /events/:id: exclui um evento.
   * @param {import('express').Request} req - Requisição.
   * @param {import('express').Response} res - Resposta 204 (sem conteúdo).
   * @param {import('express').NextFunction} next - Repassa erros.
   */
  async remove(req, res, next) {
    try {
      await eventService.remove(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};

module.exports = eventController;
