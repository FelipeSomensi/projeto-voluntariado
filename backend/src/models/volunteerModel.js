const pool = require('../config/database');

/**
 * Camada Model de voluntários: acesso direto à tabela volunteers.
 */
const volunteerModel = {
  /**
   * Lista todos os voluntários, em ordem alfabética.
   * @returns {Promise<Array>} Lista de voluntários.
   */
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM volunteers ORDER BY name');
    return rows;
  },

  /**
   * Busca um voluntário pelo id.
   * @param {number} id - Id do voluntário.
   * @returns {Promise<Object|undefined>} O voluntário, ou undefined.
   */
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM volunteers WHERE id = ?', [
      id,
    ]);
    return rows[0];
  },

  /**
   * Busca um voluntário pelo e-mail.
   * @param {string} email - E-mail do voluntário.
   * @returns {Promise<Object|undefined>} O voluntário, ou undefined.
   */
  async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM volunteers WHERE email = ?',
      [email],
    );
    return rows[0];
  },

  /**
   * Cria um voluntário.
   * @param {Object} volunteer - Dados do voluntário.
   * @param {string} volunteer.name - Nome.
   * @param {string} volunteer.email - E-mail.
   * @param {string} [volunteer.phone] - Telefone.
   * @returns {Promise<number>} Id do voluntário criado.
   */
  async create({ name, email, phone }) {
    const [result] = await pool.query(
      'INSERT INTO volunteers (name, email, phone) VALUES (?, ?, ?)',
      [name, email, phone],
    );
    return result.insertId;
  },

  /**
   * Atualiza um voluntário.
   * @param {number} id - Id do voluntário.
   * @param {Object} volunteer - Novos dados (mesmos campos do create).
   * @returns {Promise<boolean>} true se algum registro foi alterado.
   */
  async update(id, { name, email, phone }) {
    const [result] = await pool.query(
      'UPDATE volunteers SET name = ?, email = ?, phone = ? WHERE id = ?',
      [name, email, phone, id],
    );
    return result.affectedRows > 0;
  },

  /**
   * Exclui um voluntário (as inscrições dele somem por ON DELETE CASCADE).
   * @param {number} id - Id do voluntário.
   * @returns {Promise<boolean>} true se foi excluído.
   */
  async remove(id) {
    const [result] = await pool.query('DELETE FROM volunteers WHERE id = ?', [
      id,
    ]);
    return result.affectedRows > 0;
  },
};

module.exports = volunteerModel;
