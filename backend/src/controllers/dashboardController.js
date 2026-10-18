/**
 * Camada Controller do painel.
 */
const dashboardController = {
  /**
   * GET /dashboard: identifica o usuário autenticado.
   * @param {import('express').Request} req - Requisição (com req.user preenchido).
   * @param {import('express').Response} res - Resposta com mensagem e e-mail.
   */
  show(req, res) {
    res.json({ message: 'Bem-vindo ao painel', user: req.user.email });
  },
};

module.exports = dashboardController;
