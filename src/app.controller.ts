import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MetadataService, UrlMetadata } from './metadata.service';
import { DataService } from './data.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dataService: DataService,
    private readonly metadataService: MetadataService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('metadata')
  async getMetadata(): Promise<UrlMetadata[]> {
    const urls = await this.dataService.getUrls();
    return this.metadataService.getAllMetadata(urls);
  }
}
