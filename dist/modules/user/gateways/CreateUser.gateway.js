"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserGateway = void 0;
const ZodValidation_1 = require("../../../shared/pipes/ZodValidation");
const zod_1 = require("zod");
const createUserSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(100),
    email: zod_1.z.string().email().trim().min(5).max(255),
    password: zod_1.z.string().trim().min(6).max(255),
});
exports.CreateUserGateway = new ZodValidation_1.ZodValidationPipe(createUserSchema);
