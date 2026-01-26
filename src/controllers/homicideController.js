const homicideService = require('../services/homicideService');
const { HttpStatus } = require('../utils/httpStatus');

const listHomicides = async (req, res) => {
  const result = await homicideService.getAllHomicides(req.query);
  res.status(HttpStatus.OK).json({ success: true, ...result });
};

const getHomicide = async (req, res) => {
  const { id } = req.validated.params;
  const includeInactive = req.query.includeInactive === 'true';

  const item = await homicideService.getHomicideById({ id, includeInactive });
  res.status(HttpStatus.OK).json({ success: true, data: item });
};

const createHomicide = async (req, res) => {
  const body = req.validated.body;
  const userId = req.auth?.sub;

  const item = await homicideService.createHomicide({
    ruc: body.ruc,
    date: body.date,
    fullName: body.fullName,
    rut: body.rut,
    address: body.address,
    latitude: body.latitude,
    longitude: body.longitude,
    weaponId: body.weaponId,
    comunaId: body.comunaId,
    caseStatusId: body.caseStatusId,
    userId,
    isActive: body.isActive
  });

  res.status(HttpStatus.CREATED).json({ success: true, data: item });
};

const updateHomicide = async (req, res) => {
  const { id } = req.validated.params;
  const body = req.validated.body;
  const userId = req.auth?.sub;

  const item = await homicideService.updateHomicide({
    id,
    ruc: body.ruc,
    date: body.date,
    fullName: body.fullName,
    rut: body.rut,
    address: body.address,
    latitude: body.latitude,
    longitude: body.longitude,
    weaponId: body.weaponId,
    comunaId: body.comunaId,
    caseStatusId: body.caseStatusId,
    userId,
    isActive: body.isActive
  });

  res.status(HttpStatus.OK).json({ success: true, data: item });
};

const deleteHomicide = async (req, res) => {
  const { id } = req.validated.params;
  const userId = req.auth?.sub;

  await homicideService.deleteHomicide({ id, userId });
  res.status(HttpStatus.NO_CONTENT).send();
};

module.exports = {
  listHomicides,
  getHomicide,
  createHomicide,
  updateHomicide,
  deleteHomicide
};
