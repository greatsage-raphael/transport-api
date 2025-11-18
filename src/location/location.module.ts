import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';

@Module({
  imports: [HttpModule], // Import HttpModule
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
