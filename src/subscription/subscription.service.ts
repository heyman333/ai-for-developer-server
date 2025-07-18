import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class SubscriptionService {
  private readonly subscriptionFilePath = path.join(
    process.cwd(),
    'subscriptions.json',
  );

  async subscribe(email: string): Promise<{ message: string; email: string }> {
    const subscriptions = await this.getSubscriptions();

    if (subscriptions.includes(email)) {
      return { message: 'Already subscribed', email };
    }

    subscriptions.push(email);
    await this.saveSubscriptions(subscriptions);

    return { message: 'Successfully subscribed', email };
  }

  async unsubscribe(
    email: string,
  ): Promise<{ message: string; email: string }> {
    const subscriptions = await this.getSubscriptions();
    const index = subscriptions.indexOf(email);

    if (index === -1) {
      return { message: 'Email not found in subscriptions', email };
    }

    subscriptions.splice(index, 1);
    await this.saveSubscriptions(subscriptions);

    return { message: 'Successfully unsubscribed', email };
  }

  async getSubscriptions(): Promise<string[]> {
    try {
      const data = await fs.readFile(this.subscriptionFilePath, 'utf8');
      return JSON.parse(data) as string[];
    } catch {
      return [];
    }
  }

  private async saveSubscriptions(subscriptions: string[]): Promise<void> {
    await fs.writeFile(
      this.subscriptionFilePath,
      JSON.stringify(subscriptions, null, 2),
    );
  }
}
