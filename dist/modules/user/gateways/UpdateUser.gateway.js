"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserGateway = void 0;
const ZodValidation_1 = require("../../../shared/pipes/ZodValidation");
const zod_1 = require("zod");
const updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(100),
});
exports.UpdateUserGateway = new ZodValidation_1.ZodValidationPipe(updateUserSchema);
