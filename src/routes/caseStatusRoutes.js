const express = require('express');
const caseStatusController = require('../controllers/caseStatusController');
const { asyncHandler } = require('../middlewares/asyncHandler');
const { validate } = require('../middlewares/validate');
const {
  schemaListCaseStatus,
  schemaGetCaseStatus,
  schemaCreateCaseStatus,
  schemaUpdateCaseStatus,
  schemaDeleteCaseStatus
} = require('./caseStatusSchemas');

const router = express.Router();

// GET /api/case-status?page=1&pageSize=20&includeInactive=false
router.get('/', validate(schemaListCaseStatus), asyncHandler(caseStatusController.listCaseStatus));

// GET /api/case-status/:id
router.get('/:id', validate(schemaGetCaseStatus), asyncHandler(caseStatusController.getCaseStatus));

// POST /api/case-status
router.post('/', validate(schemaCreateCaseStatus), asyncHandler(caseStatusController.createCaseStatus));

// PUT /api/case-status/:id
router.put('/:id', validate(schemaUpdateCaseStatus), asyncHandler(caseStatusController.updateCaseStatus));

// DELETE /api/case-status/:id  (soft delete -> is_active=false)
router.delete('/:id', validate(schemaDeleteCaseStatus), asyncHandler(caseStatusController.deleteCaseStatus));

module.exports = { caseStatusRouter: router };
