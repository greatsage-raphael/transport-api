import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailEvents } from './email.events'; // Import the new events class

@Module({
  providers: [EmailService, EmailEvents], // Add EmailEvents here
  exports: [EmailService],
})
export class EmailModule {}
