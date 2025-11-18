import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LocationModule } from './location/location.module';
import { JourneyGateway } from './journey/journey.gateway';

@Module({
  imports: [
    // Loads .env file globally
    ConfigModule.forRoot({ isGlobal: true }), 
    LocationModule,
  ],
  providers: [JourneyGateway],
})
export class AppModule {}
