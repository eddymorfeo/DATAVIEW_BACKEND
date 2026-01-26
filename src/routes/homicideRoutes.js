const express = require('express');
const homicideController = require('../controllers/homicideController');
const { asyncHandler } = require('../middlewares/asyncHandler');
const { validate } = require('../middlewares/validate');
const {
  schemaListHomicides,
  schemaGetHomicide,
  schemaCreateHomicide,
  schemaUpdateHomicide,
  schemaDeleteHomicide
} = require('./homicideSchemas');

const router = express.Router();

// GET /api/homicides?page=1&pageSize=20&ruc=123&comunaId=...&dateFrom=...&dateTo=...
router.get('/', validate(schemaListHomicides), asyncHandler(homicideController.listHomicides));

// GET /api/homicides/:id
router.get('/:id', validate(schemaGetHomicide), asyncHandler(homicideController.getHomicide));

// POST /api/homicides
router.post('/', validate(schemaCreateHomicide), asyncHandler(homicideController.createHomicide));

// PUT /api/homicides/:id
router.put('/:id', validate(schemaUpdateHomicide), asyncHandler(homicideController.updateHomicide));

// DELETE /api/homicides/:id (soft delete)
router.delete('/:id', validate(schemaDeleteHomicide), asyncHandler(homicideController.deleteHomicide));

module.exports = { homicideRouter: router };
