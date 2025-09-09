import { z } from "zod";

// Schema para filtros de busca
export const searchFiltersSchema = z.object({
  nome: z.string().optional(),
  status: z.enum(["desaparecido", "localizado", "todos"]).optional(),
  sexo: z.enum(["MASCULINO", "FEMININO", "todos"]).optional(),
  dataDesaparecimentoDe: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  dataDesaparecimentoAte: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

// Schema para dados de pessoa
export const pessoaSchema = z.object({
  id: z.number(),
  nome: z.string(),
  idade: z.number(),
  sexo: z.enum(["MASCULINO", "FEMININO"]),
  vivo: z.boolean(),
  urlFoto: z.string().nullable(),
  ultimaOcorrencia: z.object({
    dtDesaparecimento: z.string(),
    dataLocalizacao: z.string().nullable(),
    encontradoVivo: z.boolean(),
    localDesaparecimentoConcat: z.string(),
    ocorrenciaEntrevDesapDTO: z
      .object({
        informacao: z.string().nullable(),
        vestimentasDesaparecido: z.string(),
      })
      .nullable(),
    listaCartaz: z.any().nullable(),
    ocoId: z.number(),
  }),
});

// Schema para resposta da API
export const apiResponseSchema = z.object({
  totalElements: z.number(),
  totalPages: z.number(),
  pageable: z.object({
    pageNumber: z.number(),
    pageSize: z.number(),
    sort: z.object({
      unsorted: z.boolean(),
      sorted: z.boolean(),
      empty: z.boolean(),
    }),
    offset: z.number(),
    unpaged: z.boolean(),
    paged: z.boolean(),
  }),
  numberOfElements: z.number(),
  first: z.boolean(),
  last: z.boolean(),
  size: z.number(),
  content: z.array(pessoaSchema),
});

// Schema para nova informação
export const novaInformacaoSchema = z.object({
  ocoId: z.number(),
  informacao: z
    .string()
    .min(10, "Informação deve ter pelo menos 10 caracteres")
    .max(500, "Informação deve ter no máximo 500 caracteres"),
  descricao: z.string().optional(),
  data: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato yyyy-MM-dd"),
  fotos: z.array(z.instanceof(File)).optional(),
  localizacao: z.string().optional(),
  telefone: z.string().optional(),
});

// Schema para validação de telefone
export const telefoneSchema = z
  .string()
  .regex(
    /^\(\d{2}\) \d{4,5}-\d{4}$/,
    "Telefone deve estar no formato (XX) XXXXX-XXXX"
  )
  .optional();

// Schema para validação de data
export const dataSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato yyyy-MM-dd")
  .refine((date) => {
    const inputDate = new Date(date);
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    return inputDate >= oneYearAgo && inputDate <= today;
  }, "Data deve ser entre 1 ano atrás e hoje");

// Schema para validação de arquivo
export const arquivoSchema = z
  .object({
    file: z.instanceof(File),
    maxSize: z.number().default(5 * 1024 * 1024), // 5MB
    allowedTypes: z
      .array(z.string())
      .default(["image/jpeg", "image/png", "image/gif"]),
  })
  .refine((data) => {
    return data.file.size <= data.maxSize;
  }, "Arquivo deve ter no máximo 5MB")
  .refine((data) => {
    return data.allowedTypes.includes(data.file.type);
  }, "Arquivo deve ser uma imagem (JPG, PNG ou GIF)");

// Função para validar dados com Zod
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );
      throw new Error(`Validação falhou: ${errorMessages.join(", ")}`);
    }
    throw error;
  }
}

// Função para validar dados de forma segura (retorna resultado)
export function safeValidateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): {
  success: boolean;
  data?: T;
  error?: string;
} {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );
      return { success: false, error: errorMessages.join(", ") };
    }
    return { success: false, error: "Erro de validação desconhecido" };
  }
}
