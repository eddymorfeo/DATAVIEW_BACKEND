const express = require('express');
const focoStatusController = require('../controllers/focoStatusController');
const { asyncHandler } = require('../middlewares/asyncHandler');
const { validate } = require('../middlewares/validate');
const {
  schemaListFocoStatus,
  schemaGetFocoStatus,
  schemaCreateFocoStatus,
  schemaUpdateFocoStatus,
  schemaDeleteFocoStatus
} = require('./focoStatusSchemas');

const router = express.Router();

// GET /api/foco-status?page=1&pageSize=20
router.get('/', validate(schemaListFocoStatus), asyncHandler(focoStatusController.listFocoStatus));

// GET /api/foco-status/:id
router.get('/:id', validate(schemaGetFocoStatus), asyncHandler(focoStatusController.getFocoStatus));

// POST /api/foco-status
router.post('/', validate(schemaCreateFocoStatus), asyncHandler(focoStatusController.createFocoStatus));

// PUT /api/foco-status/:id
router.put('/:id', validate(schemaUpdateFocoStatus), asyncHandler(focoStatusController.updateFocoStatus));

// DELETE /api/foco-status/:id
router.delete('/:id', validate(schemaDeleteFocoStatus), asyncHandler(focoStatusController.deleteFocoStatus));

module.exports = { focoStatusRouter: router };
