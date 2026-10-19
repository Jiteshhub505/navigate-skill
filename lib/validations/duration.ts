import { z } from 'zod'

export const durationSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    value: z.number().min(1, 'Value must be at least 1'),
    unit: z.enum(['days', 'weeks', 'months', 'years']),
})

export type DurationFormData = z.infer<typeof durationSchema>
