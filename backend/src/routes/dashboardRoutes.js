const { Router } = require('express');
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = Router();

/**
 * @openapi
 * /dashboard:
 *   get:
 *     tags: [Painel]
 *     summary: Identifica o usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Usuário autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardMessage'
 *       '401':
 *         description: Token não informado, inválido ou expirado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: 'Token não informado'
 */
router.get('/', authenticateToken, dashboardController.show);

module.exports = router;
