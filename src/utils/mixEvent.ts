export default {
  // 长按事件
  longPress: (el: HTMLElement, callback: (ev: TouchEvent) => void, time = 1000) => {
    let startTime = 0;
    el?.addEventListener("touchstart", (ev: TouchEvent) => {
      ev.preventDefault();
      startTime = Date.now();
      el?.addEventListener("touchend", onTouchEnd);
    });

    function onTouchEnd(ev: TouchEvent) {
      ev.preventDefault();
      const endTime = Date.now();
      if (endTime - startTime > time) callback(ev);
      el?.removeEventListener("touchend", onTouchEnd);
    }
  }
};
