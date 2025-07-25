import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('subscribe')
  @HttpCode(HttpStatus.CREATED)
  subscribe(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.subscribe(createSubscriptionDto.email);
  }

  @Post('unsubscribe')
  @HttpCode(HttpStatus.OK)
  unsubscribe(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.unsubscribe(createSubscriptionDto.email);
  }
}
