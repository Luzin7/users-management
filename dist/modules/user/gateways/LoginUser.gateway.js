"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserGateway = void 0;
const ZodValidation_1 = require("../../../shared/pipes/ZodValidation");
const zod_1 = require("zod");
const loginUserSchema = zod_1.z.object({
    email: zod_1.z.string().email().trim().min(5).max(255),
    password: zod_1.z.string().trim().min(6).max(255),
});
exports.LoginUserGateway = new ZodValidation_1.ZodValidationPipe(loginUserSchema);
