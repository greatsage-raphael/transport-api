import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { supabase } from 'src/integrations/supabase/client';

@Injectable()
export class LoadingChargeService {
  private readonly logger = new Logger(LoadingChargeService.name);

  constructor(private eventEmitter: EventEmitter2) { }

  async create(createLoadingChargeDto: any) {
    // Here you would add all your server-side validation logic
    // For now, we'll just insert the data into Supabase

    const { data: newCharge, error } = await supabase
      .from('loading_charge')
      .insert([createLoadingChargeDto])
      .select()
      .single();

    if (error) {
      console.error('Error creating loading charge:', error);
      throw new Error(error.message);
    }

    // If creation is successful, emit the event with the new charge's data
    this.logger.log(`Emitting 'loadingcharge.created' event for charge ID: ${newCharge.transaction_id}`);

    this.eventEmitter.emit('loadingcharge.created', newCharge);

    return newCharge;
  }

  async confirm(uuid: string, confirmDto: any) {
    this.logger.log(`Received request to confirm offloading for UUID: ${uuid}`);

    const updateData = {
      status: 'completed',
      offloading_location: confirmDto.offloading_location,
      offloading_photo: confirmDto.offloading_photo,
      distance_travelled: confirmDto.distance_travelled,
      time_taken: confirmDto.time_taken,
      updated_at: new Date().toISOString(), // Ensure updated_at is set
    };

    const { data: updatedCharge, error } = await supabase
      .from('loading_charge')
      .update(updateData)
      .eq('transaction_uuid', uuid)
      .select()
      .single();

    if (error) {
      this.logger.error(`Supabase update error for UUID ${uuid}:`, error.message);
      throw new Error(error.message);
    }

    // If update is successful, emit the new event
    this.logger.log(`Emitting 'loadingcharge.confirmed' event for charge ID: ${updatedCharge.transaction_id}`);
    this.eventEmitter.emit('loadingcharge.confirmed', updatedCharge);

    return updatedCharge;
  }
}
