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
exports.RoomMessagesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const create_room_message_dto_1 = require("./dto/create-room-message.dto");
const list_room_messages_dto_1 = require("./dto/list-room-messages.dto");
const room_messages_service_1 = require("./room-messages.service");
const room_message_entity_1 = require("./entities/room-message.entity");
const user_entity_1 = require("../users/entities/user.entity");
let RoomMessagesController = class RoomMessagesController {
    constructor(roomMessagesService) {
        this.roomMessagesService = roomMessagesService;
    }
    async findAll(roomId, req, query) {
        const messages = await this.roomMessagesService.findAllForRoom(roomId, req.user.id, query);
        return messages.map((message) => this.toEntity(message));
    }
    async create(roomId, req, dto) {
        const message = await this.roomMessagesService.createForRoom(roomId, req.user.id, dto);
        return this.toEntity(message);
    }
    toEntity(message) {
        return new room_message_entity_1.RoomMessageEntity({
            ...message,
            author: new user_entity_1.UserEntity(message.author),
        });
    }
};
exports.RoomMessagesController = RoomMessagesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, list_room_messages_dto_1.ListRoomMessagesDto]),
    __metadata("design:returntype", Promise)
], RoomMessagesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_room_message_dto_1.CreateRoomMessageDto]),
    __metadata("design:returntype", Promise)
], RoomMessagesController.prototype, "create", null);
exports.RoomMessagesController = RoomMessagesController = __decorate([
    (0, common_1.Controller)('rooms/:roomId/messages'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [room_messages_service_1.RoomMessagesService])
], RoomMessagesController);
//# sourceMappingURL=room-messages.controller.js.map