import { getUrlParameters } from "@/utils/common";

// 列表页面
const listLinks = [
  // 请假单
  "/oa/leaveApply",
  // 工资单
  "/oa/payroll",
  // 考勤单
  "/oa/attendanceSheet",
  // 金蝶业务审批详情
  "/infoCenter/kingdeeAudit",
  // 业务审批
  "/infoCenter/auditTask",
];

// 处理从企业微信消息进入后, 跳转列表路由
export const getRouteLink = () => {
  let routeLink = "";
  const routeUrl = location.pathname;
  const { isFromQywx } = getUrlParameters(location.href);
  if (isFromQywx) {
    for (let i = 0; i < listLinks.length; i++) {
      const key = listLinks[i];
      // 添加/线匹配详情路由
      if (routeUrl.indexOf(`${key}/`) > -1) {
        routeLink = key;
        break;
      }
    }
  }
  if (routeLink) {
    location.href = routeLink;
  }
  return routeLink;
};
