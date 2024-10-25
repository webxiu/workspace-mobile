/*
 * @Author: lixiuhai
 * @Date: 2023-06-23 10:03:42
 * @Last Modified by:   lixiuhai
 * @Last Modified time: 2023-06-23 10:03:42
 */

import Layout from "@/layout/index.vue";

export default {
  path: "/oa",
  redirect: "/oa/leaveApply",
  component: Layout,
  meta: {
    title: "市场营销中心",
    icon: "friends-o",
    order: 3
  },
  children: [
    {
      path: "customerComplaints",
      name: "CustomerComplaints",
      component: () => import("@/views/home/oaModule/customerComplaints/index.vue"),
      meta: {
        title: "客户投诉",
        icon: "xinfangtousu",
        pathType: "list"
      }
    },
    {
      path: "customerComplaints/:id",
      name: "CustomerComplaintsDetail",
      component: () => import("@/views/home/oaModule/customerComplaints/detail.vue"),
      meta: {
        title: "投诉详情",
        icon: "description",
        hidden: true,
        pathType: "detail",
        showNav: true
      }
    },
    {
      path: "businessData",
      name: "BusinessData",
      component: () => import("@/views/home/oaModule/businessData/index.vue"),
      meta: {
        title: "经营数据",
        icon: "shuju",
        pathType: "list"
      }
    }
  ]
} as RouteConfigRawType;
