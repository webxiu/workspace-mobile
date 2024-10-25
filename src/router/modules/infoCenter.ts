/*
 * @Author: lixiuhai
 * @Date: 2023-06-23 10:03:39
 * @Last Modified by:   lixiuhai
 * @Last Modified time: 2023-06-23 10:03:39
 */

import Layout from "@/layout/index.vue";

export default {
  path: "/infoCenter",
  redirect: "/infoCenter/createTask",
  component: Layout,
  meta: {
    title: "信息中心",
    icon: "friends-o",
    order: 4
  },
  children: [
    {
      path: "personalSignage",
      name: "PersonalSignage",
      component: () => import("@/views/home/oaModule/personalSignage/index.vue"),
      meta: {
        title: "个人看板",
        pathType: "list",
        icon: "fenxikanban"
      }
    },
    {
      path: "createTask",
      name: "CreateTask",
      component: () => import("@/views/home/infoCenter/createTask/index.vue"),
      meta: {
        title: "我创建的任务",
        icon: "duixiangchuangjian",
        pathType: "list"
      }
    },
    {
      path: "myTask",
      name: "MyTask",
      component: () => import("@/views/home/infoCenter/myTask/index.vue"),
      meta: {
        title: "我负责的任务",
        icon: "shebeiweixiuweihu",
        pathType: "list"
      }
    },
    {
      path: "kingdeeAudit",
      name: "KingdeeAudit",
      component: () => import("@/views/home/infoCenter/kingdeeAudit/index.vue"),
      meta: { title: "金蝶业务审批", icon: "shenpi", pathType: "list" }
    },
    {
      path: "kingdeeAudit/auditDetail",
      name: "KingdeeAuditDetail",
      props: true,
      component: () => import("@/views/home/infoCenter/kingdeeAudit/detail.vue"),
      meta: {
        title: "我的待办详情",
        hidden: true,
        showNav: true,
        pathType: "detail"
      }
    },
    {
      path: "kingdeeAudit/auditedDetail",
      name: "KingdeeAuditedDetail",
      props: true,
      component: () => import("@/views/home/infoCenter/kingdeeAudit/detail.vue"),
      meta: {
        title: "我的已办详情",
        hidden: true,
        showNav: true,
        pathType: "detail"
      }
    },
    {
      path: "kingdeeAudit/initiateDetail",
      name: "KingdeeAuditInitiateDetail",
      props: true,
      component: () => import("@/views/home/infoCenter/kingdeeAudit/detail.vue"),
      meta: {
        title: "我的发起详情",
        hidden: true,
        showNav: true,
        pathType: "detail"
      }
    },
    {
      path: "auditTask",
      name: "AuditTask",
      component: () => import("@/views/home/infoCenter/auditTask/index.vue"),
      meta: {
        title: "业务审核",
        icon: "icon_app_examine_",
        pathType: "list"
      }
    },
    {
      path: "auditTask/detail",
      name: "auditTaskDetail",
      component: () => import("@/views/home/infoCenter/auditTask/detail.vue"),
      meta: {
        title: "业务审批详情",
        icon: "balance-list-o",
        hidden: true,
        pathType: "detail",
        keepAlive: false,
        showNav: true
      }
    },
    {
      path: "auditTask/addAudit",
      name: "auditTaskAddAudit",
      component: () => import("@/views/home/infoCenter/auditTask/addAudit.vue"),
      meta: {
        title: "加签",
        hidden: true,
        pathType: "detail",
        keepAlive: false,
        showNav: true
      }
    },
    {
      path: "auditTask/changeAudit",
      name: "auditTaskChangeAudit",
      component: () => import("@/views/home/infoCenter/auditTask/changeAudit.vue"),
      meta: {
        title: "转审",
        hidden: true,
        pathType: "detail",
        keepAlive: false,
        showNav: true
      }
    }
  ]
} as RouteConfigRawType;
