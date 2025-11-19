import { Module } from '@nestjs/common';
import { LoadingChargeService } from './loading-charge.service';
import { LoadingChargeController } from './loading-charge.controller';

@Module({
  controllers: [LoadingChargeController],
  providers: [LoadingChargeService],
})
export class LoadingChargeModule {}
