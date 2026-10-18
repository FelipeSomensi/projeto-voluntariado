const volunteerModel = require('../models/volunteerModel');
const AppError = require('../utils/AppError');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Camada Service de voluntários: regras de negócio.
 */
const volunteerService = {
  /**
   * Lista todos os voluntários.
   * @returns {Promise<Array>} Lista de voluntários.
   */
  async list() {
    return volunteerModel.findAll();
  },

  /**
   * Busca um voluntário pelo id.
   * @param {number} id - Id do voluntário.
   * @returns {Promise<Object>} O voluntário encontrado.
   * @throws {AppError} 404 se não existir.
   */
  async getById(id) {
    const volunteer = await volunteerModel.findById(id);
    if (!volunteer) {
      throw new AppError('Voluntário não encontrado', 404);
    }
    return volunteer;
  },

  /**
   * Cadastra um voluntário.
   * @param {Object} data - Dados do voluntário.
   * @returns {Promise<Object>} O voluntário criado.
   * @throws {AppError} 400 se os dados forem inválidos; 409 se o e-mail já existir.
   */
  async create(data) {
    validateVolunteerData(data);
    await assertEmailAvailable(data.email);

    const id = await volunteerModel.create(data);
    return volunteerModel.findById(id);
  },

  /**
   * Atualiza um voluntário.
   * @param {number} id - Id do voluntário.
   * @param {Object} data - Novos dados.
   * @returns {Promise<Object>} O voluntário atualizado.
   * @throws {AppError} 404 se não existir; 400 se inválido; 409 se o e-mail for de outro voluntário.
   */
  async update(id, data) {
    await this.getById(id);
    validateVolunteerData(data);
    await assertEmailAvailable(data.email, id);

    await volunteerModel.update(id, data);
    return volunteerModel.findById(id);
  },

  /**
   * Exclui um voluntário.
   * @param {number} id - Id do voluntário.
   * @throws {AppError} 404 se não existir.
   */
  async remove(id) {
    await this.getById(id);
    await volunteerModel.remove(id);
  },
};

/**
 * Valida os campos de um voluntário.
 * @param {Object} data - Dados do voluntário.
 * @throws {AppError} 400 se algum campo for inválido.
 */
function validateVolunteerData({ name, email }) {
  if (!name || !email) {
    throw new AppError('Nome e e-mail são obrigatórios', 400);
  }
  if (!EMAIL_PATTERN.test(email)) {
    throw new AppError('E-mail inválido', 400);
  }
}

/**
 * Garante que o e-mail não pertence a outro voluntário.
 * @param {string} email - E-mail a verificar.
 * @param {number} [ignoreId] - Id do próprio voluntário (no caso de atualização).
 * @throws {AppError} 409 se o e-mail já estiver em uso.
 */
async function assertEmailAvailable(email, ignoreId) {
  const existing = await volunteerModel.findByEmail(email);
  if (existing && existing.id !== ignoreId) {
    throw new AppError('E-mail já cadastrado para outro voluntário', 409);
  }
}

module.exports = volunteerService;
