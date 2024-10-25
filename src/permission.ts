/*
 * @Author: lixiuhai
 * @Date: 2023-06-23 10:00:22
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-07-10 16:59:51
 */

import { getCookie, getLoginInfo, getSignBack, removeCookie, setSignBack, setWeChatCode } from "@/utils/storage";
import { getPageTitle, getPlatform, getUrlParameters } from "@/utils/common";

import NProgress from "@/utils/progress";
import UserAuth from "@/components/ReDialog/UserAuth.vue";
import { addDialog } from "@/components/ReDialog";
import { h } from "vue";
import router from "@/router";
import { showToast } from "vant";

const { isMobile, isQywx, isPC } = getPlatform();
const org_domain = import.meta.env.VITE_ORGANIZATION_URL;
const hostObj = {
  localhost: org_domain,
  "127.0.0.1": org_domain,
  "192.168.2.202": org_domain,
  "192.168.2.8": org_domain,
  "192.168.2.23": org_domain
};

// PC端企业微信: 需要验证登录密码的路由名称
const routerAuthList = [
  "供应商回签",
  // PC端拦截
  "工资单",
  "工资单详情"
];
// 白名单路由地址
const whiteList = [
  "/login",
  "/register",
  "/404",
  "/401",
  "/403",
  "/signBack",
  "/purchaseList",
  "/addSupplierComplaints",
  "/employmentNotice",
  "/report",
  "/videoPlay"
];
export const orgDomain = hostObj[location.hostname] || location.hostname;
const params = new URLSearchParams(location.search);
let isReload = true; // 避免企业微信消息跳转路由重复加载

document.addEventListener("visibilitychange", () => {
  const visible = document.visibilityState;
  if (visible === "hidden") isReload = true;
});

// 路由拦截
router.beforeEach((to, from, next) => {
  NProgress.start();
  const title = to.meta?.title as string;
  const hasCookie = getCookie();
  const state = params.get("state");
  const code = params.get("code");
  document.title = getPageTitle(title);

  /** 路由拦截, 弹窗登录 */
  function checkLoginAccess() {
    const data = getSignBack();
    const isSingBack = title === "供应商回签";
    if (title === "供应商回签") {
      if (data.userNo && data.password) return next();
    } else {
      // 只有在企业微信PC端才显示下面登录校验, 不是则放行
      if (!(isPC && isQywx)) return next();
    }

    const resultDialog = addDialog({
      title: isSingBack ? "绑定身份" : "用户验证",
      show: true,
      lockScroll: true,
      showCancelButton: true,
      showConfirmButton: false,
      cancel: () => next("/workspace"),
      contentRender: () =>
        h(UserAuth, {
          onSubmit: (data) => {
            if (!data) return next(false);
            if (to.path.includes("/signBack")) setSignBack(data);
            resultDialog.options.value.show = false;
            next(true);
          }
        })
    });
  }

  /** 权限检测 */
  function checkPermission() {
    if (!isMobile && !isQywx) {
      showToast({ message: "请在手机端打开！", icon: "warning", duration: 0, overlay: true });
    }
    const { authList } = getLoginInfo();
    if (authList?.length) {
      const urls = authList.reduce((acc: string[], item) => {
        if (item.appHomeUrl) acc.push(item.appHomeUrl);
        if (item.appDetailUrl) acc.push(item.appDetailUrl);
        return acc;
      }, []);
      const uniqueUrls = [...new Set([...urls, ...whiteList])];
      const hasAuth = uniqueUrls.some((url) => to.fullPath.includes(url));
      if (!hasAuth && !to.fullPath.includes("/workspace")) {
        next({ path: "/403" });
      }
    }
  }

  /** 检测企业微信登录跳转 */
  function checkWechatLogin() {
    // 微信消息列表中跳转过来的路由地址携带在state中
    if (isReload && code && state && state.indexOf("/") === 0) {
      isReload = false;
      // 存储每次企业微信携带过来的code和state, 当Token失效自动转登录页面, 可发起企业微信code登录
      setWeChatCode({ code, state: state });
      const JumpPath = state.split("?")[0];
      const qywxQuery = getUrlParameters(state!);
      next({ path: JumpPath, query: { ...qywxQuery, isFromQywx: true } });
    } else {
      next();
    }
  }

  checkPermission();

  if (hasCookie) {
    if (to.path === "/login") {
      next({ path: "/" });
      NProgress.done();
    } else {
      /** 处理需要验证密码的路由 */
      if (routerAuthList.includes(title)) {
        return checkLoginAccess();
      }
      checkWechatLogin();
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      removeCookie();
      next("/login");
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
