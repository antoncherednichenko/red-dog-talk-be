import { RtpCodecCapability, WorkerLogTag, TransportListenIp } from 'mediasoup/node/lib/types';
export declare const config: {
    worker: {
        logLevel: "warn";
        logTags: WorkerLogTag[];
        rtcMinPort: number;
        rtcMaxPort: number;
    };
    router: {
        mediaCodecs: RtpCodecCapability[];
    };
    webRtcTransport: {
        listenIps: TransportListenIp[];
        initialAvailableOutgoingBitrate: number;
    };
};
