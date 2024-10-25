/*
 * @Author: lixiuhai
 * @Date: 2023-06-23 10:05:54
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-09-02 14:19:02
 */

import { AuditTaskInfoItemType, DetailListItemType } from "./types";
import http, { AxiosRequestConfig } from "@/utils/request";

export type { AuditTaskInfoItemType, DetailListItemType };

/**
 * 信息中心-接口请求说明:
 * @param params 请求参数
 * @param config 配置项
 * @returns 请求实例
 */

/** 我创建的任务 */
export const getCreateTask = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/mycreatetask/querymytasks",
    method: "POST",
    data: params,
    ...config
  });
};
/** 我负责的任务 */
export const getMyTask = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/mypersontask/querymytasks",
    method: "POST",
    data: params,
    ...config
  });
};

/** ============================== 金蝶业务审批 ============================== */

/** 金蝶业务审批(我的待办) */
export const getKingdeeAuditTask = (params) => {
  return http.request({
    url: "/app/qywx/workspace/jindieapproval/getrunningflowdatasbytheapproval",
    method: "POST",
    data: params
  });
};
/** 金蝶业务审批(我的待办) - 获取审批节点详细信息*/
export const approvalNodeDetails = (params) => {
  return http.request({
    url: "/app/qywx/workspace/jindieapproval/getapprovalnodedetails",
    method: "POST",
    data: params
  });
};
/** 金蝶业务审批(我的待办) - 票据编号获取产品详细信息*/
export const detailsByBillNoforProduce = (params) => {
  return http.request({
    url: "/app/qywx/workspace/jindieapproval/getdetailsbybillnoforproduce",
    method: "POST",
    data: params
  });
};
/** 金蝶业务审批(我的待办) - 获取审批实例详细信息*/
export const approvalInstanceDetails = (params) => {
  return http.request({
    url: "/app/qywx/workspace/jindieapproval/getapprovalinstancedetails",
    method: "POST",
    data: params
  });
};
/** 金蝶业务审批(我的待办) - 获取快速选择批准顾问*/
export const fastSelectApprovalAdviceList = (params) => {
  return http.request({
    url: "/app/qywx/workspace/jindieapproval/getfastselectapprovaladvicelist",
    method: "POST",
    data: params
  });
};
/** 金蝶业务审批(我的待办) - 审核通过*/
export const auditPass = (params) => {
  return http.request({
    url: "/app/qywx/workspace/jindieapproval/auditBills",
    method: "POST",
    data: params
  });
};

/** 金蝶业务审批- 获取附件预览地址*/
export const fetchAttrViewUrl = (fileId) => {
  return http.request({
    url: `/app/qywx/workspace/jindieapproval/viewingFile/${fileId}`,
    method: "GET",
    params: {}
  });
};

/** 金蝶业务审批(我的已办) */
export const getKingdeeAuditedTask = (params) => {
  return http.request({
    url: "/app/qywx/workspace/jindieapproval/getrunningflowdatasbyprocessed",
    method: "POST",
    data: params
  });
};

/** 金蝶业务审批(我发起的) */
export const getKingdeeLaunchTask = (params) => {
  return http.request({
    url: "app/qywx/workspace/jindieapproval/getlanuchflowdatasbyprocessed",
    method: "POST",
    data: params
  });
};

/** ============================== 业务审批 ============================== */

/** 业务审批(我的待办) */
export const getAuditTask1 = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/approval/q1",
    method: "POST",
    data: params,
    ...config
  });
};
/** 业务审批(我的已办) */
export const getAuditTask2 = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/approval/q2",
    method: "POST",
    data: params,
    ...config
  });
};
/** 业务审批(我发起的) */
export const getAuditTask3 = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/approval/q3",
    method: "POST",
    data: params,
    ...config
  });
};

/** 单据详情查询 */
export const getAuditTaskDetail = (params, config?: AxiosRequestConfig) => {
  return http.request<AuditTaskInfoItemType[]>({
    url: "/app/qywx/workspace/approval/getformdata",
    method: "POST",
    data: params,
    ...config
  });
};

/** 撤销单据 */
export const revokeAuditTask = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/approval/revoke",
    method: "POST",
    data: params,
    ...config
  });
};

/** 审批单据 */
export const auditAuditTask = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/approval/approval",
    method: "POST",
    data: params,
    ...config
  });
};

/** 审批单据回退 */
export const backAuditTask = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/approval/back",
    method: "POST",
    data: params,
    ...config
  });
};

/** 获取可回退节点列表 */
export const getBackNodesList = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/approval/backnodes",
    method: "POST",
    data: params,
    ...config
  });
};

/** 查询审批备注 */
export const fetchRemarkList = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/sys/sys/billremarkscomment/selectbilllist",
    method: "POST",
    data: params,
    ...config
  });
};

/** 提交转审 */
export const changeAuditUser = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/approval/changeTask",
    method: "POST",
    data: params,
    ...config
  });
};

/** 增加审批备注 */
export const addRemarkList = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/sys/sys/billremarkscomment/insert",
    method: "POST",
    data: params,
    ...config
  });
};

/** 删除审批备注 */
export const deleteRemarkList = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/sys/sys/billremarkscomment/deleteremarks",
    method: "POST",
    data: params,
    ...config
  });
};
