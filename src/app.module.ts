import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataService } from './data.service';
import { MetadataService } from './metadata.service';
import { SubscriptionModule } from './subscription/subscription.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    SubscriptionModule,
    MonitoringModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService, DataService, MetadataService],
})
export class AppModule {}
