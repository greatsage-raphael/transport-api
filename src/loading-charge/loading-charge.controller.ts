import { Controller, Post, Body, Param, Patch } from '@nestjs/common'; // <-- Add Param and Patch
import { LoadingChargeService } from './loading-charge.service';

@Controller('loading-charge')
export class LoadingChargeController {
  constructor(private readonly loadingChargeService: LoadingChargeService) {}

  @Post()
  create(@Body() createLoadingChargeDto: any) {
    return this.loadingChargeService.create(createLoadingChargeDto);
  }

  // ADD THIS NEW METHOD
  @Patch(':uuid/confirm') // Use PATCH for partial updates
  confirmOffloading(
    @Param('uuid') uuid: string,
    @Body() confirmDto: any,
  ) {
    return this.loadingChargeService.confirm(uuid, confirmDto);
  }
}
