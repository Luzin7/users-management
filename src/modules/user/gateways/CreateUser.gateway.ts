import { ZodValidationPipe } from '@shared/pipes/ZodValidation';
import { z } from 'zod';

const createUserSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email().trim().min(5).max(255),
  password: z.string().trim().min(6).max(255),
});

export const CreateUserGateway = new ZodValidationPipe(createUserSchema);
