const pool = require('../config/database');

/**
 * Camada Model de eventos: acesso direto ao banco de dados.
 */
const eventModel = {
  /**
   * Lista todos os eventos, do mais próximo para o mais distante.
   * @returns {Promise<Array>} Lista de eventos.
   */
  async findAll() {
    const [rows] = await pool.query(
      'SELECT * FROM events ORDER BY event_date ASC',
    );
    return rows;
  },

  /**
   * Busca um evento pelo id.
   * @param {number} id - Id do evento.
   * @returns {Promise<Object|undefined>} O evento, ou undefined se não existir.
   */
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
    return rows[0];
  },

  /**
   * Cria um novo evento.
   * @param {Object} event - Dados do evento.
   * @param {string} event.title - Título.
   * @param {string} [event.description] - Descrição.
   * @param {string} event.location - Local.
   * @param {string} event.event_date - Data (AAAA-MM-DD).
   * @param {number} event.max_volunteers - Limite de voluntários.
   * @returns {Promise<number>} Id do evento criado.
   */
  async create({ title, description, location, event_date, max_volunteers }) {
    const [result] = await pool.query(
      `INSERT INTO events (title, description, location, event_date, max_volunteers)
       VALUES (?, ?, ?, ?, ?)`,
      [title, description, location, event_date, max_volunteers],
    );
    return result.insertId;
  },

  /**
   * Atualiza um evento existente.
   * @param {number} id - Id do evento.
   * @param {Object} event - Novos dados (mesmos campos do create).
   * @returns {Promise<boolean>} true se algum registro foi alterado.
   */
  async update(
    id,
    { title, description, location, event_date, max_volunteers },
  ) {
    const [result] = await pool.query(
      `UPDATE events
       SET title = ?, description = ?, location = ?, event_date = ?, max_volunteers = ?
       WHERE id = ?`,
      [title, description, location, event_date, max_volunteers, id],
    );
    return result.affectedRows > 0;
  },

  /**
   * Exclui um evento.
   * @param {number} id - Id do evento.
   * @returns {Promise<boolean>} true se o evento foi excluído.
   */
  async remove(id) {
    const [result] = await pool.query('DELETE FROM events WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  /**
   * Conta quantos voluntários estão inscritos em um evento.
   * @param {number} eventId - Id do evento.
   * @returns {Promise<number>} Quantidade de inscritos.
   */
  async countRegistrations(eventId) {
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS total FROM registrations WHERE event_id = ?',
      [eventId],
    );
    return rows[0].total;
  },
};

module.exports = eventModel;
