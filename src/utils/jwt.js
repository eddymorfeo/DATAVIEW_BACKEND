const jwt = require('jsonwebtoken');

const getJwtConfig = () => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '8h';

  if (!secret) {
    throw new Error('Missing JWT_SECRET in environment variables');
  }

  return { secret, expiresIn };
};

const signAccessToken = (payload) => {
  const { secret, expiresIn } = getJwtConfig();
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyAccessToken = (token) => {
  const { secret } = getJwtConfig();
  return jwt.verify(token, secret); // lanza error si expira o firma no calza
};

module.exports = { signAccessToken, verifyAccessToken };
