const focoStatusRepository = require('../models/focoStatusRepository');
const { AppError } = require('../utils/appError');
const { HttpStatus } = require('../utils/httpStatus');

const parsePagination = (query) => {
  const page = Math.max(1, Number(query.page || 1));
  const pageSize = Math.min(100, Math.max(1, Number(query.pageSize || 20)));
  const offset = (page - 1) * pageSize;

  return { page, pageSize, offset, limit: pageSize };
};

const getAllFocoStatus = async (query) => {
  const { page, pageSize, offset, limit } = parsePagination(query);

  const [items, total] = await Promise.all([
    focoStatusRepository.findAll({ limit, offset }),
    focoStatusRepository.countAll()
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

const getFocoStatusById = async (id) => {
  const item = await focoStatusRepository.findById(id);
  if (!item) throw new AppError('Foco status not found', HttpStatus.NOT_FOUND);
  return item;
};

const createFocoStatus = async ({ name, isActive }) => {
  return focoStatusRepository.create({ name, isActive });
};

const updateFocoStatus = async ({ id, name, isActive }) => {
  const exists = await focoStatusRepository.findInternalById(id);
  if (!exists) throw new AppError('Foco status not found', HttpStatus.NOT_FOUND);

  const updated = await focoStatusRepository.update({ id, name, isActive });
  return updated;
};

const deleteFocoStatus = async (id) => {
  const removed = await focoStatusRepository.remove(id);
  if (!removed) throw new AppError('Foco status not found', HttpStatus.NOT_FOUND);
  return true;
};

module.exports = {
  getAllFocoStatus,
  getFocoStatusById,
  createFocoStatus,
  updateFocoStatus,
  deleteFocoStatus
};
