import { Server, Socket } from 'socket.io';
import { MediasoupService } from './mediasoup.service';
export declare class MediasoupGateway {
    private readonly mediasoupService;
    server: Server;
    constructor(mediasoupService: MediasoupService);
    getRouterRtpCapabilities(client: Socket, payload: {
        roomId: string;
    }): Promise<import("mediasoup/node/lib/rtpParametersTypes").RtpCapabilities>;
    createWebRtcTransport(client: Socket, payload: {
        roomId: string;
    }): Promise<{
        id: string;
        iceParameters: import("mediasoup/node/lib/WebRtcTransportTypes").IceParameters;
        iceCandidates: import("mediasoup/node/lib/WebRtcTransportTypes").IceCandidate[];
        dtlsParameters: import("mediasoup/node/lib/WebRtcTransportTypes").DtlsParameters;
    }>;
    connectWebRtcTransport(client: Socket, payload: {
        transportId: string;
        dtlsParameters: any;
    }): Promise<{}>;
    produce(client: Socket, payload: {
        transportId: string;
        kind: 'audio' | 'video';
        rtpParameters: any;
        roomId: string;
    }): Promise<{
        id: string;
    }>;
    consume(client: Socket, payload: {
        transportId: string;
        producerId: string;
        rtpCapabilities: any;
    }): Promise<{
        id: string;
        producerId: string;
        kind: import("mediasoup/node/lib/rtpParametersTypes").MediaKind;
        rtpParameters: import("mediasoup/node/lib/rtpParametersTypes").RtpParameters;
    }>;
    resumeConsumer(client: Socket, payload: {
        consumerId: string;
    }): Promise<{}>;
}
