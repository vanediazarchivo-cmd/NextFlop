import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
    credentials: true,
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle("Nextflop Auth Service")
    .setDescription("Authentication and User Management API for Nextflop platform")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth", // key
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // Mount docs at /api/docs (global prefix will be applied)
  SwaggerModule.setup("docs", app, document);

  // Usamos el puerto definido en el .env o en docker-compose, con un fallback a 3001 para desarrollo local
  const port = process.env.PORT || 3001; 
  // Set a global API prefix so the microservice accepts /api/* requests forwarded by the gateway
  app.setGlobalPrefix('api');
  await app.listen(port);

  console.log(`🚀 Auth Service running on port ${port}`);
  console.log(`📚 Swagger docs available at http://localhost:${port}/api/docs`);
}

bootstrap();