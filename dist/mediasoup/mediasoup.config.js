"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    worker: {
        logLevel: 'warn',
        logTags: ['info', 'ice', 'dtls', 'rtp', 'srtp', 'rtcp'],
        rtcMinPort: Number(process.env.MEDIASOUP_MIN_PORT ?? 40000),
        rtcMaxPort: Number(process.env.MEDIASOUP_MAX_PORT ?? 49999),
    },
    router: {
        mediaCodecs: [
            {
                kind: 'audio',
                mimeType: 'audio/opus',
                clockRate: 48000,
                channels: 2,
            },
            {
                kind: 'video',
                mimeType: 'video/VP8',
                clockRate: 90000,
                parameters: {
                    'x-google-start-bitrate': 1000,
                },
            },
        ],
    },
    webRtcTransport: {
        listenIps: [
            {
                ip: process.env.MEDIASOUP_LISTEN_IP ?? '0.0.0.0',
                announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP,
            },
        ],
        initialAvailableOutgoingBitrate: 1000000,
    },
};
//# sourceMappingURL=mediasoup.config.js.map