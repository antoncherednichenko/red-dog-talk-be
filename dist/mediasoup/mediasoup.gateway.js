"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediasoupGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const mediasoup_service_1 = require("./mediasoup.service");
let MediasoupGateway = class MediasoupGateway {
    constructor(mediasoupService) {
        this.mediasoupService = mediasoupService;
    }
    async getRouterRtpCapabilities(client, payload) {
        const router = await this.mediasoupService.getRouter(payload.roomId);
        return router.rtpCapabilities;
    }
    async createWebRtcTransport(client, payload) {
        const transport = await this.mediasoupService.createWebRtcTransport(payload.roomId);
        return {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters,
        };
    }
    async connectWebRtcTransport(client, payload) {
        await this.mediasoupService.connectTransport(payload.transportId, payload.dtlsParameters);
        return {};
    }
    async produce(client, payload) {
        const producer = await this.mediasoupService.createProducer(payload.transportId, payload.kind, payload.rtpParameters);
        client.to(payload.roomId).emit('mediasoup:new_producer', {
            producerId: producer.id,
            socketId: client.id,
        });
        return { id: producer.id };
    }
    async consume(client, payload) {
        try {
            const consumer = await this.mediasoupService.createConsumer(payload.transportId, payload.producerId, payload.rtpCapabilities);
            return {
                id: consumer.id,
                producerId: payload.producerId,
                kind: consumer.kind,
                rtpParameters: consumer.rtpParameters,
            };
        }
        catch (error) {
            console.error('Consume error', error);
            throw error;
        }
    }
    async resumeConsumer(client, payload) {
        await this.mediasoupService.resumeConsumer(payload.consumerId);
        return {};
    }
};
exports.MediasoupGateway = MediasoupGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MediasoupGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('mediasoup:get_capabilities'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MediasoupGateway.prototype, "getRouterRtpCapabilities", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('mediasoup:create_transport'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MediasoupGateway.prototype, "createWebRtcTransport", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('mediasoup:connect_transport'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MediasoupGateway.prototype, "connectWebRtcTransport", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('mediasoup:produce'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MediasoupGateway.prototype, "produce", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('mediasoup:consume'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MediasoupGateway.prototype, "consume", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('mediasoup:resume_consumer'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MediasoupGateway.prototype, "resumeConsumer", null);
exports.MediasoupGateway = MediasoupGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [mediasoup_service_1.MediasoupService])
], MediasoupGateway);
//# sourceMappingURL=mediasoup.gateway.js.map