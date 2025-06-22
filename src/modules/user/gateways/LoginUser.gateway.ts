import { ZodValidationPipe } from '@shared/pipes/ZodValidation';
import { z } from 'zod';

const loginUserSchema = z.object({
  email: z.string().email().trim().min(5).max(255),
  password: z.string().trim().min(6).max(255),
});

export const LoginUserGateway = new ZodValidationPipe(loginUserSchema);
