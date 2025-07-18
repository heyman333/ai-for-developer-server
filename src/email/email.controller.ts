import { Controller, Post, Get, Body } from '@nestjs/common';
import { EmailService } from './email.service';

export class SendEmailDto {
  to: string;
  subject: string;
  text: string;
}

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('test')
  async sendTestEmail(@Body() sendEmailDto: SendEmailDto) {
    const { to, subject, text } = sendEmailDto;

    const success = await this.emailService.sendTestEmail(to, subject, text);

    return {
      success,
      message: success
        ? '메일이 성공적으로 전송되었습니다.'
        : '메일 전송에 실패했습니다.',
      data: { to, subject, text },
    };
  }

  @Get('verify')
  async verifyEmailConnection() {
    const isConnected = await this.emailService.verifyConnection();

    return {
      success: isConnected,
      message: isConnected
        ? '메일 서버 연결이 정상입니다.'
        : '메일 서버 연결에 실패했습니다.',
    };
  }
}
