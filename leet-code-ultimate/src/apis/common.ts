import { webSocketService } from "../services/WebSocketService";

/**
 * LeetCodeUltimate 公共 API
 * @param msg 参数
 * @param timeout 请求超时时间
 */
export const leetCodeApi = async <T>(msg: { command: string, args: any }, timeout: number = 3000) => {
    return webSocketService.send<T>(msg, timeout);
};