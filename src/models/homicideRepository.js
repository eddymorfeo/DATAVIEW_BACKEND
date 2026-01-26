const { pool } = require('../configs/db');

const HOMICIDE_COLUMNS = `
  id,
  ruc,
  date,
  full_name,
  rut,
  address,
  latitude,
  longitude,
  weapon_id,
  comuna_id,
  case_status_id,
  user_id,
  is_active,
  created_at,
  updated_at
`;

const buildFilters = ({ includeInactive, ruc, comunaId, weaponId, caseStatusId, dateFrom, dateTo }) => {
    const where = [];
    const values = [];

    if (!includeInactive) {
        where.push(`is_active = TRUE`);
    }

    if (ruc) {
        values.push(`%${ruc}%`);
        where.push(`ruc ILIKE $${values.length}`);
    }

    if (comunaId) {
        values.push(comunaId);
        where.push(`comuna_id = $${values.length}`);
    }

    if (weaponId) {
        values.push(weaponId);
        where.push(`weapon_id = $${values.length}`);
    }

    if (caseStatusId) {
        values.push(caseStatusId);
        where.push(`case_status_id = $${values.length}`);
    }

    if (dateFrom) {
        values.push(dateFrom);
        where.push(`date >= $${values.length}`);
    }

    if (dateTo) {
        values.push(dateTo);
        where.push(`date <= $${values.length}`);
    }

    const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    return { clause, values };
};

const findAll = async ({ limit, offset, filters }) => {
  const { clause, values } = buildFilters(filters);

  values.push(limit);
  const limitIndex = values.length;

  values.push(offset);
  const offsetIndex = values.length;

  const query = `
    SELECT ${HOMICIDE_COLUMNS}
    FROM homicide
    ${clause}
    ORDER BY date DESC
    LIMIT $${limitIndex} OFFSET $${offsetIndex}
  `;

  const { rows } = await pool.query(query, values);
  return rows;
};

const countAll = async ({ filters }) => {
    const { clause, values } = buildFilters(filters);
    const { rows } = await pool.query(
        `SELECT COUNT(*)::int AS total FROM homicide ${clause}`,
        values
    );
    return rows[0].total;
};

const findById = async ({ id, includeInactive }) => {
    const query = `
    SELECT ${HOMICIDE_COLUMNS}
    FROM homicide
    WHERE id = $1
    ${includeInactive ? '' : 'AND is_active = TRUE'}
    LIMIT 1
  `;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
};

const findInternalById = async (id) => {
    const { rows } = await pool.query(
        `SELECT id FROM homicide WHERE id = $1`,
        [id]
    );
    return rows[0] || null;
};

const create = async ({
    ruc,
    date,
    fullName,
    rut,
    address,
    latitude,
    longitude,
    weaponId,
    comunaId,
    caseStatusId,
    userId,
    isActive
}) => {
    const query = `
    INSERT INTO homicide (
      ruc,
      date,
      full_name,
      rut,
      address,
      latitude,
      longitude,
      weapon_id,
      comuna_id,
      case_status_id,
      user_id,
      is_active
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
    )
    RETURNING ${HOMICIDE_COLUMNS}
  `;

    const values = [
        ruc,
        date,
        fullName ?? null,
        rut ?? null,
        address ?? null,
        latitude ?? null,
        longitude ?? null,
        weaponId,
        comunaId,
        caseStatusId,
        userId,
        isActive
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
};

const update = async ({
    id,
    ruc,
    date,
    fullName,
    rut,
    address,
    latitude,
    longitude,
    weaponId,
    comunaId,
    caseStatusId,
    userId,
    isActive
}) => {
    const query = `
    UPDATE homicide
    SET
      ruc = $2,
      date = $3,
      full_name = $4,
      rut = $5,
      address = $6,
      latitude = $7,
      longitude = $8,
      weapon_id = $9,
      comuna_id = $10,
      case_status_id = $11,
      user_id = $12,
      is_active = $13,
      updated_at = NOW()
    WHERE id = $1
    RETURNING ${HOMICIDE_COLUMNS}
  `;

    const values = [
        id,
        ruc,
        date,
        fullName ?? null,
        rut ?? null,
        address ?? null,
        latitude ?? null,
        longitude ?? null,
        weaponId,
        comunaId,
        caseStatusId,
        userId,
        isActive
    ];

    const { rows } = await pool.query(query, values);
    return rows[0] || null;
};

const softDelete = async ({ id, userId }) => {
    const query = `
    UPDATE homicide
    SET
      is_active = FALSE,
      user_id = $2,
      updated_at = NOW()
    WHERE id = $1
    RETURNING id
  `;

    const result = await pool.query(query, [id, userId]);
    return result.rowCount > 0;
};

module.exports = {
    findAll,
    countAll,
    findById,
    findInternalById,
    create,
    update,
    softDelete
};
