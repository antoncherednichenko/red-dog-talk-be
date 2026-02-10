import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MediasoupService } from './mediasoup.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MediasoupGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly mediasoupService: MediasoupService) {}

  @SubscribeMessage('mediasoup:get_capabilities')
  async getRouterRtpCapabilities(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string },
  ) {
    const router = await this.mediasoupService.getRouter(payload.roomId);
    return router.rtpCapabilities;
  }

  @SubscribeMessage('mediasoup:create_transport')
  async createWebRtcTransport(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string },
  ) {
    const transport = await this.mediasoupService.createWebRtcTransport(payload.roomId);
    
    return {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
    };
  }

  @SubscribeMessage('mediasoup:connect_transport')
  async connectWebRtcTransport(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { transportId: string; dtlsParameters: any },
  ) {
    await this.mediasoupService.connectTransport(payload.transportId, payload.dtlsParameters);
    return {};
  }

  @SubscribeMessage('mediasoup:produce')
  async produce(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { transportId: string; kind: 'audio' | 'video'; rtpParameters: any; roomId: string },
  ) {
    const producer = await this.mediasoupService.createProducer(payload.transportId, payload.kind, payload.rtpParameters);
    
    // Broadcast new producer to room
    client.to(payload.roomId).emit('mediasoup:new_producer', {
        producerId: producer.id,
        socketId: client.id,
    });
    
    return { id: producer.id };
  }

  @SubscribeMessage('mediasoup:consume')
  async consume(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { transportId: string; producerId: string; rtpCapabilities: any },
  ) {
    try {
      const consumer = await this.mediasoupService.createConsumer(
        payload.transportId,
        payload.producerId,
        payload.rtpCapabilities,
      );
      
      return {
        id: consumer.id,
        producerId: payload.producerId,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
      };
    } catch (error) {
      console.error('Consume error', error);
      throw error;
    }
  }

  @SubscribeMessage('mediasoup:resume_consumer')
  async resumeConsumer(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { consumerId: string },
  ) {
    await this.mediasoupService.resumeConsumer(payload.consumerId);
    return {};
  }
}
