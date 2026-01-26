const caseStatusRepository = require('../models/caseStatusRepository');
const { AppError } = require('../utils/appError');
const { HttpStatus } = require('../utils/httpStatus');

const parsePagination = (query) => {
  const page = Math.max(1, Number(query.page || 1));
  const pageSize = Math.min(100, Math.max(1, Number(query.pageSize || 20)));
  const offset = (page - 1) * pageSize;

  return { page, pageSize, offset, limit: pageSize };
};

const toBool = (value) => String(value).toLowerCase() === 'true';

const getAllCaseStatus = async (query) => {
  const { page, pageSize, offset, limit } = parsePagination(query);
  const includeInactive = query.includeInactive ? toBool(query.includeInactive) : false;

  const [items, total] = await Promise.all([
    caseStatusRepository.findAll({ limit, offset, includeInactive }),
    caseStatusRepository.countAll({ includeInactive })
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

const getCaseStatusById = async ({ id, includeInactive = false }) => {
  const item = await caseStatusRepository.findById({ id, includeInactive });
  if (!item) throw new AppError('Case status not found', HttpStatus.NOT_FOUND);
  return item;
};

const createCaseStatus = async ({ name, isActive, userId }) => {
  return caseStatusRepository.create({ name, isActive, userId });
};

const updateCaseStatus = async ({ id, name, isActive, userId }) => {
  const exists = await caseStatusRepository.findInternalById(id);
  if (!exists) throw new AppError('Case status not found', HttpStatus.NOT_FOUND);

  const updated = await caseStatusRepository.update({ id, name, isActive, userId });
  return updated;
};

const deleteCaseStatus = async ({ id, userId }) => {
  const exists = await caseStatusRepository.findInternalById(id);
  if (!exists) throw new AppError('Case status not found', HttpStatus.NOT_FOUND);

  const removed = await caseStatusRepository.softDelete({ id, userId });
  if (!removed) throw new AppError('Case status not found', HttpStatus.NOT_FOUND);

  return true;
};

module.exports = {
  getAllCaseStatus,
  getCaseStatusById,
  createCaseStatus,
  updateCaseStatus,
  deleteCaseStatus
};
