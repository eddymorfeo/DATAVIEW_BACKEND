const caseStatusService = require('../services/caseStatusService');
const { HttpStatus } = require('../utils/httpStatus');

const listCaseStatus = async (req, res) => {
  const result = await caseStatusService.getAllCaseStatus(req.query);
  res.status(HttpStatus.OK).json({ success: true, ...result });
};

const getCaseStatus = async (req, res) => {
  const { id } = req.validated.params;
  const includeInactive = req.query.includeInactive === 'true';

  const item = await caseStatusService.getCaseStatusById({ id, includeInactive });
  res.status(HttpStatus.OK).json({ success: true, data: item });
};

const createCaseStatus = async (req, res) => {
  const { name, isActive } = req.validated.body;

  // ✅ user_id lo sacamos del token (payload.sub)
  const userId = req.auth?.sub || null;

  const item = await caseStatusService.createCaseStatus({ name, isActive, userId });
  res.status(HttpStatus.CREATED).json({ success: true, data: item });
};

const updateCaseStatus = async (req, res) => {
  const { id } = req.validated.params;
  const { name, isActive } = req.validated.body;

  const userId = req.auth?.sub || null;

  const item = await caseStatusService.updateCaseStatus({ id, name, isActive, userId });
  res.status(HttpStatus.OK).json({ success: true, data: item });
};

const deleteCaseStatus = async (req, res) => {
  const { id } = req.validated.params;
  const userId = req.auth?.sub || null;

  await caseStatusService.deleteCaseStatus({ id, userId });
  res.status(HttpStatus.NO_CONTENT).send();
};

module.exports = {
  listCaseStatus,
  getCaseStatus,
  createCaseStatus,
  updateCaseStatus,
  deleteCaseStatus
};
