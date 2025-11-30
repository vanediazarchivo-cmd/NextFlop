import { Injectable, Logger } from "@nestjs/common";
import { ISubscriptionPlanRepository } from "../../domain/repositories/subscription-plan.repository.interface";
import { Inject } from "@nestjs/common";

@Injectable()
export class SubscriptionPlanSeeder {
  private readonly logger = new Logger(SubscriptionPlanSeeder.name);

  constructor(
    @Inject("ISubscriptionPlanRepository")
    private readonly planRepository: ISubscriptionPlanRepository,
  ) {}

  async seed(): Promise<void> {
    try {
      const names = ["Free", "Basic", "Premium"];
      for (const name of names) {
        const existing = await this.planRepository.findByName(name);
        if (!existing) {
          let planData: any;
          switch (name) {
            case "Free":
              planData = { name: "Free", price: 0, maxProfiles: 1 };
              break;
            case "Basic":
              planData = { name: "Basic", price: 9.99, maxProfiles: 2 };
              break;
            case "Premium":
              planData = { name: "Premium", price: 14.99, maxProfiles: 4 };
              break;
          }
          await this.planRepository.create(planData);
          this.logger.log(`Created subscription plan: ${name}`);
        }
      }
    } catch (err) {
      this.logger.error(`Error seeding subscription plans: ${err}`);
    }
  }
}

export default SubscriptionPlanSeeder;
