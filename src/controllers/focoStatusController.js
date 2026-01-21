const focoStatusService = require('../services/focoStatusService');
const { HttpStatus } = require('../utils/httpStatus');

const listFocoStatus = async (req, res) => {
  const result = await focoStatusService.getAllFocoStatus(req.query);
  res.status(HttpStatus.OK).json({ success: true, ...result });
};

const getFocoStatus = async (req, res) => {
  const { id } = req.validated.params;
  const item = await focoStatusService.getFocoStatusById(id);
  res.status(HttpStatus.OK).json({ success: true, data: item });
};

const createFocoStatus = async (req, res) => {
  const { name, isActive } = req.validated.body;
  const item = await focoStatusService.createFocoStatus({ name, isActive });
  res.status(HttpStatus.CREATED).json({ success: true, data: item });
};

const updateFocoStatus = async (req, res) => {
  const { id } = req.validated.params;
  const { name, isActive } = req.validated.body;

  const item = await focoStatusService.updateFocoStatus({ id, name, isActive });
  res.status(HttpStatus.OK).json({ success: true, data: item });
};

const deleteFocoStatus = async (req, res) => {
  const { id } = req.validated.params;
  await focoStatusService.deleteFocoStatus(id);
  res.status(HttpStatus.NO_CONTENT).send();
};

module.exports = {
  listFocoStatus,
  getFocoStatus,
  createFocoStatus,
  updateFocoStatus,
  deleteFocoStatus
};
