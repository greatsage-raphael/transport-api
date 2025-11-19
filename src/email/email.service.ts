import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private appName = 'New World Ent Logistics';
  private frontendBaseUrl: string; // Add a class property to hold the URL

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });

    // Read the frontend URL from the .env file on initialization
    this.frontendBaseUrl = this.configService.get<string>('FRONTEND_BASE_URL') || 'http://localhost:3000';
    if (!this.configService.get<string>('FRONTEND_BASE_URL')) {
      this.logger.warn('FRONTEND_BASE_URL is not set in .env file. Using default URL. Email links may be broken.');
    }

    this.logger.log('Nodemailer transporter configured successfully.');
  }

  async sendLoadingChargeNotification(
    adminEmail: string,
    chargeDetails: any,
  ) {
    const subject = `New Loading Charge Created: #${chargeDetails.transaction_id}`;

    // --- DYNAMIC LINK CREATION ---
    // Construct the direct link to the offloading page for this specific charge
    const offloadingUrl = `${this.frontendBaseUrl}/offloading/${chargeDetails.transaction_uuid}`;

    // --- UPDATED HTML TEMPLATE ---
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; margin: 0; padding: 0; background-color: #f4f4f7; }
              .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
              .header { background-color: #1e3a8a; color: #ffffff; padding: 24px; text-align: center; }
              .header h1 { margin: 0; font-size: 24px; }
              .content { padding: 24px; }
              .content h2 { color: #1e3a8a; }
              .details-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              .details-table td { padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
              .details-table tr:last-child td { border-bottom: none; }
              .details-table .label { color: #64748b; font-weight: 500; width: 40%; }
              .details-table .value { color: #1e293b; font-weight: 600; }
              .button-container { text-align: center; margin-top: 32px; }
              .button { background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; }
              .footer { background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>New Loading Charge</h1>
              </div>
              <div class="content">
                  <p style="font-size: 16px; color: #334155;">A new loading charge has been successfully created and is now in transit.</p>
                  
                  <h2>Shipment Details</h2>
                  <table class="details-table">
                      <tr>
                          <td class="label">Transaction ID</td>
                          <td class="value">#${chargeDetails.transaction_id}</td>
                      </tr>
                      <tr>
                          <td class="label">Driver</td>
                          <td class="value">${chargeDetails.driver_name}</td>
                      </tr>
                      <tr>
                          <td class="label">Vehicle Number</td>
                          <td class="value">${chargeDetails.vehicle_number}</td>
                      </tr>
                      <tr>
                          <td class="label">Material</td>
                          <td class="value">${chargeDetails.material}</td>
                      </tr>
                      <tr>
                          <td class="label">Net Mass</td>
                          <td class="value">${chargeDetails.net_mass}</td>
                      </tr>
                  </table>

                  <div class="button-container">
                      <a href="${offloadingUrl}" class="button">View & Confirm Offloading</a>
                  </div>
              </div>
              <div class="footer">
                  &copy; ${new Date().getFullYear()} ${this.appName}. All rights reserved.
              </div>
          </div>
      </body>
      </html>
    `;

    try {
      const mailOptions = {
        from: `"${this.appName}" <${this.configService.get<string>('EMAIL_FROM_ADDRESS')}>`,
        to: adminEmail,
        subject: subject,
        html: html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${adminEmail}. Message ID: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${adminEmail}`, error.stack);
    }
  }

  async sendConfirmationNotification(
    adminEmail: string,
    chargeDetails: any,
  ) {
    const subject = `✓ Confirmed: Loading Charge #${chargeDetails.transaction_id} Offloaded`;
    const offloadingUrl = `${this.frontendBaseUrl}/offloading/${chargeDetails.transaction_uuid}`;

    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF--8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f7; }
              .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; }
              .header { background-color: #166534; /* A success green */ color: #ffffff; padding: 24px; text-align: center; border-radius: 8px 8px 0 0; }
              .header h1 { margin: 0; font-size: 24px; }
              .content { padding: 24px; }
              .details-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              .details-table td { padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
              .details-table .label { color: #64748b; font-weight: 500; }
              .details-table .value { color: #1e293b; font-weight: 600; }
              .button-container { text-align: center; margin-top: 32px; }
              .button { background-color: #4f46e5; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; }
              .footer { background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; }
          </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Shipment Completed</h1>
                </div>
                <div class="content">
                    <p style="font-size: 16px; color: #334155;">The loading charge for <strong>${chargeDetails.driver_name}</strong> has been successfully offloaded and confirmed.</p>
                    
                    <table class="details-table">
                        <tr>
                            <td class="label">Transaction ID</td>
                            <td class="value">#${chargeDetails.transaction_id}</td>
                        </tr>
                        <tr>
                            <td class="label">Vehicle</td>
                            <td class="value">${chargeDetails.vehicle_number}</td>
                        </tr>
                        <tr>
                            <td class="label">Distance Travelled</td>
                            <td class="value">${chargeDetails.distance_travelled || 'N/A'} km</td>
                        </tr>
                        <tr>
                            <td class="label">Transit Time</td>
                            <td class="value">${chargeDetails.time_taken ? Math.round(chargeDetails.time_taken) + ' minutes' : 'N/A'}</td>
                        </tr>
                    </table>

                    <div class="button-container">
                        <a href="${offloadingUrl}" class="button">View Completed Record</a>
                    </div>
                </div>
                <div class="footer">
                    &copy; ${new Date().getFullYear()} ${this.appName}. All rights reserved.
                </div>
            </div>
        </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: `"${this.appName}" <${this.configService.get<string>('EMAIL_FROM_ADDRESS')}>`,
        to: adminEmail,
        subject,
        html,
      });
      this.logger.log(`Confirmation email sent successfully to ${adminEmail}.`);
    } catch (error) {
      this.logger.error(`Failed to send confirmation email to ${adminEmail}`, error.stack);
    }
  }
}
