const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Autenticação]
 *     summary: Cadastra um novo usuário com perfil user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Credentials'
 *     responses:
 *       '201':
 *         description: Usuário cadastrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisteredUser'
 *       '400':
 *         description: E-mail ou senha ausente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: 'E-mail e senha são obrigatórios'
 *       '409':
 *         description: E-mail já cadastrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: 'E-mail já cadastrado'
 */
router.post('/register', authController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Autenticação]
 *     summary: Autentica o usuário e devolve um token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Credentials'
 *     responses:
 *       '200':
 *         description: Login realizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthToken'
 *       '400':
 *         description: E-mail ou senha ausente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: 'E-mail e senha são obrigatórios'
 *       '401':
 *         description: Credenciais inválidas.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: 'Credenciais inválidas'
 */
router.post('/login', authController.login);

module.exports = router;
