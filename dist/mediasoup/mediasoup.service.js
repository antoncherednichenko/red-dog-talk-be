"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediasoupService = void 0;
const common_1 = require("@nestjs/common");
const mediasoup = require("mediasoup");
const mediasoup_config_1 = require("./mediasoup.config");
let MediasoupService = class MediasoupService {
    constructor() {
        this.routers = new Map();
        this.transports = new Map();
        this.producers = new Map();
        this.consumers = new Map();
    }
    async onModuleInit() {
        this.worker = await mediasoup.createWorker({
            logLevel: mediasoup_config_1.config.worker.logLevel,
            logTags: mediasoup_config_1.config.worker.logTags,
            rtcMinPort: mediasoup_config_1.config.worker.rtcMinPort,
            rtcMaxPort: mediasoup_config_1.config.worker.rtcMaxPort,
        });
        this.worker.on('died', () => {
            console.error('mediasoup worker died, exiting in 2 seconds... [pid:%d]', this.worker.pid);
            setTimeout(() => process.exit(1), 2000);
        });
    }
    async getRouter(roomId) {
        let router = this.routers.get(roomId);
        if (!router) {
            router = await this.worker.createRouter({
                mediaCodecs: mediasoup_config_1.config.router.mediaCodecs,
            });
            this.routers.set(roomId, router);
        }
        return router;
    }
    async createWebRtcTransport(roomId) {
        const router = await this.getRouter(roomId);
        const transport = await router.createWebRtcTransport({
            listenIps: mediasoup_config_1.config.webRtcTransport.listenIps,
            initialAvailableOutgoingBitrate: mediasoup_config_1.config.webRtcTransport.initialAvailableOutgoingBitrate,
            appData: { roomId },
        });
        this.transports.set(transport.id, transport);
        transport.on('dtlsstatechange', (dtlsState) => {
            if (dtlsState === 'closed') {
                transport.close();
                this.transports.delete(transport.id);
            }
        });
        transport.on('routerclose', () => {
            this.transports.delete(transport.id);
        });
        return transport;
    }
    getTransport(transportId) {
        return this.transports.get(transportId);
    }
    getProducer(producerId) {
        return this.producers.get(producerId);
    }
    getConsumer(consumerId) {
        return this.consumers.get(consumerId);
    }
    async connectTransport(transportId, dtlsParameters) {
        const transport = this.getTransport(transportId);
        if (transport) {
            await transport.connect({ dtlsParameters });
        }
    }
    async createProducer(transportId, kind, rtpParameters) {
        const transport = this.getTransport(transportId);
        if (!transport)
            throw new Error(`Transport ${transportId} not found`);
        const producer = await transport.produce({ kind, rtpParameters });
        this.producers.set(producer.id, producer);
        producer.on('transportclose', () => {
            producer.close();
            this.producers.delete(producer.id);
        });
        return producer;
    }
    async createConsumer(transportId, producerId, rtpCapabilities) {
        const transport = this.getTransport(transportId);
        if (!transport)
            throw new Error(`Transport ${transportId} not found`);
        const roomId = transport.appData.roomId;
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
    async resumeConsumer(consumerId) {
        const consumer = this.consumers.get(consumerId);
        if (consumer) {
            await consumer.resume();
        }
    }
};
exports.MediasoupService = MediasoupService;
exports.MediasoupService = MediasoupService = __decorate([
    (0, common_1.Injectable)()
], MediasoupService);
//# sourceMappingURL=mediasoup.service.js.map