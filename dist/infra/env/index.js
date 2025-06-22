"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = require("dotenv");
const zod_1 = require("zod");
(0, dotenv_1.config)();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().default(7777),
    DATABASE_URL: zod_1.z.string().url(),
    FRONTEND_PROD_URL: zod_1.z.string().url(),
    BACKEND_DEV_URL: zod_1.z.string().url(),
    FRONTEND_DEV_URL: zod_1.z.string().url(),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('production'),
    JWT_PRIVATE_KEY: zod_1.z.string(),
    JWT_PUBLIC_KEY: zod_1.z.string(),
    JWT_USER_ACCESS_EXPIRES_IN: zod_1.z.string(),
    JWT_USER_REFRESH_EXPIRES_IN: zod_1.z.string(),
    USER_REFRESH_EXPIRES_IN: zod_1.z.coerce.number(),
});
const _env = envSchema.safeParse(process.env);
if (_env.success === false) {
    console.error('Invalid environment variables', _env.error.format());
    throw new Error('Invalid environment variables');
}
const env = _env.data;
exports.env = env;
