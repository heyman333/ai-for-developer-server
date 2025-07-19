import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataService } from '../data.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { NotificationService } from '../notification/notification.service';
import { promises as fs } from 'fs';
import * as path from 'path';

interface CachedData {
  urls: string[];
  lastChecked: string;
}

@Injectable()
export class MonitoringService {
  private readonly cacheFilePath = path.join(process.cwd(), 'data-cache.json');

  constructor(
    private readonly dataService: DataService,
    private readonly subscriptionService: SubscriptionService,
    private readonly notificationService: NotificationService,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async checkForDataChanges(): Promise<void> {
    try {
      const currentData = await this.dataService.getUrls();
      const cachedData = await this.getCachedData();

      const newUrls = currentData.filter(
        (url) => !cachedData.urls.includes(url),
      );

      if (newUrls.length > 0) {
        console.log(`Found ${newUrls.length} new articles`);
        await this.notifySubscribers(newUrls);
        await this.updateCache(currentData);
      }
    } catch (error) {
      console.error('Error checking for data changes:', error);
    }
  }

  private async notifySubscribers(newUrls: string[]): Promise<void> {
    const subscribers = await this.subscriptionService.getSubscriptions();

    if (subscribers.length === 0) {
      console.log('No subscribers to notify');
      return;
    }

    for (const url of newUrls) {
      const articleTitle = await this.getArticleTitle(url);
      await this.notificationService.sendBulkNotifications(
        subscribers,
        articleTitle,
        url,
      );
    }

    console.log(
      `Notified ${subscribers.length} subscribers about ${newUrls.length} new articles`,
    );
  }

  private async getArticleTitle(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      const html = await response.text();

      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        return titleMatch[1].trim();
      }

      return `새로운 AI 개발자 아티클 - ${url}`;
    } catch (error) {
      console.error('Error fetching article title:', error);
      return `새로운 AI 개발자 아티클 - ${url}`;
    }
  }

  private async getCachedData(): Promise<CachedData> {
    try {
      const data = await fs.readFile(this.cacheFilePath, 'utf8');
      return JSON.parse(data) as CachedData;
    } catch {
      return { urls: [], lastChecked: new Date().toISOString() };
    }
  }

  private async updateCache(urls: string[]): Promise<void> {
    const cacheData: CachedData = {
      urls,
      lastChecked: new Date().toISOString(),
    };

    await fs.writeFile(this.cacheFilePath, JSON.stringify(cacheData, null, 2));
  }

  async initializeCache(): Promise<void> {
    try {
      const currentData = await this.dataService.getUrls();
      await this.updateCache(currentData);
      console.log('Cache initialized with current data');
    } catch (error) {
      console.error('Error initializing cache:', error);
    }
  }
}
