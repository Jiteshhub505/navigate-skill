import { z } from 'zod'

export const timingSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    days: z.array(z.string()).min(1, 'Select at least one day'),
})

export type TimingFormData = z.infer<typeof timingSchema>
