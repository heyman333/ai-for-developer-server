import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor() {
    // 개발용 테스트 설정 (실제 운영시에는 환경변수로 설정)
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'your-email@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password',
      },
    });
  }

  async sendTestEmail(
    to: string,
    subject: string,
    text: string,
  ): Promise<boolean> {
    console.log(process.env.SMTP_USER, process.env.SMTP_PASS);
    try {
      const mailOptions = {
        from: process.env.SMTP_USER || 'your-email@gmail.com',
        to,
        subject,
        text,
        html: `<p>${text}</p>`,
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const info = await this.transporter.sendMail(mailOptions);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log('Email sent:', info.messageId);
      return true;
    } catch (error: unknown) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email server connection verified');
      return true;
    } catch (error: unknown) {
      console.error('Email server connection failed:', error);
      return false;
    }
  }
}
