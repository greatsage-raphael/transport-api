import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchLocationDto {
  @IsString()
  @IsNotEmpty()
  query: string;
}

export class RouteDto {
  // Coordinates for Start
  @Type(() => Number)
  @IsNumber()
  startLat: number;

  @Type(() => Number)
  @IsNumber()
  startLon: number;

  // Coordinates for End
  @Type(() => Number)
  @IsNumber()
  endLat: number;

  @Type(() => Number)
  @IsNumber()
  endLon: number;
}