import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendNewArticleNotification(
    email: string,
    articleTitle: string,
    articleUrl: string,
  ): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: `새로운 AI 개발자 아티클: ${articleTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">새로운 AI 개발자 아티클이 업데이트되었습니다!</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">${articleTitle}</h3>
            <p style="margin: 15px 0;">
              <a href="${articleUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                아티클 읽기
              </a>
            </p>
            <p style="margin: 20px 0 0 0; text-align: center;">
              <a href="https://ai-for-developer.vercel.app/" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                더 많은 글은 이곳에서 확인하세요!
              </a>
            </p>
          </div>
          <hr style="border: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">
            구독을 취소하려면 <a href="${process.env.BASE_URL}/subscription/unsubscribe">여기</a>를 클릭하세요.
          </p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendBulkNotifications(
    emails: string[],
    articleTitle: string,
    articleUrl: string,
  ): Promise<void> {
    const notifications = emails.map((email) =>
      this.sendNewArticleNotification(email, articleTitle, articleUrl),
    );

    await Promise.all(notifications);
  }
}
