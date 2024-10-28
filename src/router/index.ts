/*
 * @Author: lixiuhai
 * @Date: 2023-06-23 10:03:33
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2024-05-16 13:52:06
 */

import { RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from "vue-router";

// 公共全局路由
const commonRoute: RouteConfigRawType[] = [
  { path: "/", name: "Home", redirect: "/workspace" },
  {
    path: "/workspace",
    name: "Workspace",
    component: () => import("@/views/home/index.vue"),
    meta: { title: "德龙工作台" }
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: { title: "用户登录" }
  },
  {
    path: "/signBack",
    name: "signBack",
    component: () => import("@/views/signBack/index.vue"),
    meta: { title: "供应商回签" }
  },
  {
    path: "/addSupplierComplaints",
    name: "AddSupplierComplaints",
    component: () => import("@/views/supAddSugges/index.vue"),
    meta: { title: "投诉建议" }
  },
  {
    path: "/purchaseList",
    name: "purchaseList",
    component: () => import("@/views/purchaseList/index.vue"),
    meta: { title: "采购订单列表" }
  },
  {
    path: "/employmentNotice",
    name: "EmploymentNotice",
    component: () => import("@/views/employmentNotice/index.vue"),
    meta: { title: "入职通知", pathType: "list" }
  },
  {
    path: "/report",
    name: "Report",
    component: () => import("@/views/report/index.vue"),
    meta: { title: "年度统计报告", pathType: "list" }
  },
  {
    path: "/videoPlay",
    name: "VideoPlay",
    component: () => import("@/views/videoPlay/index.vue"),
    meta: { title: "视频播放", pathType: "list" }
  },
  {
    path: "/401",
    name: "Error401",
    component: () => import("@/views/notFound/401.vue"),
    meta: { title: "无访问权限" }
  },
  {
    path: "/:pathMatch(.*)",
    name: "Error404",
    component: () => import("@/views/notFound/404.vue"),
    meta: { title: "页面找不到" }
  }
];
// 动态加载
const modules: Record<string, any> = import.meta.glob(["./modules/**/*.ts", "!./modules/**/test.ts"], { eager: true });

// 路由模块列表
const routeList: RouteConfigRawType[] = [];
Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeList.push(...modList);
});

// 动态路由
export const asyncRoutes = [];
export const routeCateList = [...routeList].sort((a: any, b: any) => a.meta?.order - b.meta?.order);

export const routes = [...commonRoute, ...routeList, ...asyncRoutes] as RouteRecordRaw[];

const router = createRouter({
  history: createWebHistory("./"),
  routes: routes,
  scrollBehavior: () => ({ left: 0, top: 0 })
});

// 重置路由
export function resetRouter() {
  const WHITE_NAME_LIST = ["Login"];
  router.getRoutes().forEach((route) => {
    const { name } = route;
    if (name && !WHITE_NAME_LIST.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}

export default router;
