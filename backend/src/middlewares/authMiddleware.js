const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

/**
 * Exige um token JWT válido no header Authorization (Bearer TOKEN).
 * Se válido, coloca o payload em req.user.
 * @param {import('express').Request} req - Requisição.
 * @param {import('express').Response} res - Resposta.
 * @param {import('express').NextFunction} next - Próximo middleware.
 */
function authenticateToken(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('Token não informado', 401));
  }

  const token = header.split(' ')[1];

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    next(new AppError('Token inválido ou expirado', 401));
  }
}

/**
 * Cria um middleware que só deixa passar usuários com um dos perfis informados.
 * Deve ser usado depois de authenticateToken.
 * @param {...string} allowedRoles - Perfis permitidos (ex.: 'admin').
 * @returns {import('express').RequestHandler} Middleware de autorização.
 */
function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(
        new AppError('Você não tem permissão para acessar este recurso', 403),
      );
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRole };
