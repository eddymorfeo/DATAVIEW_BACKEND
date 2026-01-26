const { z } = require('zod');

const uuidParam = z.object({
  id: z.string().uuid()
});

const coordsSchema = z
  .object({
    latitude: z.number().min(-90).max(90).nullable().optional(),
    longitude: z.number().min(-180).max(180).nullable().optional()
  })
  .refine(
    (data) =>
      (data.latitude == null && data.longitude == null) ||
      (data.latitude != null && data.longitude != null),
    { message: 'latitude y longitude deben venir ambas o ninguna' }
  );

const createBody = z
  .object({
    ruc: z.string().min(1).max(50),
    date: z.string().datetime(), // ISO: "2026-01-23T15:15:14.000Z"
    fullName: z.string().max(150).optional().nullable(),
    rut: z.string().max(10).optional().nullable(),
    address: z.string().max(255).optional().nullable(),
    weaponId: z.string().uuid(),
    comunaId: z.string().uuid(),
    caseStatusId: z.string().uuid(),
    isActive: z.boolean().optional().default(true)
  })
  .and(coordsSchema);

const updateBody = z
  .object({
    ruc: z.string().min(1).max(50),
    date: z.string().datetime(),
    fullName: z.string().max(150).optional().nullable(),
    rut: z.string().max(10).optional().nullable(),
    address: z.string().max(255).optional().nullable(),
    weaponId: z.string().uuid(),
    comunaId: z.string().uuid(),
    caseStatusId: z.string().uuid(),
    isActive: z.boolean()
  })
  .and(coordsSchema);

const listQuery = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
  includeInactive: z.string().optional(),

  // filtros útiles
  ruc: z.string().optional(),
  comunaId: z.string().uuid().optional(),
  weaponId: z.string().uuid().optional(),
  caseStatusId: z.string().uuid().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional()
});

const schemaListHomicides = z.object({ body: z.any().optional(), params: z.any().optional(), query: listQuery });
const schemaGetHomicide = z.object({ body: z.any().optional(), params: uuidParam, query: z.any().optional() });
const schemaCreateHomicide = z.object({ body: createBody, params: z.any().optional(), query: z.any().optional() });
const schemaUpdateHomicide = z.object({ body: updateBody, params: uuidParam, query: z.any().optional() });
const schemaDeleteHomicide = z.object({ body: z.any().optional(), params: uuidParam, query: z.any().optional() });

module.exports = {
  schemaListHomicides,
  schemaGetHomicide,
  schemaCreateHomicide,
  schemaUpdateHomicide,
  schemaDeleteHomicide
};
