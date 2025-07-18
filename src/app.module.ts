import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataService } from './data.service';
import { MetadataService } from './metadata.service';
import { SubscriptionModule } from './subscription/subscription.module';
import { MonitoringModule } from './monitoring/monitoring.module';

@Module({
  imports: [ScheduleModule.forRoot(), SubscriptionModule, MonitoringModule],
  controllers: [AppController],
  providers: [AppService, DataService, MetadataService],
})
export class AppModule {}
