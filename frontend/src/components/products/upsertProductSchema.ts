import { z } from 'zod'

export const upsertProductSchema = z.object({
  sku: z
    .string()
    .trim()
    .transform((v) => v.toUpperCase().replace(/\s+/g, ''))
    .pipe(
      z
        .string()
        .min(5, 'SKU must be at least 5 characters long')
        .startsWith('SKU-', 'Az azonosítónak "SKU-" előtaggal kell kezdődnie!')
    ),
  name: z.string().trim().min(1, 'Name is required'),
  description: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : undefined)),
})

export type UpsertProductFormValues = z.infer<typeof upsertProductSchema>
