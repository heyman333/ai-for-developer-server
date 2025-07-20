import { Injectable } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import * as cheerio from 'cheerio';

export interface UrlMetadata {
  url: string;
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonical?: string;
  favicon?: string;
  statusCode?: number;
  contentType?: string;
  contentLength?: number;
  error?: string;
}

@Injectable()
export class MetadataService {
  async getMetadata(url: string): Promise<UrlMetadata> {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });

      const $ = cheerio.load(response.data as string);

      const metadata: UrlMetadata = {
        url,
        statusCode: response.status,
        contentType: response.headers['content-type'] as string,
        contentLength: response.headers['content-length']
          ? parseInt(response.headers['content-length'] as string)
          : undefined,

        // Basic meta tags
        title: $('title').text().trim() || undefined,
        description: $('meta[name="description"]').attr('content') || undefined,
        keywords: $('meta[name="keywords"]').attr('content') || undefined,
        author: $('meta[name="author"]').attr('content') || undefined,

        // Open Graph tags
        ogTitle: $('meta[property="og:title"]').attr('content') || undefined,
        ogDescription:
          $('meta[property="og:description"]').attr('content') || undefined,
        ogImage:
          $('meta[property="og:image"]').attr('content') ||
          this.findFirstImage($) ||
          undefined,
        ogUrl: $('meta[property="og:url"]').attr('content') || undefined,

        // Twitter Card tags
        twitterCard:
          $('meta[name="twitter:card"]').attr('content') || undefined,
        twitterTitle:
          $('meta[name="twitter:title"]').attr('content') || undefined,
        twitterDescription:
          $('meta[name="twitter:description"]').attr('content') || undefined,
        twitterImage:
          $('meta[name="twitter:image"]').attr('content') || undefined,

        // Other useful tags
        canonical: $('link[rel="canonical"]').attr('href') || undefined,
        favicon:
          $('link[rel="icon"]').attr('href') ||
          $('link[rel="shortcut icon"]').attr('href') ||
          undefined,
      };

      return metadata;
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        url,
        error: axiosError.message,
        statusCode: axiosError.response?.status,
      };
    }
  }

  async getAllMetadata(urls: string[]): Promise<UrlMetadata[]> {
    const promises = urls.map((url) => this.getMetadata(url));
    return Promise.all(promises);
  }

  private findFirstImage($: cheerio.CheerioAPI): string | undefined {
    const imageSelectors = [
      'img[src$=".jpg"]',
      'img[src$=".jpeg"]',
      'img[src$=".png"]',
      'img[src*=".jpg"]',
      'img[src*=".jpeg"]',
      'img[src*=".png"]',
    ];

    for (const selector of imageSelectors) {
      const firstImage = $(selector).first();
      if (firstImage.length > 0) {
        const src = firstImage.attr('src');
        if (src) {
          return src.startsWith('http') ? src : undefined;
        }
      }
    }

    return undefined;
  }
}
