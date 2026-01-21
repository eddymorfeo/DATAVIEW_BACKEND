const express = require('express');
const { userRouter } = require('./userRoutes');
const { roleRouter } = require('./roleRoutes');
const { comunaRouter } = require('./comunaRoutes');
const { focoStatusRouter } = require('./focoStatusRoutes');
const { focoRouter } = require('./focoRoutes');
const { userRoleRouter } = require('./userRoleRoutes');
const { authRouter } = require('./authRoutes');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();

// ✅ PUBLICO (no requiere token)
router.use('/auth', authRouter);

// ✅ PRIVADO (requiere token)
router.use('/users', requireAuth, userRouter);
router.use('/roles', requireAuth, roleRouter);
router.use('/comunas', requireAuth, comunaRouter);
router.use('/foco-status', requireAuth, focoStatusRouter);
router.use('/focos', requireAuth, focoRouter);
router.use('/user-roles', requireAuth, userRoleRouter);

module.exports = { apiRouter: router };
