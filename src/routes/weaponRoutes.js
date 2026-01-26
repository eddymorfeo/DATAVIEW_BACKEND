const express = require('express');
const weaponController = require('../controllers/weaponController');
const { asyncHandler } = require('../middlewares/asyncHandler');
const { validate } = require('../middlewares/validate');
const {
  schemaListWeapons,
  schemaGetWeapon,
  schemaCreateWeapon,
  schemaUpdateWeapon,
  schemaDeleteWeapon
} = require('./weaponSchemas');

const router = express.Router();

// GET /api/weapons?page=1&pageSize=20&includeInactive=false
router.get('/', validate(schemaListWeapons), asyncHandler(weaponController.listWeapons));

// GET /api/weapons/:id
router.get('/:id', validate(schemaGetWeapon), asyncHandler(weaponController.getWeapon));

// POST /api/weapons
router.post('/', validate(schemaCreateWeapon), asyncHandler(weaponController.createWeapon));

// PUT /api/weapons/:id
router.put('/:id', validate(schemaUpdateWeapon), asyncHandler(weaponController.updateWeapon));

// DELETE /api/weapons/:id (soft delete)
router.delete('/:id', validate(schemaDeleteWeapon), asyncHandler(weaponController.deleteWeapon));

module.exports = { weaponRouter: router };
