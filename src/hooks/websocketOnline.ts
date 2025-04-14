/**
 * 检测在线用户数量
 * ws.readyState 只读属性 readyState 表示连接状态
 *  0:表示连接尚未建立。对应常量connecting，表示连接正在创建
 *  1:表示连接已建立，可以进行通信。
 *  2:表示连接正在进行关闭。
 *  3:表示连接已经关闭或者连接不能打开。
 */

class WebsocketOnline {
  ws: WebSocket | null = null;
  url: string = "";
  isOnLine = true;
  channelId = null;
  timer1 = 0;
  timer2 = 0;
  onReceiveMessage = (e) => {};
  onOpenConnect = (e) => {};
  onCloseConnect = (e) => {};

  constructor(url: string) {
    this.url = url;
  }
  connect() {
    if (!("WebSocket" in window)) {
      return console.log("current browser not support websocket");
    }
    if (this.getOnline()) {
      return console.log("您已经在线，不能重复上线");
    }

    this.channelId = null;
    this.ws = new WebSocket(this.url);
    this.ws.onopen = (e) => {
      console.log("websocket connection has established");
      this.clearTimer();
      this.timer1 = window.setInterval(() => {
        if (this.getOnline()) {
          this.ping();
        } else {
          console.log("ping fail.");
        }
      }, 5000);
      this.ping();
      this.onOpenConnect(e);
    };
    this.ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.msgType == "insertingCoil") {
        console.log("onmessage:", data);
      }
      if (!this.channelId) this.channelId = data.channelId;
      this.onReceiveMessage(e);
    };
    this.ws.onclose = (e) => {
      console.log("onclose:", e);
      if (this.isOnLine) {
        this.timer2 = window.setTimeout(() => {
          this.connect();
        }, 5000);
      }
      this.onCloseConnect(e);
    };
    this.ws.onerror = (e) => {
      this.clearTimer(); //连接关闭，清除登录状态
      this.clearCookie();
      console.log("socket error occurred:", e);
    };
  }
  send(message) {
    if (this.getOnline()) {
      const msg = JSON.stringify({ message, type: "message" });
      this.ws?.send(msg);
    } else {
      console.log("Send:", this.ws);
    }
  }
  close() {
    if (this.getOnline()) {
      this.clearTimer();
      this.ws?.close();
      console.log("connect closed.");
    } else {
      console.log(this.ws);
    }
  }
  getOnline() {
    return this.ws && this.ws.readyState == 1;
  }
  ping() {
    if (this.channelId) {
      this.ws?.send(JSON.stringify({ msgType: "ping", channelId: this.channelId }));
    } else {
      this.ws?.send(JSON.stringify({ msgType: "ping" }));
    }
  }
  clearTimer() {
    if (this.timer1) window.clearInterval(this.timer1);
    if (this.timer2) window.clearTimeout(this.timer2);
  }
  clearCookie() {
    const keys = document.cookie.match(/[^ =;]+(?==)/g);
    if (keys) {
      for (let i = keys.length; i--; ) {
        //清除当前域名下的,例如：m.kevis.com
        document.cookie = keys[i] + "=0;path=/;expires=" + new Date(0).toUTCString();
        //清除当前域名下的，例如 .m.kevis.com
        document.cookie = keys[i] + "=0;path=/;domain=" + document.domain + ";expires=" + new Date(0).toUTCString();
        //清除一级域名下的或指定的，例如 .kevis.com
        document.cookie = keys[i] + "=0;path=/;domain=kevis.com;expires=" + new Date(0).toUTCString();
      }
    }
    console.log("Cookie已清除");
  }
}

export type { WebsocketOnline };

/** 检测在线用户数 */
export const checkOnlineUser = (userCode: string, hostname: string) => {
  const socketUrl = `wss://${hostname}:8000/chat/${userCode}`;
  const ws = new WebsocketOnline(socketUrl);
  ws.onOpenConnect = (e) => {
    console.log("连接成功！");
  };
  ws.onReceiveMessage = (e) => {
    // const data = JSON.parse(e.data);
    // console.log("Ping接收消息:", data.onlineCount, data);
  };
  ws.onCloseConnect = (e) => {
    console.log("关闭连接");
  };
  ws.connect();

  return ws;
};
