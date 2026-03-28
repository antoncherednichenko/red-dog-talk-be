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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomMessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RoomMessagesService = class RoomMessagesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllForRoom(roomId, userId, query) {
        await this.assertRoomMember(roomId, userId);
        const messages = await this.prisma.roomMessage.findMany({
            where: {
                roomId,
                createdAt: query.beforeCreatedAt
                    ? { lt: new Date(query.beforeCreatedAt) }
                    : undefined,
            },
            include: {
                author: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: query.limit ?? 50,
        });
        return messages.reverse();
    }
    async createForRoom(roomId, userId, dto) {
        await this.assertRoomMember(roomId, userId);
        return this.prisma.roomMessage.create({
            data: {
                roomId,
                authorId: userId,
                text: dto.text,
            },
            include: {
                author: true,
            },
        });
    }
    async assertRoomMember(roomId, userId) {
        const room = await this.prisma.room.findUnique({
            where: { id: roomId },
            select: { id: true },
        });
        if (!room) {
            throw new common_1.NotFoundException(`Room with id ${roomId} not found`);
        }
        const member = await this.prisma.roomMember.findUnique({
            where: {
                roomId_userId: {
                    roomId,
                    userId,
                },
            },
            select: { id: true },
        });
        if (!member) {
            throw new common_1.ForbiddenException('Only room members can access room chat');
        }
    }
};
exports.RoomMessagesService = RoomMessagesService;
exports.RoomMessagesService = RoomMessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoomMessagesService);
//# sourceMappingURL=room-messages.service.js.map