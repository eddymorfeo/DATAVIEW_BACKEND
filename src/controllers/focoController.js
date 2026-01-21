const focoService = require('../services/focoService');
const { HttpStatus } = require('../utils/httpStatus');

const listFocos = async (req, res) => {
  const result = await focoService.getAllFocos(req.query);
  res.status(HttpStatus.OK).json({ success: true, ...result });
};

const getFoco = async (req, res) => {
  const { id } = req.validated.params;
  const foco = await focoService.getFocoById(id);
  res.status(HttpStatus.OK).json({ success: true, data: foco });
};

const createFoco = async (req, res) => {
  const foco = await focoService.createFoco(req.validated.body);
  res.status(HttpStatus.CREATED).json({ success: true, data: foco });
};

const updateFoco = async (req, res) => {
  const { id } = req.validated.params;
  const foco = await focoService.updateFoco({ id, body: req.validated.body });
  res.status(HttpStatus.OK).json({ success: true, data: foco });
};

const deleteFoco = async (req, res) => {
  const { id } = req.validated.params;
  await focoService.deleteFoco(id);
  res.status(HttpStatus.NO_CONTENT).send();
};

module.exports = {
  listFocos,
  getFoco,
  createFoco,
  updateFoco,
  deleteFoco
};
