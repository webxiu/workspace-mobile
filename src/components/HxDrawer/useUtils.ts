import { Direction, getDirection } from "@/views/report/lib/utils";

export function useUtils(el: HTMLElement, callback: (opt) => void) {
  let startX = 0;
  let startY = 0;
  let startTime = 0;
  let isMoving = false;
  let transition = "";
  let threshold = 10;
  let direction: Direction = "";

  const { start, move } = getDirection();

  el.addEventListener("touchstart", (ev) => {
    transition = el.style.transition;
    startX = ev.touches[0].clientX;
    startY = ev.touches[0].clientY;
    startTime = Date.now();
    isMoving = true;
    el.style.transition = "none";
    start();
  });

  el.addEventListener("touchmove", (ev) => {
    if (!isMoving) return;
    const touch = ev.touches[0];
    const deltaX = touch.clientX - startX;
    direction = move(startX, startY, touch.clientX, touch.clientY, threshold);
    if (direction === "right") {
      ev.preventDefault();
      el.style.left = `${Math.min(deltaX, window.innerWidth)}px`;
    }
  });

  el.addEventListener("touchend", (ev) => {
    isMoving = false;
    const endX = ev.changedTouches[0].clientX;
    const deltaX = endX - startX;
    const endTime = Date.now();
    const duration = endTime - startTime;
    el.style.transition = `all ${transition}`;
    callback({ el, deltaX, duration, direction });
  });
}
