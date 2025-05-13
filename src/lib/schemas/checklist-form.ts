import { z } from 'zod';

export const checklistFormSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
});

export type ChecklistFormData = z.infer<typeof checklistFormSchema>; 