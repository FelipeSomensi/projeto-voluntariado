const pool = require('../config/database');

/**
 * Camada Model de inscrições: acesso direto à tabela registrations.
 */
const registrationModel = {
  /**
   * Verifica se o voluntário já está inscrito no evento.
   * @param {number} volunteerId - Id do voluntário.
   * @param {number} eventId - Id do evento.
   * @returns {Promise<boolean>} true se já existe a inscrição.
   */
  async exists(volunteerId, eventId) {
    const [rows] = await pool.query(
      'SELECT 1 FROM registrations WHERE volunteer_id = ? AND event_id = ?',
      [volunteerId, eventId],
    );
    return rows.length > 0;
  },

  /**
   * Inscreve um voluntário em um evento.
   * @param {number} volunteerId - Id do voluntário.
   * @param {number} eventId - Id do evento.
   * @returns {Promise<number>} Id da inscrição criada.
   */
  async create(volunteerId, eventId) {
    const [result] = await pool.query(
      'INSERT INTO registrations (volunteer_id, event_id) VALUES (?, ?)',
      [volunteerId, eventId],
    );
    return result.insertId;
  },

  /**
   * Lista os voluntários inscritos em um evento.
   * @param {number} eventId - Id do evento.
   * @returns {Promise<Array>} Voluntários inscritos, com a data da inscrição.
   */
  async findVolunteersByEvent(eventId) {
    const [rows] = await pool.query(
      `SELECT v.id, v.name, v.email, v.phone, r.registered_at
       FROM registrations r
       JOIN volunteers v ON v.id = r.volunteer_id
       WHERE r.event_id = ?
       ORDER BY r.registered_at`,
      [eventId],
    );
    return rows;
  },
};

module.exports = registrationModel;
