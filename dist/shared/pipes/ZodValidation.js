"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const statusCode_1 = require("../core/types/statusCode");
const zod_1 = require("zod");
const zod_validation_error_1 = require("zod-validation-error");
/**
 * @class ZodValidationPipe - A validation pipe
 * It will validate the data request on application.
 */
class ZodValidationPipe {
    schema;
    constructor(schema) {
        this.schema = schema;
    }
    transform(value) {
        try {
            return this.schema.parse(value);
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                throw new common_1.BadRequestException({
                    details: { errors: (0, zod_validation_error_1.fromZodError)(err) },
                    message: 'Dado recebido não pôde ser validado',
                    title: 'Validation error',
                    status: statusCode_1.statusCode.BAD_REQUEST,
                });
            }
            throw new common_1.BadRequestException('Dado recebido não pôde ser validado');
        }
    }
}
exports.ZodValidationPipe = ZodValidationPipe;
