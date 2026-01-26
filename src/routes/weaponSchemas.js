const { z } = require('zod');

const uuidParam = z.object({
  id: z.string().uuid()
});

const createBody = z.object({
  name: z.string().min(2).max(120),
  isActive: z.boolean().optional().default(true)
});

const updateBody = z.object({
  name: z.string().min(2).max(120),
  isActive: z.boolean()
});

const listQuery = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
  includeInactive: z.string().optional()
});

const schemaListWeapons = z.object({ body: z.any().optional(), params: z.any().optional(), query: listQuery });
const schemaGetWeapon = z.object({ body: z.any().optional(), params: uuidParam, query: z.any().optional() });
const schemaCreateWeapon = z.object({ body: createBody, params: z.any().optional(), query: z.any().optional() });
const schemaUpdateWeapon = z.object({ body: updateBody, params: uuidParam, query: z.any().optional() });
const schemaDeleteWeapon = z.object({ body: z.any().optional(), params: uuidParam, query: z.any().optional() });

module.exports = {
  schemaListWeapons,
  schemaGetWeapon,
  schemaCreateWeapon,
  schemaUpdateWeapon,
  schemaDeleteWeapon
};
