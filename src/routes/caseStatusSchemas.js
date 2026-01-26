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
  includeInactive: z.string().optional() // "true" | "false"
});

const schemaListCaseStatus = z.object({ body: z.any().optional(), params: z.any().optional(), query: listQuery });
const schemaGetCaseStatus = z.object({ body: z.any().optional(), params: uuidParam, query: z.any().optional() });
const schemaCreateCaseStatus = z.object({ body: createBody, params: z.any().optional(), query: z.any().optional() });
const schemaUpdateCaseStatus = z.object({ body: updateBody, params: uuidParam, query: z.any().optional() });
const schemaDeleteCaseStatus = z.object({ body: z.any().optional(), params: uuidParam, query: z.any().optional() });

module.exports = {
  schemaListCaseStatus,
  schemaGetCaseStatus,
  schemaCreateCaseStatus,
  schemaUpdateCaseStatus,
  schemaDeleteCaseStatus
};
