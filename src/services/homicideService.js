const homicideRepository = require('../models/homicideRepository');
const { AppError } = require('../utils/appError');
const { HttpStatus } = require('../utils/httpStatus');

const parsePagination = (query) => {
  const page = Math.max(1, Number(query.page || 1));
  const pageSize = Math.min(100, Math.max(1, Number(query.pageSize || 20)));
  const offset = (page - 1) * pageSize;

  return { page, pageSize, offset, limit: pageSize };
};

const toBool = (value) => String(value).toLowerCase() === 'true';

const getAllHomicides = async (query) => {
  const { page, pageSize, offset, limit } = parsePagination(query);

  const filters = {
    includeInactive: query.includeInactive ? toBool(query.includeInactive) : false,
    ruc: query.ruc ? String(query.ruc).trim() : undefined,
    comunaId: query.comunaId,
    weaponId: query.weaponId,
    caseStatusId: query.caseStatusId,
    dateFrom: query.dateFrom,
    dateTo: query.dateTo
  };

  const [items, total] = await Promise.all([
    homicideRepository.findAll({ limit, offset, filters }),
    homicideRepository.countAll({ filters })
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

const getHomicideById = async ({ id, includeInactive = false }) => {
  const item = await homicideRepository.findById({ id, includeInactive });
  if (!item) throw new AppError('Homicide not found', HttpStatus.NOT_FOUND);
  return item;
};

const createHomicide = async (payload) => {
  return homicideRepository.create(payload);
};

const updateHomicide = async (payload) => {
  const exists = await homicideRepository.findInternalById(payload.id);
  if (!exists) throw new AppError('Homicide not found', HttpStatus.NOT_FOUND);

  return homicideRepository.update(payload);
};

const deleteHomicide = async ({ id, userId }) => {
  const exists = await homicideRepository.findInternalById(id);
  if (!exists) throw new AppError('Homicide not found', HttpStatus.NOT_FOUND);

  const removed = await homicideRepository.softDelete({ id, userId });
  if (!removed) throw new AppError('Homicide not found', HttpStatus.NOT_FOUND);

  return true;
};

module.exports = {
  getAllHomicides,
  getHomicideById,
  createHomicide,
  updateHomicide,
  deleteHomicide
};
