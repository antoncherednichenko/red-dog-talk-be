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
exports.RoomMembersController = void 0;
const common_1 = require("@nestjs/common");
const room_members_service_1 = require("./room-members.service");
const update_room_member_dto_1 = require("./dto/update-room-member.dto");
const passport_1 = require("@nestjs/passport");
let RoomMembersController = class RoomMembersController {
    constructor(roomMembersService) {
        this.roomMembersService = roomMembersService;
    }
    updateStatus(roomId, updateStatusDto, req) {
        return this.roomMembersService.updateStatus(roomId, req.user.id, updateStatusDto.status);
    }
};
exports.RoomMembersController = RoomMembersController;
__decorate([
    (0, common_1.Patch)(':roomId/status'),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_room_member_dto_1.UpdateRoomMemberStatusDto, Object]),
    __metadata("design:returntype", void 0)
], RoomMembersController.prototype, "updateStatus", null);
exports.RoomMembersController = RoomMembersController = __decorate([
    (0, common_1.Controller)('room-members'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [room_members_service_1.RoomMembersService])
], RoomMembersController);
//# sourceMappingURL=room-members.controller.js.map