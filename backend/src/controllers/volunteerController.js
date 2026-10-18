const volunteerService = require('../services/volunteerService');

/**
 * Camada Controller de voluntários: traduz HTTP em chamadas ao Service.
 */
const volunteerController = {
  /**
   * GET /volunteers: lista os voluntários.
   * @param {import('express').Request} req - Requisição.
   * @param {import('express').Response} res - Resposta com a lista.
   * @param {import('express').NextFunction} next - Repassa erros.
   */
  async list(req, res, next) {
    try {
      res.json(await volunteerService.list());
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /volunteers/:id: busca um voluntário.
   * @param {import('express').Request} req - Requisição.
   * @param {import('express').Response} res - Resposta com o voluntário.
   * @param {import('express').NextFunction} next - Repassa erros.
   */
  async getById(req, res, next) {
    try {
      res.json(await volunteerService.getById(Number(req.params.id)));
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /volunteers: cadastra um voluntário.
   * @param {import('express').Request} req - Requisição com os dados no body.
   * @param {import('express').Response} res - Resposta 201 com o voluntário.
   * @param {import('express').NextFunction} next - Repassa erros.
   */
  async create(req, res, next) {
    try {
      const volunteer = await volunteerService.create(req.body);
      res.status(201).json(volunteer);
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /volunteers/:id: atualiza um voluntário.
   * @param {import('express').Request} req - Requisição.
   * @param {import('express').Response} res - Resposta com o voluntário atualizado.
   * @param {import('express').NextFunction} next - Repassa erros.
   */
  async update(req, res, next) {
    try {
      const volunteer = await volunteerService.update(
        Number(req.params.id),
        req.body,
      );
      res.json(volunteer);
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /volunteers/:id: exclui um voluntário.
   * @param {import('express').Request} req - Requisição.
   * @param {import('express').Response} res - Resposta 204 (sem conteúdo).
   * @param {import('express').NextFunction} next - Repassa erros.
   */
  async remove(req, res, next) {
    try {
      await volunteerService.remove(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};

module.exports = volunteerController;
