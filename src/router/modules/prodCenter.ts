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
    title: "生产制造中心",
    icon: "friends-o",
    order: 2
  },
  children: [
    {
      path: "supplierComplaints",
      name: "SupplierComplaints",
      component: () => import("@/views/home/oaModule/supplierComplaints/index.vue"),
      meta: {
        title: "供应商投诉",
        icon: "4",
        showNav: true,
        pathType: "list"
      }
    },
    {
      path: "supplierComplaints/:id",
      name: "SupplierComplaintsDetail",
      component: () => import("@/views/home/oaModule/supplierComplaints/detail.vue"),
      meta: {
        title: "投诉详情",
        icon: "description",
        hidden: true,
        showNav: true,
        pathType: "detail"
      }
    },
    {
      path: "prodScheduling",
      name: "ProdScheduling",
      component: () => import("@/views/home/oaModule/prodScheduling/index.vue"),
      meta: {
        title: "生产排产",
        icon: "shengchanjihua",
        showNav: true,
        pathType: "list"
      }
    }
  ]
} as RouteConfigRawType;
