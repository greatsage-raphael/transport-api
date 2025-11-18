// src/journey/journey.gateway.ts

import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { supabase } from '../integrations/supabase/client'; // Assuming you set up a Supabase client file

@WebSocketGateway({
  cors: {
    origin: '*', // In production, restrict this to your frontend's domain
  },
})
export class JourneyGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('JourneyGateway');

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('joinJourney')
  handleJoinJourney(client: Socket, journeyId: string): void {
    client.join(journeyId);
    this.logger.log(`Client ${client.id} joined journey room: ${journeyId}`);
    client.emit('joinedJourney', `Successfully joined room ${journeyId}`);
  }

  @SubscribeMessage('locationUpdate')
  async handleLocationUpdate(client: Socket, payload: { journeyId: string; lat: number; lng: number }): Promise<void> {
    const { journeyId, lat, lng } = payload;
    
    // 1. Broadcast the new location to everyone in the room (e.g., an admin watching)
    this.server.to(journeyId).emit('newLocation', { lat, lng });

    // 2. (Optional but recommended) Store location history in the database
    const { error } = await supabase
      .from('journey_locations')
      .insert({
        journey_uuid: journeyId,
        latitude: lat,
        longitude: lng,
      });

    if (error) {
      this.logger.error(`Failed to save location for journey ${journeyId}:`, error.message);
    }
  }
}
