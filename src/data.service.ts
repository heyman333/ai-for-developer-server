import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface DataFile {
  urls: string[];
}

@Injectable()
export class DataService {
  private readonly dataUrl =
    'https://raw.githubusercontent.com/heyman333/ai-articles/refs/heads/main/data.json';

  async getUrls(): Promise<string[]> {
    try {
      const response = await axios.get<DataFile>(this.dataUrl);
      return response.data.urls || [];
    } catch (error) {
      console.error('Error fetching data from GitHub:', error);
      return [];
    }
  }
}
