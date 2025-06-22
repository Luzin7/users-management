import { ZodValidationPipe } from '@shared/pipes/ZodValidation';
import { z } from 'zod';

const updateUserSchema = z.object({
  name: z.string().trim().min(2).max(100),
});

export const UpdateUserGateway = new ZodValidationPipe(updateUserSchema);
