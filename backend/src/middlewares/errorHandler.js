/**
 * Middleware global de erros.
 * Converte AppError em resposta HTTP e trata erros inesperados como 500.
 * @param {Error} error - Erro lançado.
 * @param {import('express').Request} req - Requisição.
 * @param {import('express').Response} res - Resposta.
 * @param {import('express').NextFunction} next - Próximo middleware.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  const message = error.statusCode ? error.message : 'Erro interno do servidor';

  if (!error.statusCode) {
    console.error(error);
  }

  res.status(statusCode).json({ message });
}

module.exports = errorHandler;
