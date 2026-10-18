/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Informe apenas o token, sem a palavra Bearer.
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Credentials:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           description: E-mail do usuário.
 *           example: 'admin@ifrs.edu.br'
 *         password:
 *           type: string
 *           description: Senha em texto puro.
 *           example: '123456'
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     AuthToken:
 *       type: object
 *       required: [token]
 *       properties:
 *         token:
 *           type: string
 *           description: Token JWT com payload contendo email e role.
 *           example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *     RegisteredUser:
 *       type: object
 *       required: [id, email, role]
 *       properties:
 *         id:
 *           type: integer
 *           example: 3
 *         email:
 *           type: string
 *           example: 'novo@ifrs.edu.br'
 *         role:
 *           type: string
 *           description: Todo cadastro novo recebe o perfil user.
 *           example: user
 *     DashboardMessage:
 *       type: object
 *       required: [message, user]
 *       properties:
 *         message:
 *           type: string
 *           example: Bem-vindo ao painel
 *         user:
 *           type: string
 *           example: 'usuario@ifrs.edu.br'
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateEventInput:
 *       type: object
 *       required: [title, location, event_date, max_volunteers]
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           description: Título do evento.
 *           example: Oficina de Reciclagem
 *         description:
 *           type: string
 *           description: Descrição do evento.
 *           example: Aprender a separar e reaproveitar materiais.
 *         location:
 *           type: string
 *           minLength: 1
 *           description: Local do evento.
 *           example: Campus Bento Gonçalves
 *         event_date:
 *           type: string
 *           format: date
 *           description: Data do evento no formato AAAA-MM-DD.
 *           example: '2026-12-15'
 *         max_volunteers:
 *           type: integer
 *           minimum: 1
 *           description: Limite de voluntários inscritos.
 *           example: 6
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required: [id, title, location, event_date, max_volunteers]
 *       properties:
 *         id:
 *           type: integer
 *           minimum: 1
 *           readOnly: true
 *           description: Identificador gerado pela API.
 *           example: 1
 *         title:
 *           type: string
 *           example: Mutirão Ambiental
 *         description:
 *           type: string
 *           nullable: true
 *           example: Limpeza e plantio de mudas na margem do rio.
 *         location:
 *           type: string
 *           example: Parque da Cidade
 *         event_date:
 *           type: string
 *           format: date-time
 *           description: Data do evento, devolvida em formato ISO.
 *           example: '2026-12-05T00:00:00.000Z'
 *         max_volunteers:
 *           type: integer
 *           example: 10
 *         created_at:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           example: '2026-10-16T21:30:00.000Z'
 *     ErrorResponse:
 *       type: object
 *       required: [message]
 *       properties:
 *         message:
 *           type: string
 *           example: Evento não encontrado
 */
