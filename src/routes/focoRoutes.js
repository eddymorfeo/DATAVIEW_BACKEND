const express = require('express');
const focoController = require('../controllers/focoController');
const { asyncHandler } = require('../middlewares/asyncHandler');
const { validate } = require('../middlewares/validate');
const {
  schemaListFocos,
  schemaGetFoco,
  schemaCreateFoco,
  schemaUpdateFoco,
  schemaDeleteFoco
} = require('./focoSchemas');

const router = express.Router();

router.get('/', validate(schemaListFocos), asyncHandler(focoController.listFocos));
router.get('/:id', validate(schemaGetFoco), asyncHandler(focoController.getFoco));

router.post('/', validate(schemaCreateFoco), asyncHandler(focoController.createFoco));
router.put('/:id', validate(schemaUpdateFoco), asyncHandler(focoController.updateFoco));
router.delete('/:id', validate(schemaDeleteFoco), asyncHandler(focoController.deleteFoco));

module.exports = { focoRouter: router };
