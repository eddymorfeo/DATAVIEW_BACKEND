const { z } = require('zod');

const uuidParam = z.object({
  id: z.string().uuid()
});

const createFocoBody = z.object({
  focoNumber: z.number().int().positive(),
  focoYear: z.number().int().min(1900).max(2100),
  title: z.string().min(3).max(200),
  description: z.string().optional(),

  comunaId: z.string().uuid(),
  statusId: z.string().uuid(),

  analystId: z.string().uuid().optional(),
  assignedToId: z.string().uuid().optional(),

  focoDate: z.string().datetime().optional(),

  isCompleted: z.boolean().optional().default(false),

  ordenInvestigar: z.boolean().optional().default(false),
  instruccionParticular: z.boolean().optional().default(false),
  diligencias: z.boolean().optional().default(false),
  reunionPolicial: z.boolean().optional().default(false),
  informes: z.boolean().optional().default(false),
  procedimientos: z.boolean().optional().default(false),

  createdBy: z.string().uuid().optional()
});

const updateFocoBody = z.object({
  focoNumber: z.number().int().positive(),
  focoYear: z.number().int().min(1900).max(2100),
  title: z.string().min(3).max(200),
  description: z.string().optional(),

  comunaId: z.string().uuid(),
  statusId: z.string().uuid(),

  analystId: z.string().uuid().optional(),
  assignedToId: z.string().uuid().optional(),

  focoDate: z.string().datetime().optional(),

  isCompleted: z.boolean(),

  ordenInvestigar: z.boolean(),
  instruccionParticular: z.boolean(),
  diligencias: z.boolean(),
  reunionPolicial: z.boolean(),
  informes: z.boolean(),
  procedimientos: z.boolean(),

  createdBy: z.string().uuid().optional()
});

const listQuery = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional()
});

const schemaList = z.object({ body: z.any().optional(), params: z.any().optional(), query: listQuery });
const schemaGet = z.object({ body: z.any().optional(), params: uuidParam, query: z.any().optional() });
const schemaCreate = z.object({ body: createFocoBody, params: z.any().optional(), query: z.any().optional() });
const schemaUpdate = z.object({ body: updateFocoBody, params: uuidParam, query: z.any().optional() });
const schemaDelete = z.object({ body: z.any().optional(), params: uuidParam, query: z.any().optional() });

module.exports = {
  schemaListFocos: schemaList,
  schemaGetFoco: schemaGet,
  schemaCreateFoco: schemaCreate,
  schemaUpdateFoco: schemaUpdate,
  schemaDeleteFoco: schemaDelete
};
