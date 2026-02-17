import { OnModuleInit } from '@nestjs/common';
import { Router, WebRtcTransport, Producer, Consumer } from 'mediasoup/node/lib/types';
export declare class MediasoupService implements OnModuleInit {
    private worker;
    private routers;
    private transports;
    private producers;
    private consumers;
    onModuleInit(): Promise<void>;
    getRouter(roomId: string): Promise<Router>;
    createWebRtcTransport(roomId: string): Promise<WebRtcTransport>;
    getTransport(transportId: string): WebRtcTransport | undefined;
    getProducer(producerId: string): Producer | undefined;
    getConsumer(consumerId: string): Consumer | undefined;
    connectTransport(transportId: string, dtlsParameters: any): Promise<void>;
    createProducer(transportId: string, kind: 'audio' | 'video', rtpParameters: any): Promise<Producer>;
    createConsumer(transportId: string, producerId: string, rtpCapabilities: any): Promise<Consumer>;
    resumeConsumer(consumerId: string): Promise<void>;
}
