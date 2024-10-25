/**
 * 全屏滚动组件工具方法
 */

export type Direction = "up" | "right" | "down" | "left" | "";
/**
 * 判断是否在移动端应用或者企业微信中打开
 */
export const getPlatform = () => {
  const isMobile = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  );
  const isWx = /micromessenger/i.test(navigator.userAgent);
  const isQywx = /wxwork/i.test(navigator.userAgent);
  return {
    /** 是否微信 */
    isWx: isWx,
    /** 是否企业微信 */
    isQywx: isQywx,
    /** 是否移动端 */
    isMobile: isMobile,
    /** 是否PC端 */
    isPC: !isMobile
  };
};

/** 判断滑动方向 */
export function getAngle(angx, angy) {
  return (Math.atan2(angy, angx) * 180) / Math.PI;
}

/** 获取滑动方向 */
export function getDirection() {
  let result: Direction = "";
  // 开始滑动重置
  function start() {
    result = "";
  }
  // 移动后根据滑动方向返回
  function move(startx, starty, endx, endy, threshold = 10): Direction {
    const angx = endx - startx;
    const angy = endy - starty;
    if (result) return result;
    //如果滑动距离太短
    if (Math.abs(angx) < threshold && Math.abs(angy) < threshold) {
      return result;
    }
    const angle = getAngle(angx, angy);
    if (angle >= -135 && angle <= -45) {
      result = "up";
    } else if (angle > 45 && angle < 135) {
      result = "down";
    } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
      result = "left";
    } else if (angle >= -45 && angle <= 45) {
      result = "right";
    }
    return result;
  }
  return { move, start };
}

/**
 * 函数防抖
 * @param fn 处理函数
 * @param wait 等待时间
 */
export const debounce = (fn: Function, wait = 300) => {
  let timeout: NodeJS.Timeout;
  return (...args: any) => {
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.call(null, ...args);
    }, wait);
  };
};

/**
 * 函数节流
 * @param fn 处理函数
 * @param delay 间隔时间
 */
export const throttle = (fn: Function, delay = 300) => {
  let prev = Date.now();
  return (...args: any) => {
    const now = Date.now();
    if (now - prev >= delay) {
      fn.call(null, ...args);
      prev = Date.now();
    }
  };
};

export const addEvent = (el: Element, name, cb) => {
  const { isMobile } = getPlatform();
  const eventObj = {
    mousedown: "touchstart",
    mousemove: "touchmove",
    mouseup: "touchend"
  };
  const eventName = isMobile ? eventObj[name] : name;
  const fn = (ev: TouchEvent) => {
    ev.stopPropagation();
    ev.preventDefault();
    const evt = isMobile ? ev.changedTouches[0] : ev;
    cb(evt);
  };
  el.addEventListener(eventName, fn);
  return () => el.removeEventListener(eventName, fn);
};
