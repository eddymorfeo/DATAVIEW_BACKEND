const { pool } = require('../configs/db');
const { AppError } = require('../utils/appError');
const { HttpStatus } = require('../utils/httpStatus');
const boardRepository = require('../models/boardRepository');

function resolveActorId(req) {
  // compatible con distintos payloads JWT
  return req?.auth?.id || req?.auth?.userId || req?.auth?.sub || null;
}

async function listBoard(params) {
  return boardRepository.listBoard(params);
}

async function assignRequest(req, { requestId, assigned_to, note }) {
  const actorId = resolveActorId(req);
  if (!actorId) {
    throw new AppError('Unauthorized: missing actor', HttpStatus.UNAUTHORIZED);
  }

  const request = await boardRepository.getRequestById(requestId);
  if (!request || request.is_active === false) {
    throw new AppError('Request not found', HttpStatus.NOT_FOUND);
  }

  const assignedStatus = await boardRepository.getStatusByCode('ASSIGNED');
  if (!assignedStatus) {
    throw new AppError('Missing request_status code ASSIGNED', HttpStatus.CONFLICT);
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await boardRepository.closeActiveAssignments(client, requestId);

    const assignment = await boardRepository.createAssignment(client, {
      requestId,
      assignedTo: assigned_to,
      assignedBy: actorId,
      note
    });

    const updatedRequest = await boardRepository.updateRequestStatus(client, {
      requestId,
      statusId: assignedStatus.id,
      setFirstAssignedAt: true,
      setClosedAt: false
    });

    await boardRepository.insertStatusHistory(client, {
      requestId,
      fromStatusId: request.status_id,
      toStatusId: assignedStatus.id,
      changedBy: actorId,
      note: note || 'Assigned'
    });

    await boardRepository.insertBoardEvent(client, {
      eventType: 'ASSIGNED',
      requestId,
      actorId,
      payload: {
        to_status: 'ASSIGNED',
        assigned_to,
        assignment_id: assignment.id
      }
    });

    await client.query('COMMIT');
    return { assignment, request: updatedRequest };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function changeStatus(req, { requestId, to_status_code, to_status_id, note }) {
  const actorId = resolveActorId(req);
  if (!actorId) {
    throw new AppError('Unauthorized: missing actor', HttpStatus.UNAUTHORIZED);
  }

  const request = await boardRepository.getRequestById(requestId);
  if (!request || request.is_active === false) {
    throw new AppError('Request not found', HttpStatus.NOT_FOUND);
  }

  const targetStatus = to_status_id
    ? await boardRepository.getStatusById(to_status_id)
    : await boardRepository.getStatusByCode(to_status_code);

  if (!targetStatus) {
    throw new AppError('Target status not found', HttpStatus.NOT_FOUND);
  }

  // Regla simple: si el status destino no es UNASSIGNED, debe haber asignación activa
  if (targetStatus.code !== 'UNASSIGNED') {
    const client = await pool.connect();
    try {
      const active = await boardRepository.getActiveAssignment(client, requestId);
      if (!active) {
        throw new AppError(
          'Cannot change status: request has no active assignment',
          HttpStatus.CONFLICT
        );
      }
    } finally {
      client.release();
    }
  }

  // Si el actual es terminal, no permitimos volver atrás (para evitar inconsistencias)
  const currentStatus = await boardRepository.getStatusById(request.status_id);
  if (currentStatus?.is_terminal) {
    throw new AppError('Cannot change status from a terminal state', HttpStatus.CONFLICT);
  }

  const setClosedAt = targetStatus.code === 'DONE';

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const updatedRequest = await boardRepository.updateRequestStatus(client, {
      requestId,
      statusId: targetStatus.id,
      setFirstAssignedAt: false,
      setClosedAt
    });

    await boardRepository.insertStatusHistory(client, {
      requestId,
      fromStatusId: request.status_id,
      toStatusId: targetStatus.id,
      changedBy: actorId,
      note: note || `Status changed to ${targetStatus.code}`
    });

    await boardRepository.insertBoardEvent(client, {
      eventType: 'STATUS_CHANGED',
      requestId,
      actorId,
      payload: {
        from_status_id: request.status_id,
        to_status_id: targetStatus.id,
        to_status_code: targetStatus.code
      }
    });

    await client.query('COMMIT');
    return { request: updatedRequest };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function getChanges(params) {
  return boardRepository.getChanges(params);
}

async function getMetrics(params) {
  return boardRepository.getMetrics(params);
}

module.exports = {
  listBoard,
  assignRequest,
  changeStatus,
  getChanges,
  getMetrics
};
