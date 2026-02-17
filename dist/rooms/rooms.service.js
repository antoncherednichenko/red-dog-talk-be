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
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let RoomsService = class RoomsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createRoomDto, userId) {
        return this.prisma.room.create({
            data: {
                ...createRoomDto,
                ownerId: userId,
                members: {
                    create: {
                        userId: userId,
                        status: client_1.RoomMemberStatus.ONLINE,
                    },
                },
            },
        });
    }
    async findAll(userId) {
        return this.prisma.room.findMany({
            where: {
                members: {
                    some: {
                        userId: userId,
                    },
                },
            },
            select: {
                id: true,
                name: true,
                ownerId: true,
                type: true,
            },
        });
    }
    async findOne(id) {
        const room = await this.prisma.room.findUnique({
            where: { id },
        });
        if (!room) {
            throw new common_1.NotFoundException(`Room with id ${id} not found`);
        }
        return room;
    }
    async getMembers(roomId) {
        const room = await this.prisma.room.findUnique({
            where: { id: roomId },
            include: {
                members: {
                    include: {
                        user: true
                    }
                }
            }
        });
        if (!room) {
            throw new common_1.NotFoundException(`Room with id ${roomId} not found`);
        }
        return room.members;
    }
    async update(id, updateRoomDto, userId) {
        const room = await this.findOne(id);
        if (room.ownerId !== userId) {
            throw new common_1.BadRequestException('Only owner can update the room');
        }
        return this.prisma.room.update({
            where: { id },
            data: updateRoomDto,
        });
    }
    async remove(id, userId) {
        const room = await this.findOne(id);
        if (room.ownerId !== userId) {
            throw new common_1.BadRequestException('Only owner can delete the room');
        }
        return this.prisma.room.delete({
            where: { id },
        });
    }
    async join(roomId, userId) {
        const room = await this.prisma.room.findUnique({
            where: { id: roomId },
            include: { members: true }
        });
        if (!room) {
            throw new common_1.NotFoundException(`Room with id ${roomId} not found`);
        }
        const isMember = room.members.some((m) => m.userId === userId);
        if (isMember) {
            return room;
        }
        if (room.members.length >= 5) {
            throw new common_1.BadRequestException('Room is full (max 5 members)');
        }
        await this.prisma.roomMember.create({
            data: {
                roomId,
                userId,
                status: client_1.RoomMemberStatus.ONLINE,
            }
        });
        return this.findOne(roomId);
    }
    async leave(roomId, userId) {
        const room = await this.prisma.room.findUnique({
            where: { id: roomId },
            include: { members: true }
        });
        if (!room) {
            throw new common_1.NotFoundException(`Room with id ${roomId} not found`);
        }
        const member = room.members.find((m) => m.userId === userId);
        if (!member) {
            throw new common_1.BadRequestException('User is not a member of this room');
        }
        await this.prisma.roomMember.delete({
            where: {
                roomId_userId: {
                    roomId,
                    userId
                }
            }
        });
        return this.findOne(roomId);
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map