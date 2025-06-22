"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../env");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, cookie_parser_1.default)());
    if (process.env.NODE_ENV !== 'production') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('User Management API')
            .setDescription('The User Management API Documentation')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('docs', app, document);
    }
    const allowedOrigins = [
        env_1.env.FRONTEND_PROD_URL,
        env_1.env.BACKEND_DEV_URL,
        env_1.env.FRONTEND_DEV_URL,
    ];
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: false,
        hsts: process.env.NODE_ENV === 'production'
            ? {
                maxAge: 31536000,
                includeSubDomains: true,
                preload: true,
            }
            : false,
        referrerPolicy: { policy: 'no-referrer' },
        crossOriginResourcePolicy: { policy: 'same-origin' },
        crossOriginOpenerPolicy: { policy: 'same-origin' },
        crossOriginEmbedderPolicy: false,
        xssFilter: true,
        hidePoweredBy: true,
        frameguard: { action: 'deny' },
        noSniff: true,
        permittedCrossDomainPolicies: { permittedPolicies: 'none' },
    }));
    app.use((req, res, next) => {
        console.log(`Request received: ${req.method} ${req.url}`);
        res.on('finish', () => {
            console.log(`Response sent: ${res.statusCode}`);
        });
        next();
    });
    app.enableCors({
        origin: (origin, callback) => {
            if (allowedOrigins.includes(origin) || !origin) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: 'GET,PUT,PATCH,POST,DELETE',
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    await app.listen(env_1.env.PORT);
}
bootstrap();
