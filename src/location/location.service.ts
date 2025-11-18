import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class LocationService {
    private readonly apiKey: string;
    private readonly baseUrl = 'https://api.locationiq.com/v1';
    private readonly routeUrl = 'https://us1.locationiq.com/v1/directions/driving';

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        const apiKey = this.configService.get<string>('LOCATIONIQ_API_KEY');
        if (!apiKey) {
            throw new Error('LOCATIONIQ_API_KEY environment variable is required');
        }
        this.apiKey = apiKey;
    }

    // 1. Proxy for Autocomplete Search
    async searchPlace(query: string) {
        try {
            const response = await lastValueFrom(
                this.httpService.get(`${this.baseUrl}/autocomplete`, {
                    params: {
                        key: this.apiKey, // Key is added here, server-side
                        q: query,
                        limit: 5,
                        normalizecity: 1,
                        format: 'json',
                    },
                }),
            );
            return response.data;
        } catch (error) {
            throw new HttpException(
                'Failed to fetch location data',
                HttpStatus.BAD_GATEWAY,
            );
        }
    }

    // 2. Proxy for Routing
    async getRoute(startLat: number, startLon: number, endLat: number, endLon: number) {
        try {
            // LocationIQ format: lon,lat;lon,lat
            const coordinates = `${startLon},${startLat};${endLon},${endLat}`;

            const response = await lastValueFrom(
                this.httpService.get(`${this.routeUrl}/${coordinates}`, {
                  params: {
                    key: this.apiKey,
                    steps: 'true', // CHANGE: ask for turn-by-turn steps
                    geometries: 'polyline',
                    overview: 'full',
                  },
                }),
              );
            return response.data;
        } catch (error) {
            throw new HttpException(
                'Failed to fetch route data',
                HttpStatus.BAD_GATEWAY,
            );
        }
    }
}
