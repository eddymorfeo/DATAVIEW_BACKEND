const { z } = require('zod');

const uuidParam = z.object({
  id: z.string().uuid()
});

const createBody = z.object({
  name: z.string().min(2).max(60),
  isActive: z.boolean().optional().default(true)
});

const updateBody = z.object({
  name: z.string().min(2).max(60),
  isActive: z.boolean()
});

const listQuery = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional()
});

const schemaList = z.object({ body: z.any().optional(), params: z.any().optional(), query: listQuery });
const schemaGet = z.object({ body: z.any().optional(), params: uuidParam, query: z.any().optional() });
const schemaCreate = z.object({ body: createBody, params: z.any().optional(), query: z.any().optional() });
const schemaUpdate = z.object({ body: updateBody, params: uuidParam, query: z.any().optional() });
const schemaDelete = z.object({ body: z.any().optional(), params: uuidParam, query: z.any().optional() });

module.exports = {
  schemaListFocoStatus: schemaList,
  schemaGetFocoStatus: schemaGet,
  schemaCreateFocoStatus: schemaCreate,
  schemaUpdateFocoStatus: schemaUpdate,
  schemaDeleteFocoStatus: schemaDelete
};
