const userRepository = require('../models/userRepository');
const { verifyPassword } = require('../utils/password');
const { signAccessToken } = require('../utils/jwt');
const { AppError } = require('../utils/appError');
const { HttpStatus } = require('../utils/httpStatus');
const { email } = require('zod');

const login = async ({ username, password }) => {
  const user = await userRepository.findByUsernameWithPasswordHash(username);

  if (!user || user.is_active !== true) {
    throw new AppError('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }

  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    throw new AppError('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }

  const accessToken = signAccessToken({
    sub: user.id,
    username: user.username
    // más adelante puedes agregar roles aquí si quieres
  });

  return {
    accessToken,
    user: {
      id: user.id,
      username: user.username,
      fullName: user.full_name
    }
  };
};

module.exports = { login };
