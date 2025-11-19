import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';

@Injectable()
export class EmailEvents {
    private readonly logger = new Logger(EmailEvents.name);
    private readonly adminEmail: string;

    constructor(
        private readonly emailService: EmailService,
        private readonly configService: ConfigService,
    ) {
        const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
        if (!adminEmail) {
            throw new Error('ADMIN_EMAIL environment variable is required');
        }
        this.adminEmail = adminEmail;
    }

    // This method listens for the 'loadingcharge.created' event
    @OnEvent('loadingcharge.created')
    handleLoadingChargeCreated(payload: any) {
        this.logger.log(`'loadingcharge.created' event received. Sending notification.`);

        this.logger.log(`'loadingcharge.created' HANDLER TRIGGERED. Payload: ${JSON.stringify(payload)}`);

        // Call the email service to send the notification
        this.emailService.sendLoadingChargeNotification(this.adminEmail, payload);
    }

    @OnEvent('loadingcharge.confirmed')
  handleLoadingChargeConfirmed(payload: any) {
    this.logger.log(`'loadingcharge.confirmed' event received. Sending notification.`);
    
    // Call a new method on the email service
    this.emailService.sendConfirmationNotification(this.adminEmail, payload);
  }
}