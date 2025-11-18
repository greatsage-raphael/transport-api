import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { LocationService } from './location.service';
import { SearchLocationDto, RouteDto } from './dto/search-location.dto';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('search')
  @UsePipes(new ValidationPipe({ transform: true }))
  search(@Query() params: SearchLocationDto) {
    return this.locationService.searchPlace(params.query);
  }

  @Get('route')
  @UsePipes(new ValidationPipe({ transform: true }))
  getRoute(@Query() params: RouteDto) {
    return this.locationService.getRoute(
      params.startLat,
      params.startLon,
      params.endLat,
      params.endLon,
    );
  }
}
