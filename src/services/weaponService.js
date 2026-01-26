const weaponRepository = require('../models/weaponRepository');
const { AppError } = require('../utils/appError');
const { HttpStatus } = require('../utils/httpStatus');

const parsePagination = (query) => {
  const page = Math.max(1, Number(query.page || 1));
  const pageSize = Math.min(100, Math.max(1, Number(query.pageSize || 20)));
  const offset = (page - 1) * pageSize;

  return { page, pageSize, offset, limit: pageSize };
};

const toBool = (value) => String(value).toLowerCase() === 'true';

const getAllWeapons = async (query) => {
  const { page, pageSize, offset, limit } = parsePagination(query);
  const includeInactive = query.includeInactive ? toBool(query.includeInactive) : false;

  const [items, total] = await Promise.all([
    weaponRepository.findAll({ limit, offset, includeInactive }),
    weaponRepository.countAll({ includeInactive })
  ]);

  return {
    items,
    meta: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  };
};

const getWeaponById = async ({ id, includeInactive = false }) => {
  const item = await weaponRepository.findById({ id, includeInactive });
  if (!item) throw new AppError('Weapon not found', HttpStatus.NOT_FOUND);
  return item;
};

const createWeapon = async ({ name, isActive, userId }) => {
  return weaponRepository.create({ name, isActive, userId });
};

const updateWeapon = async ({ id, name, isActive, userId }) => {
  const exists = await weaponRepository.findInternalById(id);
  if (!exists) throw new AppError('Weapon not found', HttpStatus.NOT_FOUND);

  const updated = await weaponRepository.update({ id, name, isActive, userId });
  return updated;
};

const deleteWeapon = async ({ id, userId }) => {
  const exists = await weaponRepository.findInternalById(id);
  if (!exists) throw new AppError('Weapon not found', HttpStatus.NOT_FOUND);

  const removed = await weaponRepository.softDelete({ id, userId });
  if (!removed) throw new AppError('Weapon not found', HttpStatus.NOT_FOUND);

  return true;
};

module.exports = {
  getAllWeapons,
  getWeaponById,
  createWeapon,
  updateWeapon,
  deleteWeapon
};
