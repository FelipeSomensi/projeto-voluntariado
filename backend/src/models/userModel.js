const pool = require('../config/database');

/**
 * Camada Model de usuários: acesso direto ao banco de dados.
 */
const userModel = {
  /**
   * Busca um usuário pelo e-mail.
   * @param {string} email - E-mail do usuário.
   * @returns {Promise<Object|undefined>} O usuário, ou undefined se não existir.
   */
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [
      email,
    ]);
    return rows[0];
  },

  /**
   * Cria um novo usuário.
   * @param {Object} user - Dados do usuário.
   * @param {string} user.email - E-mail.
   * @param {string} user.password - Senha já criptografada (hash).
   * @param {string} user.role - Perfil ('admin' ou 'user').
   * @returns {Promise<number>} Id do usuário criado.
   */
  async create({ email, password, role }) {
    const [result] = await pool.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, password, role],
    );
    return result.insertId;
  },
};

module.exports = userModel;
