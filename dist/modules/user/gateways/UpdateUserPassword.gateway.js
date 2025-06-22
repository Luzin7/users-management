"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserPasswordGateway = void 0;
const ZodValidation_1 = require("../../../shared/pipes/ZodValidation");
const zod_1 = require("zod");
const updateUserPasswordSchema = zod_1.z.object({
    password: zod_1.z.string().trim().min(6).max(255),
});
exports.UpdateUserPasswordGateway = new ZodValidation_1.ZodValidationPipe(updateUserPasswordSchema);
