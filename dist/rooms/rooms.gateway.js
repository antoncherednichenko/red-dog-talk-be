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
exports.RoomsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const room_members_service_1 = require("../room-members/room-members.service");
const client_1 = require("@prisma/client");
const user_entity_1 = require("../users/entities/user.entity");
let RoomsGateway = class RoomsGateway {
    constructor(roomMembersService) {
        this.roomMembersService = roomMembersService;
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    async handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
        const userId = client.data.userId;
        const roomId = client.data.roomId;
        if (userId && roomId) {
            const member = await this.roomMembersService.updateStatus(roomId, userId, client_1.RoomMemberStatus.OFFLINE);
            const memberEntity = this.transformToEntity(member);
            this.server.to(roomId).emit('member:status_changed', memberEntity);
        }
    }
    async handleJoinRoom(client, payload) {
        const { roomId, userId } = payload;
        client.join(roomId);
        client.data.userId = userId;
        client.data.roomId = roomId;
        const member = await this.roomMembersService.updateStatus(roomId, userId, client_1.RoomMemberStatus.ONLINE);
        const memberEntity = this.transformToEntity(member);
        this.server.to(roomId).emit('member:status_changed', memberEntity);
    }
    async handleLeaveRoom(client, payload) {
        const { roomId, userId } = payload;
        client.leave(roomId);
        client.data.userId = null;
        client.data.roomId = null;
        const member = await this.roomMembersService.updateStatus(roomId, userId, client_1.RoomMemberStatus.OFFLINE);
        const memberEntity = this.transformToEntity(member);
        this.server.to(roomId).emit('member:status_changed', memberEntity);
    }
    async handleUpdateStatus(client, payload) {
        const { roomId, userId, status } = payload;
        const member = await this.roomMembersService.updateStatus(roomId, userId, status);
        const memberEntity = this.transformToEntity(member);
        this.server.to(roomId).emit('member:status_changed', memberEntity);
    }
    transformToEntity(member) {
        if (member.user) {
            return {
                ...member,
                user: new user_entity_1.UserEntity(member.user),
            };
        }
        return member;
    }
};
exports.RoomsGateway = RoomsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RoomsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('room:join'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], RoomsGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('room:leave'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], RoomsGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('member:update_status'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], RoomsGateway.prototype, "handleUpdateStatus", null);
exports.RoomsGateway = RoomsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [room_members_service_1.RoomMembersService])
], RoomsGateway);
//# sourceMappingURL=rooms.gateway.js.map