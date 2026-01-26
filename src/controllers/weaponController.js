const weaponService = require('../services/weaponService');
const { HttpStatus } = require('../utils/httpStatus');

const listWeapons = async (req, res) => {
  const result = await weaponService.getAllWeapons(req.query);
  res.status(HttpStatus.OK).json({ success: true, ...result });
};

const getWeapon = async (req, res) => {
  const { id } = req.validated.params;
  const includeInactive = req.query.includeInactive === 'true';

  const item = await weaponService.getWeaponById({ id, includeInactive });
  res.status(HttpStatus.OK).json({ success: true, data: item });
};

const createWeapon = async (req, res) => {
  const { name, isActive } = req.validated.body;
  const userId = req.auth?.sub || null;

  const item = await weaponService.createWeapon({ name, isActive, userId });
  res.status(HttpStatus.CREATED).json({ success: true, data: item });
};

const updateWeapon = async (req, res) => {
  const { id } = req.validated.params;
  const { name, isActive } = req.validated.body;
  const userId = req.auth?.sub || null;

  const item = await weaponService.updateWeapon({ id, name, isActive, userId });
  res.status(HttpStatus.OK).json({ success: true, data: item });
};

const deleteWeapon = async (req, res) => {
  const { id } = req.validated.params;
  const userId = req.auth?.sub || null;

  await weaponService.deleteWeapon({ id, userId });
  res.status(HttpStatus.NO_CONTENT).send();
};

module.exports = {
  listWeapons,
  getWeapon,
  createWeapon,
  updateWeapon,
  deleteWeapon
};
