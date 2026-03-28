import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AccessToken } from 'livekit-server-sdk';

type CreateAccessTokenParams = {
  roomName: string;
  identity: string;
  name?: string;
};

@Injectable()
export class LivekitService {
  async createAccessToken(params: CreateAccessTokenParams) {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const livekitUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !livekitUrl) {
      throw new InternalServerErrorException(
        'LiveKit is not configured. Set LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET.',
      );
    }

    const token = new AccessToken(apiKey, apiSecret, {
      identity: params.identity,
      name: params.name,
      ttl: 60 * 60,
    });

    token.addGrant({
      room: params.roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const jwt = await token.toJwt();

    return {
      token: jwt,
      url: livekitUrl,
      roomName: params.roomName,
      identity: params.identity,
    };
  }
}
