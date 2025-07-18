import { Module } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { DataService } from '../data.service';
import { SubscriptionModule } from '../subscription/subscription.module';
import { NotificationService } from '../notification/notification.service';

@Module({
  imports: [SubscriptionModule],
  providers: [MonitoringService, DataService, NotificationService],
  exports: [MonitoringService],
})
export class MonitoringModule {}
