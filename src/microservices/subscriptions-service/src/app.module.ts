import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { ScheduleModule } from "@nestjs/schedule"

// Domain modules
import { SubscriptionsModule } from "./presentation/modules/subscriptions.module"
import { PlansModule } from "./presentation/modules/plans.module"

// Infrastructure
import { DatabaseModule } from "./infrastructure/database/database.module"
import { RabbitMQModule } from "./infrastructure/messaging/rabbitmq.module"
import { HttpModule } from "@nestjs/axios"
import SubscriptionPlanSeeder from "./infrastructure/seeds/subscription-plan.seeder"

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    // Schedule for cron jobs
    ScheduleModule.forRoot(),

    // HTTP client for external services
    HttpModule,

    // Database connection
    DatabaseModule,

    // Messaging
    RabbitMQModule,

    // Feature modules
    SubscriptionsModule,
    PlansModule,
  ],
  providers: [SubscriptionPlanSeeder],
})
export class AppModule {}
