import { Disposable } from "vscode";
import * as expressWs from "express-ws";
import * as express from "express";
import { WebSocket } from "ws";
import { exec } from "child_process";
import { Server } from "http";
import { Express } from "express";

/**
 * WebSocket 服务类
 */
class WebSocketService implements Disposable {

    private server: Server;
    private client?: WebSocket;
    private readonly port = 41314;

    /**
     * 消息发送后对应的回调
     */
    private callbacks: Record<number, (msg: any) => void> = {};
    private currentCallbackKey = 1;

    /**
     * 启动 WebSocket 服务
     */
    constructor() {
        console.log("启动 WebSocket 服务");
        exec("start https://leetcode.cn/404/?leet-code-ultimate=true");
        const app = express();
        this.initCors(app);
        this.initWs(app);
        console.log("WebSocket 服务启动完成");
        this.server = app.listen(this.port);
    }

    /**
     * 初始化 跨域配置
     */
    private initCors(app: Express) {
        console.log("允许跨域");
        app.all("*", function (_req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "*");
            res.header("Access-Control-Allow-Headers", "*");
            next();
        });
    }

    /**
     * 初始化 WebSocket 配置
     */
    private initWs(app: Express) {
        expressWs(app).app.ws("/", ws => {
            // 只保留一个 浏览器 端连接
            if (this.client) {
                ws.close(1000);
                return;
            }
            console.log("连接 LeetCodeUltimate 浏览器插件成功");
            this.client = ws;
            this.client.onclose = () => {
                this.client = undefined;
            };
            this.client.onmessage = (event) => {
                console.log("收到Message", event);
                this.messageHandler(typeof event.data === "string" ? JSON.parse(event.data) : event.data);
            };
        });
    }

    /**
     * 停止 WebSocket 服务
     */
    dispose(): any {
        this.server.close();
    }

    /**
     * 是否连接
     */
    isConnection(): boolean {
        return !!this.client;
    }

    /**
     * 发送消息
     */
    async send<T>(msg: any, timeout: number = 3000): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            if (!this.client) {
                return reject("没有浏览器插件连接");
            }
            const key = this.currentCallbackKey++;
            this.callbacks[key] = (msg) => {
                clearTimeout(timeoutHandler);
                if (typeof msg.result === "string") {
                    return reject(msg.result);
                }
                resolve(msg.result);
            };
            const cancel = (error: any) => {
                delete this.callbacks[key];
                reject(error);
            };
            const timeoutHandler = setTimeout(() => {
                cancel("请求超时");
            }, timeout);
            this.client.send(JSON.stringify({...msg, key}));
        });
    }

    /**
     * 处理 WebSocket Client 信息
     */
    private messageHandler(msg: any) {
        this.callbacks[msg.key]?.(msg);
    }
}

/**
 * 全局 WebSocketService 变量
 */
export const webSocketService = new WebSocketService();