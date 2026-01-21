const focoRepository = require('../models/focoRepository');
const { AppError } = require('../utils/appError');
const { HttpStatus } = require('../utils/httpStatus');

const parsePagination = (query) => {
  const page = Math.max(1, Number(query.page || 1));
  const pageSize = Math.min(100, Math.max(1, Number(query.pageSize || 20)));
  const offset = (page - 1) * pageSize;

  return { page, pageSize, offset, limit: pageSize };
};

const getAllFocos = async (query) => {
  const { page, pageSize, offset, limit } = parsePagination(query);

  const [items, total] = await Promise.all([
    focoRepository.findAll({ limit, offset }),
    focoRepository.countAll()
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

const getFocoById = async (id) => {
  const foco = await focoRepository.findById(id);
  if (!foco) throw new AppError('Foco not found', HttpStatus.NOT_FOUND);
  return foco;
};

const createFoco = async (body) => {
  return focoRepository.create(body);
};

const updateFoco = async ({ id, body }) => {
  const exists = await focoRepository.findInternalById(id);
  if (!exists) throw new AppError('Foco not found', HttpStatus.NOT_FOUND);

  const updated = await focoRepository.update({ id, ...body });
  return updated;
};

const deleteFoco = async (id) => {
  const removed = await focoRepository.remove(id);
  if (!removed) throw new AppError('Foco not found', HttpStatus.NOT_FOUND);
  return true;
};

module.exports = {
  getAllFocos,
  getFocoById,
  createFoco,
  updateFoco,
  deleteFoco
};
