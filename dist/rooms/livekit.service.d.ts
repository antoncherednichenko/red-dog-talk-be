type CreateAccessTokenParams = {
    roomName: string;
    identity: string;
    name?: string;
};
export declare class LivekitService {
    createAccessToken(params: CreateAccessTokenParams): Promise<{
        token: string;
        url: string;
        roomName: string;
        identity: string;
    }>;
}
export {};
