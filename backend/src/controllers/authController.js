const userService = require('../services/userService');

/**
 * Camada Controller de autenticação.
 */
const authController = {
  /**
   * POST /auth/register: cadastra um novo usuário.
   * @param {import('express').Request} req - Requisição com email e password no body.
   * @param {import('express').Response} res - Resposta 201 com o usuário criado.
   * @param {import('express').NextFunction} next - Repassa erros.
   */
  async register(req, res, next) {
    try {
      const user = await userService.registerUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /auth/login: autentica e devolve o token JWT.
   * @param {import('express').Request} req - Requisição com email e password no body.
   * @param {import('express').Response} res - Resposta com o token.
   * @param {import('express').NextFunction} next - Repassa erros.
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await userService.loginUser(email, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
