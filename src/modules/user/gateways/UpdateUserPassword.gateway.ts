import { ZodValidationPipe } from '@shared/pipes/ZodValidation';
import { z } from 'zod';

const updateUserPasswordSchema = z.object({
  password: z.string().trim().min(6).max(255),
});

export const UpdateUserPasswordGateway = new ZodValidationPipe(
  updateUserPasswordSchema,
);
