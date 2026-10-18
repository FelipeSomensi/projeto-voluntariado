const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const AppError = require('../utils/AppError');

const SALT_ROUNDS = 10;

/**
 * Camada Service de usuários: cadastro e login.
 */
const userService = {
  /**
   * Cadastra um novo usuário com perfil 'user'.
   * @param {Object} data - Dados do cadastro.
   * @param {string} data.email - E-mail.
   * @param {string} data.password - Senha em texto puro.
   * @returns {Promise<{id: number, email: string, role: string}>} Usuário criado.
   * @throws {AppError} 400 se faltar dado; 409 se o e-mail já existir.
   */
  async registerUser({ email, password }) {
    if (!email || !password) {
      throw new AppError('E-mail e senha são obrigatórios', 400);
    }

    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      throw new AppError('E-mail já cadastrado', 409);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const role = 'user';
    const id = await userModel.create({
      email,
      password: hashedPassword,
      role,
    });

    return { id, email, role };
  },

  /**
   * Autentica um usuário e gera um token JWT.
   * @param {string} email - E-mail do usuário.
   * @param {string} password - Senha em texto puro.
   * @returns {Promise<{token: string}>} Token JWT com payload { email, role }.
   * @throws {AppError} 400 se faltar dado; 401 se as credenciais forem inválidas.
   */
  async loginUser(email, password) {
    if (!email || !password) {
      throw new AppError('E-mail e senha são obrigatórios', 400);
    }

    const user = await userModel.findByEmail(email);
    const passwordMatches =
      user && (await bcrypt.compare(password, user.password));

    if (!passwordMatches) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    return { token };
  },
};

module.exports = userService;
