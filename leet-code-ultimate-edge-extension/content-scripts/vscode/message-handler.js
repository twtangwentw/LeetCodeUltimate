// 处理信息
/**
 * @param {WebSocket} ws
 * @param {{id: number, command: string, args: any}} message
 */
const messageHandler = async (ws, message) => {
    const command = commandsMap[message.command]
    ws.send(JSON.stringify({
        ...message,
        result: command ? await command(message.args) : "不支持的命令"
    }));
};