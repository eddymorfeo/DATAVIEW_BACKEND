const { pool } = require('../configs/db');

const WEAPON_COLUMNS = `
  id,
  name,
  is_active,
  user_id,
  created_at,
  updated_at
`;

const findAll = async ({ limit, offset, includeInactive }) => {
  const where = includeInactive ? '' : 'WHERE is_active = TRUE';

  const query = `
    SELECT ${WEAPON_COLUMNS}
    FROM weapon
    ${where}
    ORDER BY name ASC
    LIMIT $1 OFFSET $2
  `;

  const { rows } = await pool.query(query, [limit, offset]);
  return rows;
};

const countAll = async ({ includeInactive }) => {
  const where = includeInactive ? '' : 'WHERE is_active = TRUE';

  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS total FROM weapon ${where}`
  );

  return rows[0].total;
};

const findById = async ({ id, includeInactive }) => {
  const where = includeInactive ? '' : 'AND is_active = TRUE';

  const query = `
    SELECT ${WEAPON_COLUMNS}
    FROM weapon
    WHERE id = $1
    ${where}
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
};

const findInternalById = async (id) => {
  const { rows } = await pool.query(
    `SELECT id FROM weapon WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
};

const create = async ({ name, isActive, userId }) => {
  const query = `
    INSERT INTO weapon (name, is_active, user_id)
    VALUES ($1, $2, $3)
    RETURNING ${WEAPON_COLUMNS}
  `;

  const { rows } = await pool.query(query, [name, isActive, userId]);
  return rows[0];
};

const update = async ({ id, name, isActive, userId }) => {
  const query = `
    UPDATE weapon
    SET
      name = $2,
      is_active = $3,
      user_id = $4,
      updated_at = NOW()
    WHERE id = $1
    RETURNING ${WEAPON_COLUMNS}
  `;

  const { rows } = await pool.query(query, [id, name, isActive, userId]);
  return rows[0] || null;
};

const softDelete = async ({ id, userId }) => {
  const query = `
    UPDATE weapon
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
