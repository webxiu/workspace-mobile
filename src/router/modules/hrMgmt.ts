/*
 * @Author: lixiuhai
 * @Date: 2023-06-23 10:03:42
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-18 11:49:50
 */

import Layout from "@/layout/index.vue";

export default {
  path: "/oa",
  redirect: "/oa/leaveApply",
  component: Layout,
  meta: {
    title: "人事行政",
    icon: "friends-o",
    order: 1
  },
  children: [
    {
      path: "leaveApply",
      name: "LeaveApply",
      component: () => import("@/views/home/oaModule/leaveApply/index.vue"),
      meta: {
        title: "请假单",
        icon: "leasingcloud_qingjiashenhe",
        pathType: "list"
      }
    },
    {
      path: "leaveApply/add",
      props: true,
      name: "LeaveApplyAdd",
      component: () => import("@/views/home/oaModule/leaveApply/add.vue"),
      meta: {
        title: "请假申请",
        icon: "description",
        hidden: true,
        showNav: true,
        keepAlive: false,
        pathType: "detail"
      }
    },
    {
      path: "leaveApply/:id",
      name: "LeaveApplyDetail",
      props: true,
      component: () => import("@/views/home/oaModule/leaveApply/detail.vue"),
      meta: {
        title: "请假单详情",
        icon: "description",
        hidden: true,
        showNav: true,
        pathType: "detail",
        keepAlive: false
      }
    },
    {
      path: "overTime/:id",
      name: "OverTimeDetail",
      props: true,
      component: () => import("@/views/home/oaModule/overTime/detail.vue"),
      meta: {
        title: "加班单详情",
        icon: "description",
        pathType: "detail",
        hidden: true,
        showNav: true
      }
    },
    {
      path: "overTime",
      name: "OverTime",
      component: () => import("@/views/home/oaModule/overTime/index.vue"),
      meta: {
        title: "加班单",
        icon: "jiaban",
        pathType: "list"
      }
    },
    {
      path: "overTime/add",
      name: "OverTimeAdd",
      component: () => import("@/views/home/oaModule/overTime/add.vue"),
      meta: {
        title: "加班申请",
        icon: "description",
        hidden: true,
        pathType: "detail",
        showNav: true
      }
    },
    {
      path: "requireRegister",
      name: "RequireRegister",
      component: () => import("@/views/home/oaModule/requireRegister/index.vue"),
      meta: {
        title: "需求登记",
        icon: "xuqiu",
        pathType: "list",
        disable: true
      }
    },
    {
      path: "suggestionBox",
      name: "SuggestionBox",
      component: () => import("@/views/home/oaModule/suggestionBox/index.vue"),
      meta: {
        title: "建议箱",
        icon: "tousujianyi",
        pathType: "list",
        disable: true
      }
    },
    {
      path: "attendanceSheet",
      name: "AttendanceSheet",
      component: () => import("@/views/home/oaModule/attendanceSheet/index.vue"),
      meta: {
        title: "考勤单",
        pathType: "list",
        icon: "renlikaoqin"
      }
    },
    {
      path: "attendanceSheet/:id",
      name: "AttendanceSheetDetail",
      component: () => import("@/views/home/oaModule/attendanceSheet/detail.vue"),
      meta: {
        title: "考勤明细",
        icon: "description",
        pathType: "detail",
        hidden: true
      }
    },
    {
      path: "payroll",
      name: "Payroll",
      component: () => import("@/views/home/oaModule/payroll/index.vue"),
      meta: {
        title: "工资单",
        pathType: "list",
        icon: "gongzitiaoicon1x"
      }
    },
    {
      path: "payroll/:id",
      name: "payrollDetail",
      component: () => import("@/views/home/oaModule/payroll/detail.vue"),
      meta: {
        title: "工资单详情",
        icon: "balance-list-o",
        hidden: true,
        pathType: "detail",
        showNav: true
      }
    },
    {
      path: "internalPurchaseBenefits",
      name: "InternalPurchaseBenefits",
      component: () => import("@/views/home/oaModule/internalPurchaseBenefits/index.vue"),
      meta: {
        title: "内购福利",
        icon: "wodefuli",
        pathType: "list",
        showNav: true
      }
    },
    {
      path: "internalPurchaseBenefits/user",
      name: "InternalPurchaseBenefitsUser",
      component: () => import("@/views/home/oaModule/internalPurchaseBenefits/userCenter.vue"),
      meta: {
        title: "个人中心",
        icon: "goods-collect-o",
        pathType: "list",
        hidden: true
      }
    },
    {
      path: "internalPurchaseBenefits/addressList",
      name: "InternalPurchaseBenefitsAddressList",
      component: () => import("@/views/home/oaModule/internalPurchaseBenefits/addressList.vue"),
      meta: {
        title: "收货地址列表",
        icon: "goods-collect-o",
        hidden: true,
        pathType: "detail"
      }
    },
    {
      path: "internalPurchaseBenefits/addressAdd",
      name: "InternalPurchaseBenefitsAddressListAdd",
      component: () => import("@/views/home/oaModule/internalPurchaseBenefits/addressAdd.vue"),
      meta: {
        title: "新增收货地址",
        icon: "goods-collect-o",
        pathType: "detail",
        hidden: true
      }
    },
    {
      path: "internalPurchaseBenefits/orderList",
      name: "InternalPurchaseBenefitsOrderList",
      component: () => import("@/views/home/oaModule/internalPurchaseBenefits/orderList.vue"),
      meta: {
        title: "订单列表",
        icon: "goods-collect-o",
        pathType: "list",
        hidden: true
      }
    },
    {
      path: "internalPurchaseBenefits/orderDetail",
      name: "InternalPurchaseBenefitsOrderDetail",
      component: () => import("@/views/home/oaModule/internalPurchaseBenefits/orderDetail.vue"),
      meta: {
        title: "订单详情",
        icon: "goods-collect-o",
        pathType: "detail",
        hidden: true
      }
    },
    {
      path: "internalPurchaseBenefits/:id",
      name: "InternalPurchaseBenefitsDetail",
      props: true,
      component: () => import("@/views/home/oaModule/internalPurchaseBenefits/shopDetail.vue"),
      meta: {
        title: "商品详情",
        icon: "description",
        hidden: true,
        pathType: "detail",
        showNav: true
      }
    },

    {
      path: "mealCardApply",
      name: "mealCardApply",
      component: () => import("@/views/home/oaModule/mealCardApply/index.vue"),
      meta: {
        title: "餐卡申领",
        pathType: "list",
        icon: "yongcanjiucan"
      }
    },

    {
      path: "hrDoc",
      name: "HrDoc",
      component: () => import("@/views/home/oaModule/hrDoc/index.vue"),
      meta: {
        title: "人事档案",
        icon: "renshidangan",
        pathType: "list"
      }
    },
    {
      path: "hrDoc/detail",
      name: "HrDocDetail",
      component: () => import("@/views/home/oaModule/hrDoc/detail.vue"),
      meta: {
        title: "人事档案",
        icon: "description",
        hidden: true,
        pathType: "detail"
      }
    },
    {
      path: "outApply",
      name: "OutApplyList",
      component: () => import("@/views/home/oaModule/outApply/index.vue"),
      meta: {
        title: "外出申请",
        icon: "renshidangan",
        pathType: "list"
      }
    },
    {
      path: "outApply/add",
      name: "AddApplyList",
      component: () => import("@/views/home/oaModule/outApply/add.vue"),
      meta: {
        title: "新增申请",
        pathType: "detail",
        hidden: true
      }
    },
    {
      path: "outApply/detail",
      name: "OutApplyDetail",
      component: () => import("@/views/home/oaModule/outApply/detail.vue"),
      meta: {
        title: "申请详情",
        pathType: "detail",
        keepAlive: false,
        hidden: true
      }
    },
    {
      path: "carSignUp",
      name: "CarSignUpList",
      component: () => import("@/views/home/oaModule/carSignUp/index.vue"),
      meta: {
        title: "用车登记",
        icon: "renshidangan",
        pathType: "list"
      }
    },
    {
      path: "carSignUp/submit",
      name: "OutApplySubmit",
      component: () => import("@/views/home/oaModule/carSignUp/submit.vue"),
      meta: {
        title: "提交登记",
        pathType: "detail",
        keepAlive: false,
        hidden: true
      }
    },
    {
      path: "hydroelectricity",
      name: "Hydroelectricity",
      component: () => import("@/views/home/oaModule/hydroelectricity/index.vue"),
      meta: {
        title: "抄水电表",
        icon: "zhinengshuidianbiao",
        pathType: "list",
        keepAlive: false
      }
    },
    {
      path: "hydroelectricity/add",
      name: "HydroelectricityAdd",
      component: () => import("@/views/home/oaModule/hydroelectricity/add.vue"),
      meta: {
        title: "新增水电记录",
        pathType: "detail",
        hidden: true
      }
    },
    {
      path: "clockRecord",
      name: "ClockRecord",
      component: () => import("@/views/home/oaModule/clockRecord/index.vue"),
      meta: {
        title: "打卡记录",
        icon: "renlianshibie",
        pathType: "list"
      }
    },
    {
      path: "faceCollect",
      name: "FaceCollect",
      component: () => import("@/views/home/oaModule/faceCollect/index.vue"),
      meta: {
        title: "面部采集",
        icon: "renlianshibie1",
        pathType: "list"
      }
    },
    {
      path: "resignApply",
      name: "ResignApply",
      component: () => import("@/views/home/oaModule/resignApply/index.vue"),
      meta: {
        title: "离职申请",
        icon: "hangzou",
        pathType: "list"
      }
    }
  ]
} as RouteConfigRawType;
