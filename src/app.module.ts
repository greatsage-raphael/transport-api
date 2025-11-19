import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter'; // Import EventEmitterModule
import { LocationModule } from './location/location.module';
import { EmailModule } from './email/email.module'; // Import EmailModule
import { LoadingChargeModule } from './loading-charge/loading-charge.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(), // Add this to enable event handling
    LocationModule,
    EmailModule,
    LoadingChargeModule, // Add the new EmailModule
  ],
})
export class AppModule {}