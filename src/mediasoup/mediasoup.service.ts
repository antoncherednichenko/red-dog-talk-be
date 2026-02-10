import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mediasoup from 'mediasoup';
import { Worker, Router, WebRtcTransport, Producer, Consumer } from 'mediasoup/node/lib/types';
import { config } from './mediasoup.config';

@Injectable()
export class MediasoupService implements OnModuleInit {
  private worker: Worker;
  private routers: Map<string, Router> = new Map();
  private transports: Map<string, WebRtcTransport> = new Map();
  private producers: Map<string, Producer> = new Map();
  private consumers: Map<string, Consumer> = new Map();

  async onModuleInit() {
    this.worker = await mediasoup.createWorker({
      logLevel: config.worker.logLevel,
      logTags: config.worker.logTags,
      rtcMinPort: config.worker.rtcMinPort,
      rtcMaxPort: config.worker.rtcMaxPort,
    });

    this.worker.on('died', () => {
      console.error('mediasoup worker died, exiting in 2 seconds... [pid:%d]', this.worker.pid);
      setTimeout(() => process.exit(1), 2000);
    });
  }

  async getRouter(roomId: string): Promise<Router> {
    let router = this.routers.get(roomId);
    if (!router) {
      router = await this.worker.createRouter({ mediaCodecs: config.router.mediaCodecs });
      this.routers.set(roomId, router);
    }
    return router;
  }

  async createWebRtcTransport(roomId: string): Promise<WebRtcTransport> {
    const router = await this.getRouter(roomId);
    const transport = await router.createWebRtcTransport({
      listenIps: config.webRtcTransport.listenIps,
      initialAvailableOutgoingBitrate: config.webRtcTransport.initialAvailableOutgoingBitrate,
      appData: { roomId },
    });

    this.transports.set(transport.id, transport);

    transport.on('dtlsstatechange', (dtlsState) => {
      if (dtlsState === 'closed') {
        transport.close();
        this.transports.delete(transport.id);
      }
    });

    // Clean up if router closes
    transport.on('routerclose', () => {
        this.transports.delete(transport.id);
    });

    return transport;
  }

  getTransport(transportId: string): WebRtcTransport | undefined {
    return this.transports.get(transportId);
  }

  getProducer(producerId: string): Producer | undefined {
    return this.producers.get(producerId);
  }

  getConsumer(consumerId: string): Consumer | undefined {
    return this.consumers.get(consumerId);
  }

  async connectTransport(transportId: string, dtlsParameters: any) {
    const transport = this.getTransport(transportId);
    if (transport) {
      await transport.connect({ dtlsParameters });
    }
  }

  async createProducer(transportId: string, kind: 'audio' | 'video', rtpParameters: any): Promise<Producer> {
    const transport = this.getTransport(transportId);
    if (!transport) throw new Error(`Transport ${transportId} not found`);

    const producer = await transport.produce({ kind, rtpParameters });
    this.producers.set(producer.id, producer);

    producer.on('transportclose', () => {
      producer.close();
      this.producers.delete(producer.id);
    });

    return producer;
  }

  async createConsumer(transportId: string, producerId: string, rtpCapabilities: any): Promise<Consumer> {
    const transport = this.getTransport(transportId);
    if (!transport) throw new Error(`Transport ${transportId} not found`);

    const roomId = transport.appData.roomId as string;
    const router = this.routers.get(roomId);

    if (!router) {
        throw new Error(`Router for room ${roomId} not found`);
    }

    if (!router.canConsume({ producerId, rtpCapabilities })) {
      throw new Error('Cannot consume');
    }

    const consumer = await transport.consume({
      producerId,
      rtpCapabilities,
      paused: true,
    });

    this.consumers.set(consumer.id, consumer);
    
    consumer.on('transportclose', () => {
      consumer.close();
      this.consumers.delete(consumer.id);
    });

    consumer.on('producerclose', () => {
      consumer.close();
      this.consumers.delete(consumer.id);
    });
    
    return consumer;
  }

  async resumeConsumer(consumerId: string) {
    const consumer = this.consumers.get(consumerId);
    if (consumer) {
      await consumer.resume();
    }
  }
}
