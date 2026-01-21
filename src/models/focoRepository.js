const { pool } = require('../configs/db');

const FOCO_VIEW_COLUMNS = `
  f.id,
  f.foco_number,
  f.foco_year,
  f.title,
  f.description,
  f.comuna_id,
  c.name AS comuna_name,
  f.status_id,
  fs.name AS status_name,
  f.analyst_id,
  u_analyst.full_name AS analyst_name,
  f.assigned_to_id,
  u_assigned.full_name AS assigned_to_name,
  f.foco_date,
  f.is_completed,
  f.orden_investigar,
  f.instruccion_particular,
  f.diligencias,
  f.reunion_policial,
  f.informes,
  f.procedimientos,
  f.created_by,
  f.created_at,
  f.updated_at
`;

const FOCO_VIEW_JOINS = `
  FROM foco f
  LEFT JOIN comuna c
    ON c.id = f.comuna_id
   AND c.is_active = true

  LEFT JOIN foco_status fs
    ON fs.id = f.status_id
   AND fs.is_active = true

  LEFT JOIN users u_analyst
    ON u_analyst.id = f.analyst_id
   AND u_analyst.is_active = true

  LEFT JOIN users u_assigned
    ON u_assigned.id = f.assigned_to_id
   AND u_assigned.is_active = true
`;

const findAll = async ({ limit, offset }) => {
  const query = `
    SELECT ${FOCO_VIEW_COLUMNS}
    ${FOCO_VIEW_JOINS}
    ORDER BY f.created_at DESC
    LIMIT $1 OFFSET $2
  `;
  const { rows } = await pool.query(query, [limit, offset]);
  return rows;
};

const countAll = async () => {
  const { rows } = await pool.query(`SELECT COUNT(*)::int AS total FROM foco`);
  return rows[0].total;
};

const findById = async (id) => {
  const query = `
    SELECT ${FOCO_VIEW_COLUMNS}
    ${FOCO_VIEW_JOINS}
    WHERE f.id = $1
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
};

const findInternalById = async (id) => {
  const { rows } = await pool.query(`SELECT id FROM foco WHERE id = $1`, [id]);
  return rows[0] || null;
};


const create = async (payload) => {
  const insertQuery = `
    WITH inserted AS (
      INSERT INTO foco (
        foco_number,
        foco_year,
        title,
        description,
        comuna_id,
        status_id,
        analyst_id,
        assigned_to_id,
        foco_date,
        is_completed,
        orden_investigar,
        instruccion_particular,
        diligencias,
        reunion_policial,
        informes,
        procedimientos,
        created_by
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,
        COALESCE($9, now()),
        COALESCE($10, false),
        COALESCE($11, false),
        COALESCE($12, false),
        COALESCE($13, false),
        COALESCE($14, false),
        COALESCE($15, false),
        COALESCE($16, false),
        $17
      )
      RETURNING *
    )
    SELECT
      inserted.id,
      inserted.foco_number,
      inserted.foco_year,
      inserted.title,
      inserted.description,

      inserted.comuna_id,
      c.name AS comuna_name,

      inserted.status_id,
      fs.name AS status_name,

      inserted.analyst_id,
      u_analyst.full_name AS analyst_name,

      inserted.assigned_to_id,
      u_assigned.full_name AS assigned_to_name,

      inserted.foco_date,
      inserted.is_completed,
      inserted.orden_investigar,
      inserted.instruccion_particular,
      inserted.diligencias,
      inserted.reunion_policial,
      inserted.informes,
      inserted.procedimientos,
      inserted.created_by,
      inserted.created_at,
      inserted.updated_at
    FROM inserted
    LEFT JOIN comuna c
      ON c.id = inserted.comuna_id
     AND c.is_active = true
    LEFT JOIN foco_status fs
      ON fs.id = inserted.status_id
     AND fs.is_active = true
    LEFT JOIN users u_analyst
      ON u_analyst.id = inserted.analyst_id
     AND u_analyst.is_active = true
    LEFT JOIN users u_assigned
      ON u_assigned.id = inserted.assigned_to_id
     AND u_assigned.is_active = true
  `;

  const values = [
    payload.focoNumber,
    payload.focoYear,
    payload.title,
    payload.description ?? null,
    payload.comunaId,
    payload.statusId,
    payload.analystId ?? null,
    payload.assignedToId ?? null,
    payload.focoDate ?? null,
    payload.isCompleted ?? false,
    payload.ordenInvestigar ?? false,
    payload.instruccionParticular ?? false,
    payload.diligencias ?? false,
    payload.reunionPolicial ?? false,
    payload.informes ?? false,
    payload.procedimientos ?? false,
    payload.createdBy ?? null
  ];

  const { rows } = await pool.query(insertQuery, values);
  return rows[0];
};

const update = async (payload) => {
  const query = `
    WITH updated AS (
      UPDATE foco
      SET
        foco_number = $2,
        foco_year = $3,
        title = $4,
        description = $5,
        comuna_id = $6,
        status_id = $7,
        analyst_id = $8,
        assigned_to_id = $9,
        foco_date = COALESCE($10, foco_date),
        is_completed = $11,
        orden_investigar = $12,
        instruccion_particular = $13,
        diligencias = $14,
        reunion_policial = $15,
        informes = $16,
        procedimientos = $17,
        created_by = $18,
        updated_at = now()
      WHERE id = $1
      RETURNING *
    )
    SELECT
      updated.id,
      updated.foco_number,
      updated.foco_year,
      updated.title,
      updated.description,

      updated.comuna_id,
      c.name AS comuna_name,

      updated.status_id,
      fs.name AS status_name,

      updated.analyst_id,
      u_analyst.full_name AS analyst_name,

      updated.assigned_to_id,
      u_assigned.full_name AS assigned_to_name,

      updated.foco_date,
      updated.is_completed,
      updated.orden_investigar,
      updated.instruccion_particular,
      updated.diligencias,
      updated.reunion_policial,
      updated.informes,
      updated.procedimientos,
      updated.created_by,
      updated.created_at,
      updated.updated_at
    FROM updated
    LEFT JOIN comuna c
      ON c.id = updated.comuna_id
     AND c.is_active = true
    LEFT JOIN foco_status fs
      ON fs.id = updated.status_id
     AND fs.is_active = true
    LEFT JOIN users u_analyst
      ON u_analyst.id = updated.analyst_id
     AND u_analyst.is_active = true
    LEFT JOIN users u_assigned
      ON u_assigned.id = updated.assigned_to_id
     AND u_assigned.is_active = true
  `;

  const values = [
    payload.id,
    payload.focoNumber,
    payload.focoYear,
    payload.title,
    payload.description ?? null,
    payload.comunaId,
    payload.statusId,
    payload.analystId ?? null,
    payload.assignedToId ?? null,
    payload.focoDate ?? null,
    payload.isCompleted,
    payload.ordenInvestigar,
    payload.instruccionParticular,
    payload.diligencias,
    payload.reunionPolicial,
    payload.informes,
    payload.procedimientos,
    payload.createdBy ?? null
  ];

  const { rows } = await pool.query(query, values);
  return rows[0] || null;
};

const remove = async (id) => {
  const result = await pool.query(`DELETE FROM foco WHERE id = $1`, [id]);
  return result.rowCount > 0;
};

module.exports = {
  findAll,
  countAll,
  findById,
  findInternalById,
  create,
  update,
  remove
};
