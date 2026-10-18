/**
 * Erro de aplicação com código HTTP associado.
 * Lançado pelo Service e traduzido em resposta pelo Controller.
 */
class AppError extends Error {
  /**
   * @param {string} message - Mensagem do erro.
   * @param {number} statusCode - Código HTTP (400, 404, 409...).
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = AppError;
