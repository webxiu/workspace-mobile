/*
 * @Author: lixiuhai
 * @Date: 2023-06-23 10:03:42
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2024-05-13 18:15:13
 */

import Layout from "@/layout/index.vue";

export default {
  path: "/scan",
  redirect: "/scan/compare",
  component: Layout,
  meta: {
    title: "扫码管理",
    icon: "friends-o",
    order: 3
  },
  children: [
    {
      path: "compare",
      name: "ScanCompare",
      component: () => import("@/views/home/scanManage/codeCompare/index.vue"),
      meta: {
        title: "二维码验证",
        icon: "fenxiangerweima",
        showNav: true,
        pathType: "list"
      }
    }
  ]
} as RouteConfigRawType;
