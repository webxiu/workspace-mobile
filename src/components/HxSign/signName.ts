// 配置选项类型
interface OptionsType {
  width: number;
  height: number;
  lineWidth: number;
  eraseWidth: number;
  lineStyle: string;
  fillStyle: string;
  lineCap: CanvasLineCap;
}

// 路径类型
interface PathType {
  lineWidth: number;
  lineStyle: string;
  move: number[];
  isErase: boolean;
  eraseWidth: number;
  isRestoreErase?: boolean;
  line: { x: number; y: number }[];
}

// 默认配置
const defaultOption: OptionsType = {
  width: 0,
  height: 200,
  lineWidth: 3,
  eraseWidth: 10,
  lineStyle: "#000000",
  fillStyle: "#ffffff",
  lineCap: "round"
};

class SignName {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  signaturePaths: CanvasRenderingContext2D[] = [];
  lastX: number = 0;
  lastY: number = 0;
  isDrawing: boolean = false;
  historyList: PathType[] = [];
  recoverList: PathType[] = [];
  defaultOption: OptionsType = { ...defaultOption };
  options: OptionsType = { ...defaultOption };
  ratio = 1;
  eraseMode: boolean = false;

  constructor(selector, options: Partial<OptionsType>) {
    this.updateOption(options);
    const wrapDom: HTMLDivElement = document.querySelector(selector);
    // const { width, height } = wrapDom.getBoundingClientRect();
    const { width, height } = this.getContentDimensions(wrapDom);
    this.canvas = document.createElement("canvas");
    wrapDom.appendChild(this.canvas);
    this.ratio = window.devicePixelRatio;

    this.ctx = this.canvas.getContext("2d")!;
    this.canvas.width = width * this.ratio;
    this.canvas.height = this.options.height * this.ratio;
    this.canvas.style.width = width + "px";
    this.canvas.style.height = this.options.height + "px";
    this.ctx.fillStyle = this.options.fillStyle;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.createEvent(this.canvas);
  }

  getContentDimensions = (element: HTMLElement) => {
    const style = window.getComputedStyle(element);
    const paddingTop = parseInt(style.paddingTop, 10);
    const paddingRight = parseInt(style.paddingRight, 10);
    const paddingBottom = parseInt(style.paddingBottom, 10);
    const paddingLeft = parseInt(style.paddingLeft, 10);
    const borderTop = parseInt(style.borderTopWidth, 10);
    const borderRight = parseInt(style.borderRightWidth, 10);
    const borderBottom = parseInt(style.borderBottomWidth, 10);
    const borderLeft = parseInt(style.borderLeftWidth, 10);

    const contentWidth = element.offsetWidth - (paddingLeft + paddingRight + borderLeft + borderRight);
    const contentHeight = element.offsetHeight - (paddingTop + paddingBottom + borderTop + borderBottom);
    return {
      width: contentWidth,
      height: contentHeight
    };
  };

  // 移动端和PC端事件
  private addEvent = (el: Element, eventName, cb: Function) => {
    const fn = (ev: TouchEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      cb(ev.changedTouches[0]);
    };
    el.addEventListener(eventName, fn);
    return () => el.removeEventListener(eventName, fn);
  };

  createEvent = (dom: HTMLCanvasElement) => {
    this.addEvent(dom, "touchstart", (ev: MouseEvent) => this.onTouchstart(ev));
    this.addEvent(dom, "touchmove", (ev: MouseEvent) => this.onTouchmove(ev));
    this.addEvent(dom, "touchend", (ev: MouseEvent) => this.onTouchend(ev));
  };

  private onTouchstart = (ev: MouseEvent) => {
    this.isDrawing = true;
    const rect = this.canvas.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    this.drawLine(x, y, false);
    this.recoverList = [];
    this.historyList.push({
      lineWidth: this.options.lineWidth,
      lineStyle: this.options.lineStyle,
      move: [x, y],
      line: [],
      isErase: this.eraseMode,
      eraseWidth: this.options.lineWidth
    });
  };

  private onTouchmove = (ev: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    const mx = ev.clientX - rect.left;
    const my = ev.clientY - rect.top;
    if (this.isDrawing) {
      this.drawLine(mx, my, true);
      this.historyList[this.historyList.length - 1].line.push({
        x: mx,
        y: my
      });
    }
  };

  private onTouchend = (ev: MouseEvent) => {
    this.isDrawing = false;
  };

  drawLine = (x: number, y: number, isMove: boolean) => {
    if (isMove) {
      this.ctx.beginPath();
      this.ctx.lineWidth = this.options.lineWidth * this.ratio;
      this.ctx.strokeStyle = this.options.lineStyle;
      this.ctx.lineCap = this.options.lineCap;
      this.ctx.lineJoin = "round";
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      this.ctx.closePath();
    }
    this.lastX = x;
    this.lastY = y;
  };

  // 设置canvas宽高
  setCanvasSize = ({ width, height }) => {
    if (width === this.canvas.width && height === this.canvas.height) return;
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = this.canvas.width;
    tempCanvas.height = this.canvas.height;
    const tempCtx = tempCanvas.getContext("2d") as CanvasRenderingContext2D;
    tempCtx.drawImage(this.canvas, 0, 0);

    const newWidth = width * this.ratio;
    const newHeight = height * this.ratio;

    this.options.width = newWidth;
    this.options.height = newHeight;
    this.canvas.width = width * this.ratio;
    this.canvas.height = height * this.ratio;
    this.canvas.style.width = width + "px";
    this.canvas.style.height = height + "px";
    this.ctx?.drawImage(tempCanvas, 0, 0);
  };

  updateOption = (options: Partial<OptionsType>) => {
    const fillStyle = this.options.fillStyle;
    this.options = { ...this.options, ...options };
    this.defaultOption = { ...this.defaultOption, ...options };
    if (this.eraseMode) this.options.lineWidth = this.options.eraseWidth;
    this.setCanvasSize(this.options);
    if (fillStyle !== options.fillStyle) this.onRestore(); // 更新背景色
  };

  // 画布重置
  onRestore = (type?: "revoke" | "recover") => {
    if (!this.ctx) return;
    const { width, height } = this.canvas;
    const { fillStyle } = this.options;
    if (type === "revoke") {
      const history = this.historyList.pop();
      if (history) {
        // 如果是擦除操作，存储的是“透明区域”，撤销时需要重新绘制被擦除的内容
        if (history.isErase) {
          // 方案1：重新绘制整个画布（简单但性能较差）
          this.recoverList.push({ ...history, isRestoreErase: true });
        } else {
          this.recoverList.push(history);
        }
      }
    } else if (type === "recover") {
      const recover = this.recoverList.pop();
      if (recover) {
        if (recover.isRestoreErase) {
          // 重新应用擦除操作
          this.historyList.push({ ...recover, isErase: true });
        } else {
          this.historyList.push(recover);
        }
      }
    }
    // 重绘画布
    this.ctx.clearRect(0, 0, width * this.ratio, height * this.ratio);
    this.ctx.fillStyle = fillStyle; // 更新背景颜色
    this.ctx.fillRect(0, 0, width * this.ratio, height * this.ratio);
    // 记录当前线宽和擦除类型
    const tempLineWidth = this.options.lineWidth;
    const tempEraseType = this.ctx.globalCompositeOperation;

    this.historyList.forEach((m) => {
      this.ctx.beginPath();
      if (m.isErase) {
        this.ctx.lineWidth = m.eraseWidth * this.ratio;
        this.ctx.globalCompositeOperation = "destination-out";
        // 任意颜色，因为 destination-out 会忽略它
        this.ctx.strokeStyle = "rgba(0, 0, 0, 1)";
      } else {
        this.ctx.lineWidth = m.lineWidth * this.ratio;
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.strokeStyle = m.lineStyle;
      }
      this.ctx.moveTo(m.move[0] * this.ratio, m.move[1] * this.ratio);
      m.line.forEach((v) => this.ctx.lineTo(v.x * this.ratio, v.y * this.ratio));
      this.ctx.stroke();
      // 恢复当前线宽和擦除类型
      this.options.lineWidth = tempLineWidth;
      this.ctx.globalCompositeOperation = tempEraseType;
    });
  };

  onClear = () => {
    const { width, height } = this.canvas;
    this.ctx.beginPath();
    this.ctx.clearRect(0, 0, width * this.ratio, height * this.ratio);
    this.ctx.closePath();
    this.historyList = [];
    this.recoverList = [];
    this.options = { ...defaultOption };
  };

  // 切换擦除模式, 并可以设置擦除大小
  onEraser = (size) => {
    const { eraseWidth, lineWidth } = this.defaultOption;
    this.eraseMode = !this.eraseMode;
    this.ctx.globalCompositeOperation = this.eraseMode ? "destination-out" : "source-over";
    this.options.lineWidth = this.eraseMode ? size || eraseWidth : lineWidth;
    return this.eraseMode;
  };

  onExport = (mime = "image/png") => {
    const imgData = this.canvas.toDataURL(mime);
    return imgData;
  };

  onDownload = (filename = "sign.png", mime = "image/png") => {
    const imgData = this.canvas.toDataURL(mime);
    const a = document.createElement("a");
    a.href = imgData;
    a.download = filename;
    a.click();
  };

  signStatus = () => {
    return this.historyList.length > 0;
  };
}

export { SignName, type OptionsType };
