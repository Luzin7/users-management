import { env } from '@infra/env';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('User Management API')
      .setDescription('The User Management API Documentation')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }
  const allowedOrigins = [
    env.FRONTEND_PROD_URL,
    env.BACKEND_DEV_URL,
    env.FRONTEND_DEV_URL,
  ];

  app.use(
    helmet({
      contentSecurityPolicy: false,
      hsts:
        process.env.NODE_ENV === 'production'
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
    }),
  );

  app.use((req: Request, res: Response, next: NextFunction) => {
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
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: 'GET,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(env.PORT);
}
bootstrap();
