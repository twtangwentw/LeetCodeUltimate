// 初始化
const vscodeElement = document.createElement("div");
const statusElement = document.createElement("div");
const messageElement = document.createElement("div");
const loadingElement = document.createElement("div");
vscodeElement.id = "vscode-status-box";
statusElement.id = "vscode-status";
messageElement.id = "vscode-message";
loadingElement.id = "vscode-loading";
vscodeElement.appendChild(statusElement);
vscodeElement.appendChild(messageElement);
vscodeElement.appendChild(loadingElement);
loadingElement.innerHTML = "<svg viewBox=\"0 0 1024 1024\" width=\"16px\" height=\"16px\"><path d=\"M980.752 313.697c-25.789-60.972-62.702-115.725-109.713-162.736-47.012-47.011-101.764-83.924-162.736-109.713C645.161 14.542 578.106 1 509 1c-2.242 0-4.48 0.015-6.715 0.043-16.567 0.211-29.826 13.812-29.615 30.38 0.209 16.438 13.599 29.618 29.99 29.618l0.39-0.002c1.98-0.026 3.963-0.039 5.95-0.039 61.033 0 120.224 11.947 175.93 35.508 53.82 22.764 102.162 55.359 143.683 96.879s74.115 89.862 96.88 143.683C949.054 392.776 961 451.967 961 513c0 16.568 13.432 30 30 30s30-13.432 30-30c0-69.106-13.541-136.162-40.248-199.303z\"/></svg>"

// 更新提示
const updateView = (newStatus) => {
    for (const key in newStatus) {
        status[key] = newStatus[key];
    }
    vscodeElement.className = status.type;
    // language=HTML
    messageElement.innerHTML = status.message;
    loadingElement.className = status.loading ? '' : 'hide';
};


// 和 VS Code 的连接状态
const status = {
    message: "初始化",
    type: "",
    loading: false
};

// 页面加载完成回调
window.addEventListener("load", () => {
    document.body.appendChild(vscodeElement);
    if (!checkLogin()) {
        updateView({message: "请先登录"});
    }
    // 循环检查是否登录了，登录了就开始连接 VS Code WebSocket 服务
    const checkLoginInterval = setInterval(() => {
        if (checkLogin()) {
            openConnection();
            clearInterval(checkLoginInterval);
        }
    }, 250);
});

// 检查是否登录了 LeetCode
const checkLogin = () => {
    return document.cookie.match(/LEETCODE_SESSION=(.+)/);
};

// 使用 WebSocket 和 VS Code 插件建立连接
const openConnection = () => {
    let error = false;
    updateView({message: "连接中", type: "info", loading: true});
    const ws = new WebSocket("ws://localhost:41314");
    ws.onopen = (event) => {
        console.log("LeetCode:Open", event);
        updateView({message: "已连接", type: "success", loading: false});
    };
    ws.onmessage = (event) => {
        console.log("LeetCode:Message", event);
        messageHandler(ws, JSON.parse(event.data)).then(() => {
            console.log("LeetCode:Message:messageHandler:callback:完成");
        });
    };
    ws.onerror = (event) => {
        error = true;
        console.log("LeetCode:Error", event);
    };
    ws.onclose = (event) => {
        console.log("LeetCode:Close", event);
        // 存在连接
        if (event.code === 1000) {
            updateView({message: "存在连接<br>当前连接被丢弃", type: "info"})
            return;
        }
        // 正常退出
        if (!error) {
            window.close();
            return;
        }
        updateView({message: "连接断开<br>准备自动重连", type: "error", loading: true});
        setTimeout(() => {
            openConnection();
        }, 2500);
    };
};