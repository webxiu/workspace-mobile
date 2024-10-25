/*
 * @Author: lixiuhai
 * @Date: 2023-06-23 10:03:03
 * @Last Modified by:   lixiuhai
 * @Last Modified time: 2023-06-23 10:03:03
 */

import "nprogress/nprogress.css";

import NProgress from "nprogress";

/**
 * 网络加载进度条
 */
NProgress.configure({
  // 动画方式
  easing: "ease",
  // 递增进度条的速度
  speed: 500,
  // 关闭显示加载ico
  showSpinner: false,
  // 自动递增间隔
  trickleSpeed: 200,
  // 初始化时的最小百分比
  minimum: 0.3,
  // 设置为false，关闭自动递增行为
  trickle: true,
});

export default NProgress;
