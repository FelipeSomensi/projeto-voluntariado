const { Router } = require('express');
const eventController = require('../controllers/eventController');
const registrationController = require('../controllers/registrationController');
const {
  authenticateToken,
  authorizeRole,
} = require('../middlewares/authMiddleware');

const router = Router();

/**
 * @openapi
 * /events:
 *   get:
 *     tags: [Eventos]
 *     summary: Lista os eventos (rota pública)
 *     responses:
 *       '200':
 *         description: Lista retornada com sucesso, do evento mais próximo ao mais distante.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get('/', eventController.list);

/**
 * @openapi
 * /events/{id}:
 *   get:
 *     tags: [Eventos]
 *     summary: Busca um evento pelo identificador (rota pública)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       '200':
 *         description: Evento encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       '404':
 *         description: Evento não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: 'Evento não encontrado'
 */
router.get('/:id', eventController.getById);

/**
 * @openapi
 * /events:
 *   post:
 *     tags: [Eventos]
 *     summary: Cadastra um evento (somente admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEventInput'
 *     responses:
 *       '201':
 *         description: Evento cadastrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       '400':
 *         description: Título, local, data ou limite de voluntários inválido ou ausente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: 'Título, local e data são obrigatórios'
 *       '401':
 *         description: Token não informado, inválido ou expirado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: 'Token não informado'
 *       '403':
 *         description: Usuário sem perfil admin.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: 'Você não tem permissão para acessar este recurso'
 */
router.post(
  '/',
  authenticateToken,
  authorizeRole('admin'),
  eventController.create,
);

/**
 * @openapi
 * /events/{id}:
 *   put:
 *     tags: [Eventos]
 *     summary: Atualiza um evento (somente admin)
 *     description: Não permite reduzir o limite abaixo do número de voluntários já inscritos.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEventInput'
 *     responses:
 *       '200':
 *         description: Evento atualizado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       '400':
 *         description: Dados inválidos ou limite menor que o número de inscritos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: 'O limite não pode ser menor que os 3 voluntários já inscritos'
 *       '401':
 *         description: Token não informado, inválido ou expirado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Usuário sem perfil admin.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Evento não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  eventController.update,
);

/**
 * @openapi
 * /events/{id}:
 *   delete:
 *     tags: [Eventos]
 *     summary: Exclui um evento (somente admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       '204':
 *         description: Evento excluído, sem corpo na resposta.
 *       '401':
 *         description: Token não informado, inválido ou expirado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Usuário sem perfil admin.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Evento não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  eventController.remove,
);

router.get(
  '/:id/volunteers',
  authenticateToken,
  registrationController.listByEvent,
);
router.post(
  '/:id/volunteers',
  authenticateToken,
  authorizeRole('admin'),
  registrationController.register,
);

module.exports = router;
