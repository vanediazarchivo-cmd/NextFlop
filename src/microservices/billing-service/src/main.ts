import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // CORS configuration
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
    credentials: true,
  })

  // Swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle("Nextflop Billing Service")
    .setDescription("Payment Processing and Billing API for Nextflop platform")
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
    .build()

  const document = SwaggerModule.createDocument(app, config)
  // Mount docs at /api/docs (global prefix will be applied)
  SwaggerModule.setup("docs", app, document)

  const port = process.env.PORT || 3003
  // Set a global prefix so all endpoints are available under /api/* when proxied by Kong
  app.setGlobalPrefix('api')
  await app.listen(port)

  console.log(`🚀 Billing Service running on port ${port}`)
  console.log(`📚 Swagger docs available at http://localhost:${port}/api/docs`)
}

bootstrap()
