import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import SubscriptionPlanSeeder from "./infrastructure/seeds/subscription-plan.seeder";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("Nextflop Subscriptions Service")
    .setDescription("Subscription Plans Management API for Nextflop platform")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth",
    )
    .addSecurity("JWT-auth", { // <-- ESTA ES LA LÍNEA AÑADIDA
      type: "http",
      scheme: "bearer",
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // Mount docs at /api/docs (global prefix will be applied)
  SwaggerModule.setup("docs", app, document);

  const port = process.env.PORT || 3002;
  // Expose all subscription endpoints under /api/* so Gateway /api routes can reach them
  app.setGlobalPrefix('api');
  // Run DB seeders (idempotent) after app created
  try {
    const seeder = app.get(SubscriptionPlanSeeder);
    if (seeder && seeder.seed) await seeder.seed();
  } catch (err) {
    console.error("Seeder error:", err);
  }

  await app.listen(port);

  console.log(`🚀 Subscriptions Service running on port ${port}`);
  console.log(`📚 Swagger docs available at http://localhost:${port}/api/docs`);
}

bootstrap();