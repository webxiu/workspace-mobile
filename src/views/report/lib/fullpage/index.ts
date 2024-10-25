import { Direction, addEvent, getDirection, throttle } from "../utils";

export interface FullPageOption {
  /** 动画时长(秒) */
  delay?: number;
  /** 开启循环 */
  loop?: boolean;
  /** 自动播放 */
  autoScroll?: boolean;
  /** 背景色 */
  bgColor?: string[];
  /** 按压超时时长 */
  pressTime?: number;
  /** 首屏动画 */
  animation_first?: string;
  /** 上滑动画(entry: 进入动画 leave: 离开动画) */
  animation_up?: { entry: string; leave: string };
  /** 下滑动画(entry: 进入动画 leave: 离开动画) */
  animation_down?: { entry: string; leave: string };
  /** 创建执行 */
  create?: (param: AfterParamType) => void;
  /** 进入前执行 */
  before?: (param: AfterParamType) => void;
  /** 进入后执行 */
  after?: (param: AfterParamType) => void;
}
export interface AfterParamType {
  /** 离开页面索引 */
  index: number;
  /** 进入页面索引 */
  newIndex: number;
  /** 页码数量 */
  pageNum: number;
}

const defaultOption: Required<FullPageOption> = {
  delay: 1,
  loop: false,
  bgColor: [],
  pressTime: 800,
  autoScroll: false,
  animation_first: "animate__heartBeat",
  animation_up: { entry: "animate__fadeInUp", leave: "animate__fadeOutUp" },
  animation_down: {
    entry: "animate__fadeInDown",
    leave: "animate__fadeOutDown"
  },
  create: (param) => {},
  before: (param) => {},
  after: (param) => {}
};

class FullPage {
  // 容器选择器
  private el: string;
  // 元素集合
  private listDom: HTMLElement[];
  // 点击坐标
  private positions = { startx: 0, starty: 0, endx: 0, endy: 0 };
  // 页码数量
  private pageNum = 0;
  // 按下时刻
  private startTime = 0;
  // 当前索引
  private curIndex = 0;
  // 自动播放
  private timer?: NodeJS.Timeout;
  // 动画是否正在执行
  private isMoveing = false;
  // 配置选项
  option: Required<FullPageOption> = defaultOption;
  // 元素已有的类名
  originClass: Record<number, string[]> = {};
  /** 滑动方向 */
  direction: Direction = "";
  /** 获取滑动方向 */
  moveObj = getDirection();

  constructor(el: string, option: FullPageOption = {}) {
    const wrapDom = document.querySelector(el) as HTMLElement;
    this.listDom = Array.from(wrapDom.children) as HTMLElement[];
    this.pageNum = this.listDom.length;
    this.el = el;
    wrapDom.style.width = "100vh";
    wrapDom.style.height = "100vh";
    wrapDom.style.overflow = "hidden";
    Object.keys(option).forEach((key) => {
      if (option[key]) this.option[key] = option[key];
    });
    this.init();
  }

  private init() {
    this.setStyle();
    this.onAutoScroll();
    this.listDom.forEach((oDom, index) => {
      oDom.style.cssText = `
        position: absolute;
        height: 100vh;
        width: 100%;
        overflow: hidden;
        display: ${index === 0 ? "block" : "none"};
        background-color:${this.option.bgColor[index] || "inherit"};
      `;
      this.originClass[index] = Array.from(oDom.classList);
      if (index === 0) {
        oDom.classList.add("animate__animated", this.option.animation_first);
        this.option.create({ index: 0, newIndex: 0, pageNum: this.pageNum });
      }
      addEvent(oDom, "mousedown", (ev: MouseEvent) => {
        this.onTouchstart(index, ev);
      });
      addEvent(oDom, "mousemove", (ev: MouseEvent) => {
        this.onTouchmove(index, ev);
      });
      addEvent(oDom, "mouseup", (ev: MouseEvent) => {
        this.onTouchend(index, ev);
      });
      oDom.addEventListener("wheel", (ev: MouseEvent) => {
        this.onWheel(index, ev);
      }); // 鼠标滚轮
    });
  }

  // 覆盖animate.css样式
  private setStyle() {
    const style = document.createElement("style");
    style.innerHTML = `${this.el} .animate__animated {
      animation-duration: ${this.option.delay}s;
    }`;
    document.body.appendChild(style);
  }

  // 自动滚动
  private onAutoScroll() {
    if (this.option.autoScroll) {
      if (this.timer) clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.onChangePage(this.curIndex, "up");
      }, this.option.delay * 1000 + 2000); // 加2秒延迟
    }
  }

  // 开始事件
  private onTouchstart = (index, ev: MouseEvent) => {
    this.startTime = Date.now();
    this.positions.startx = ev.clientX;
    this.positions.starty = ev.clientY;
    this.option.before({ index, newIndex: 0, pageNum: this.pageNum });
    this.moveObj.start();
  };

  // 移动事件
  private onTouchmove = (index, ev: MouseEvent) => {
    this.isMoveing = true;
    const { startx, starty } = this.positions;
    this.direction = this.moveObj.move(startx, starty, ev.clientX, ev.clientY);
  };

  // 结束事件
  private onTouchend = throttle((index, ev: MouseEvent) => {
    this.positions.endx = ev.clientX;
    this.positions.endy = ev.clientY;
    const endTime = Date.now();
    if (endTime - this.startTime > this.option.pressTime) return; // 长按不抬起
    if (!this.isMoveing) return;
    this.isMoveing = false;
    this.onChangePage(index, this.direction);
  }, this.option.delay * 1000);

  // 滚轮切换
  private onWheel = throttle((index, ev) => {
    ev.preventDefault();
    this.direction = ev.wheelDelta > 0 ? "down" : "up";
    this.onChangePage(index, this.direction);
  }, this.option.delay * 1000);

  // 切换页码
  private onChangePage = (index, direction: Direction) => {
    let newIndex = direction === "down" ? index - 1 : index + 1;
    if (!["up", "down"].includes(direction)) return;

    if (this.option.loop) {
      const lastPos = this.pageNum - 1;
      if (direction === "up" && index >= lastPos) newIndex = 0;
      if (direction === "down" && index <= 0) newIndex = lastPos;
    } else if (!this.listDom[newIndex]) {
      // 未开启循环时的阻止条件
      return;
    }
    // 页面切换完成回调
    this.option.after({ index, newIndex, pageNum: this.pageNum });
    this.curIndex = newIndex;
    // 元素离开
    const leaveClasses = [...this.originClass[index], "animate__animated", this.option[`animation_${direction}`].leave];
    this.listDom[index].setAttribute("class", leaveClasses.join(" "));
    this.listDom[index].style.zIndex = "0";

    // 元素进入
    const entryClasses = [...this.originClass[newIndex], "animate__animated", this.option[`animation_${direction}`].entry];
    this.listDom[newIndex].style.display = "block";
    this.listDom[newIndex].style.zIndex = "1";
    this.listDom[newIndex].setAttribute("class", entryClasses.join(" "));
  };

  // 切换页面(外部实例调用)
  onSwitchPage = throttle((index, direction) => {
    this.onChangePage(index, direction);
  }, this.option.delay * 1000);

  // 更新配置(外部实例调用)
  onUpdateOption = (option: FullPageOption) => {
    Object.keys(option).forEach((key) => {
      if (option[key] !== undefined) this.option[key] = option[key];
    });
    this.onAutoScroll();
  };
}

export default FullPage;
