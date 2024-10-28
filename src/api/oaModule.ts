/*
 * @Author: lixiuhai
 * @Date: 2023-06-23 10:05:51
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-25 17:56:58
 */
/**
 * 接口请求说明:
 * @param params 请求参数
 * @param config 配置项(配置请求头, 请求超时时间等)
 * @returns 请求实例
 */

import {
  AttendanceRecordItemType,
  AttendanceRecordMulItemType,
  FaceCollectItemType,
  HrDocItemType,
  ProdScheduleItemType,
  ResignApplyItemType,
  UserBasicInfoItemType
} from "./types";
import http, { AxiosRequestConfig } from "@/utils/request";

import axios from "axios";

export type {
  ProdScheduleItemType,
  FaceCollectItemType,
  AttendanceRecordItemType,
  ResignApplyItemType,
  UserBasicInfoItemType,
  AttendanceRecordMulItemType,
  HrDocItemType
};

/** 获取个人请假单列表 */
export const getLeaveList = (params, config?: AxiosRequestConfig) => {
  return http.request({
    // url: "/oa/hr/askforleave/selectPage",
    url: "/app/qywx/workspace/askforleave/select",
    method: "POST",
    data: params,
    ...config
  });
};

/** 获取请假单抄送列表 */
export const getSendLeaveList = (params = {}, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/askforleave/getaskforleaveforme",
    method: "POST",
    ...config
  });
};

/** 通用枚举查询接口 */
export const fetchEnumList = (params) => {
  return http.request({
    url: "/sys/sys/optioninfo/getOptionInfoList",
    method: "GET",
    params
  });
};

/** 获取加班单抄送列表 */
export const getSendOverTimeList = (params = {}, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/overtimeapply/getovertimeforme",
    method: "POST",
    ...config
  });
};

/** 获取请假单详情 */
export const getLeaveDetail = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/askforleave/selectdetail",
    method: "GET",
    params,
    ...config
  });
};

/** 获取加班单列表 */
export const getOvertimeList = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/overtimeapply/select",
    method: "POST",
    data: params,
    ...config
  });
};

/** 获取加班单详情 */
export const getOverTimeDetail = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/overtimeapply/selectdetail",
    method: "GET",
    params,
    ...config
  });
};

/** 新增请假单 */
export const addLeaveList = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/askforleave/insert",
    method: "POST",
    data: params,
    ...config
  });
};

/** 编辑请假单 */
export const editLeaveList = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/askforleave/update",
    method: "POST",
    data: params,
    ...config
  });
};

/** 删除请假单 */
export const deleteLeaveList = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/askforleave/delete",
    method: "POST",
    params,
    ...config
  });
};

/** 提交请假单 */
export const submitLeaveList = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/askforleave/submit",
    method: "POST",
    params,
    ...config
  });
};

/** 撤销请假单 */
export const revokeLeaveList = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/askforleave/revoke",
    method: "POST",
    params,
    ...config
  });
};

/** 新增加班单 */
export const addOverTimeList = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/overtimeapply/insert",
    method: "POST",
    data: params,
    ...config
  });
};

/** 编辑加班单 */
export const editOverTimeList = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/overtimeapply/update",
    method: "POST",
    data: params,
    ...config
  });
};

/** 删除加班单 */
export const deleteOverTimeList = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/overtimeapply/delete",
    method: "POST",
    params,
    ...config
  });
};

/** 提交加班单 */
export const submitOverTimeList = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/overtimeapply/submit",
    method: "POST",
    params,
    ...config
  });
};

/** 撤销加班单 */
export const revokeOverTimeList = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/overtimeapply/revoke",
    method: "POST",
    params,
    ...config
  });
};

/** 计算请假时长 */
export const calcTimes = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/askforleave/calctime",
    method: "POST",
    data: params,
    ...config
  });
};

/** 计算加班时长 */
export const calcJBTimes = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/overtimeapply/CalcTime",
    method: "POST",
    data: params,
    ...config
  });
};

/** 新增加班单 */
export const insertOverTime = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/oa/hr/overtimeapply/insert",
    method: "POST",
    data: params,
    ...config
  });
};

/** 修改加班单 */
export const updateOverTime = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/oa/hr/overtimeapply/update",
    method: "POST",
    data: params,
    ...config
  });
};

/** 计算加班时长 PC */
export const calcOverTimes = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/oa/hr/overtimeapply/calctimes",
    method: "POST",
    data: params,
    ...config
  });
};

/** 获取工资已发放年份 */
export const getPayYears = (data, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/payslip/getmepayslipyear",
    method: "POST",
    data,
    ...config
  });
};

/** 获取工资条数据列表 */
export const getPayRollList = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/payslip/getmepaysliplistdata",
    method: "POST",
    params,
    ...config
  });
};

/** 获取工资条数据详情 */
export const getPayRollDetail = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/payslip/getpayslipdata",
    method: "POST",
    data: params,
    ...config
  });
};

/** 获取工资条模版数据 */
export const getTemplatePayRoll = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/payslip/getpaysliptemplatedata",
    method: "POST",
    data: params,
    ...config
  });
};

/** 提交工资单反馈 */
export const submitPayRollFeed = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/payslip/savepayslipexception",
    method: "POST",
    data: params,
    ...config
  });
};

/** 保存工资单签名信息 */
export const savePayRollsign = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/payslip/savepayslipsignature",
    method: "POST",
    data: params,
    ...config
  });
};

/** 查询工资单签名信息 */
export const queryPayRollsign = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/payslip/getsignaturebyid",
    method: "POST",
    data: params,
    ...config
  });
};

/** 查询文员信息 */
export const queryClerkInfo = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/payslip/getwenyuanbyusercode",
    method: "POST",
    data: params,
    ...config
  });
};

/** 查询内购商品列表 */
export const queryShoppingList = (params = {}, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/welfare/getcommoditieslistdata",
    method: "POST",
    data: params,
    ...config
  });
};

/** 获取区域列表 */
export const getAreaList = (params = {}, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/welfare/getarealist",
    method: "GET",
    params,
    ...config
  });
};

/** 新增收货地址 */
export const addAddressList = (params = {}, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/qywx/useraddress/insertuseraddress",
    method: "POST",
    data: params,
    ...config
  });
};

/** 编辑收货地址 */
export const editAddressList = (params = {}, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/qywx/useraddress/updateuseraddressbyid",
    method: "POST",
    data: params,
    ...config
  });
};

/** 删除收货地址 */
export const deleteAddressList = (params = {}, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/qywx/useraddress/deleteuseraddressbyid",
    method: "POST",
    data: params,
    ...config
  });
};

/** 查询收货地址列表 */
export const queryAddressList = (params = {}, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/qywx/useraddress/getuseraddresslist",
    method: "GET",
    params,
    ...config
  });
};

/** 查询收货地址详情 */
export const getAddressListDetailInfo = (params = {}, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/qywx/useraddress/selectuseraddressbyid",
    method: "GET",
    params,
    ...config
  });
};

/** 查询默认收货地址 */
export const getDefaultAddressListByUserId = (params = {}, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/qywx/useraddress/getuseraddresslist",
    method: "GET",
    params,
    ...config
  });
};

/** 查询订单列表 */
export const queryOrderList = (params = {}, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/qywx/insideorder/selectallinsideorderbyuserid",
    method: "POST",
    data: params,
    ...config
  });
};

/** 查询订单详情 */
export const queryOrderDetailInfo = (params = {}, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/qywx/insideorder/selectinsideorderbyid",
    method: "GET",
    params,
    ...config
  });
};

/** 保存内购订单 */
export const saveOrderListItem = (params = {}, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/qywx/insideorder/insertinsideorder",
    method: "POST",
    data: params,
    ...config
  });
};

/** 取消订单 */
export const cancelOrderListItem = (params = {}, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/qywx/insideorder/deleteinsideordebyid",
    method: "POST",
    params,
    ...config
  });
};

/** 获取经营数据 */
export const getSaleokratedata = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/mangerdata/saleokratedata",
    method: "GET",
    params,
    ...config
  });
};

/** 供应商投诉 */
export const getSupplierComplaints = (params: object, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/complaintmanagement/selectAll",
    method: "POST",
    data: params,
    ...config
  });
};

/** 供应商投诉 - 获取验证码 */
export const getSupplierComplaintsPhoneCode = (params: object, config?: AxiosRequestConfig) => {
  return http.request({
    url: "app/qywx/workspace/suppliercomplaint/send",
    method: "GET",
    params: params,
    ...config
  });
};

/** 供应商投诉 - 新增 */
export const addSupplierComplaints = (params: object, config?: AxiosRequestConfig) => {
  return http.request({
    url: "app/qywx/workspace/suppliercomplaint/insert",
    method: "POST",
    data: params,
    ...config
  });
};

/** 供应商投诉 - 详情 */
export const getSupplierComplaintsDetail = (params: object, config?: AxiosRequestConfig) => {
  return http.request({
    url: "app/qywx/workspace/complaintmanagement/selectdetail",
    method: "GET",
    params: params,
    ...config
  });
};

/** 客户投诉 */
export const getCustomerComplaint = (params: object, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/complaint/query",
    method: "POST",
    data: params,
    ...config
  });
};
/** 客户投诉 - 详情 */
export const getCustomerComplaintDetail = (params: object, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/complaint/querydetail",
    method: "GET",
    params: params,
    ...config
  });
};

/** 个人看板 */
export const getPersonInfo = (params: object, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/personboard/selectpersonboarddate",
    method: "POST",
    data: params,
    ...config
  });
};

/** 考勤单 */
export const getAttendanceSheet = (params: object, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/attendancedetail/getattendancebyyear",
    method: "POST",
    params: params,
    ...config
  });
};

/** 考勤单 - 获取年份 */
export const getAttendanceSheetYear = (params: object, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/attendancedetail/getmeattendancedetailyear",
    method: "POST",
    data: params,
    ...config
  });
};

/** 考勤单 - 考勤详情 */
export const getAttendanceDetail = (params: object, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/attendancedetail/getmeattendancedetailbyid",
    method: "POST",
    data: params,
    ...config
  });
};

/** 考勤单 - 签名预提交 */
export const getPreviewSignature = (params: object, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/attendancedetail/getattendancedetailstatusbyid",
    method: "POST",
    data: params,
    ...config
  });
};

/** 考勤单 - 提交签名 */
export const submitSignature = (params: object, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/attendancedetail/saveattendancedetailsignature",
    method: "POST",
    data: params,
    ...config
  });
};

/** 考勤单 - 获取签名图片 */
export const getSignature = (params: object, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/attendancedetail/getsignaturebyid",
    method: "POST",
    data: params,
    ...config
  });
};

/** 考勤单 - 保存异常信息 */
export const saveAttendanceException = (params: object) => {
  return http.request({
    url: "/app/qywx/workspace/attendancedetail/saveattendancedetailexception",
    method: "POST",
    data: params
  });
};
/** 考勤单 - 获取人员openID */
export const saveAttendanceUserOpenID = (params: object) => {
  return http.request({
    url: "/app/qywx/workspace/attendancedetail/getwenyuanbyusercode",
    method: "POST",
    data: params
  });
};
/** 考勤单 - 发送通知消息给企业微信用户 */
export const sendQywxUser = (params: object, data: object) => {
  // 域名地址不同, 单独设置
  return axios({
    baseURL: import.meta.env.VITE_QYWX_USER_URL,
    url: "/qywx/oasendmessage",
    method: "POST",
    data: data,
    params: params
  });
};

/** 生产排产 - 查询列表接口 */
export const fetchProdScheduleList = (params) => {
  return http.request<TablePagingResType<ProdScheduleItemType>>({
    url: "/app/qywx/workspace/manufacturearrangement/select",
    method: "POST",
    data: params
  });
};

/** 生产排产 - 查询产线接口 */
export const fetchLineList = (params) => {
  return http.request({
    url: "/app/qywx/workspace/manufacturearrangement/selectallprodline",
    method: "POST",
    data: params
  });
};

/** 餐卡申领 - 查询列表接口 */
export const fetchMealCardList = (params) => {
  return http.request({
    url: "/app/qywx/workspace/mealcardmanagement/getallbyuserid",
    method: "GET",
    params
  });
};

/** 餐卡申领 - 申领接口 */
export const applyMealCard = (data) => {
  return http.request({
    url: "/app/qywx/workspace/mealcardmanagement/applyformealcard",
    method: "POST",
    data
  });
};

/** 餐卡申领 - 验证接口 */
export const verifyMealCard = (data) => {
  return http.request({
    url: "/app/qywx/workspace/mealcardmanagement/ismealcard",
    method: "POST",
    data
  });
  // return new Promise((resolve) =>
  //   resolve({ data: { isCurMonth: true }, status: 200 })
  // );
};

/** 餐卡申领 - 撤销接口 */
export const revokeMealCard = (params) => {
  return http.request({
    url: "/app/qywx/workspace/mealcardmanagement/deletebyId",
    method: "GET",
    params
  });
};

/** 餐卡申领 - 退卡接口 */
export const backMealCard = (params) => {
  return http.request({
    url: "/app/qywx/workspace/mealcardmanagement/bankmealcard",
    method: "POST",
    params
  });
};

/** 人事档案 - 查询接口 */
export const fetchHrDocList = (params) => {
  return http.request<TablePagingResType<HrDocItemType>>({
    url: "/oa/hr/staffinfo/select",
    method: "POST",
    data: params
  });
};

/** 人事档案 - 获取部门接口 */
export const fetchDeptTreeData = (params) => {
  return http.request({
    url: "/work/sys/orgchart/select",
    method: "POST",
    data: params
  });
};

/** 人事档案 - 获取明细接口 */
export const fetchDetailData = (params) => {
  return http.request({
    url: "/oa/hr/staffinfo/selectbyedit",
    method: "get",
    params
  });
};

/** 抄水电表 - 插入 */
export const insertWaterAndElectric = (data) => {
  return http.request({
    url: "/app/qywx/workspace/dormitorywaterelectricity/insert",
    method: "post",
    data
  });
};

/** 抄水电表 - 更新 */
export const updateWaterAndElectric = (data) => {
  return http.request({
    url: "/app/qywx/workspace/dormitorywaterelectricity/update",
    method: "post",
    data
  });
};

/** 抄水电表 - 获取上月水电读数 */
export const getPreMonthWaterAndElectric = (data) => {
  return http.request({
    url: "/app/qywx/workspace/dormitorywaterelectricity/getlastmonthwaterorelectricvalue",
    method: "post",
    data
  });
};

/** 抄水电表 - 查询所有水电记录 */
export const getAllWaterAndElectricList = (data) => {
  return http.request({
    url: "/app/qywx/workspace/dormitorywaterelectricity/select",
    method: "post",
    data
  });
};

/** 抄水电表 - 查询楼栋 */
export const getAllBuildingList = (data) => {
  return http.request({
    url: "/oa/hr/dormitorymanagement/selectallbuliding",
    method: "get",
    data
  });
};

/** 抄水电表 - 查询宿舍房间 */
export const getZoomList = (params) => {
  return http.request({
    url: "/oa/hr/dormitorymanagement/selectalldormitoryandwater",
    method: "post",
    data: params
  });
};

/** ======================== 打卡记录 ========================*/

/** 打卡记录 - 列表 */
export const attendanceRecordList = (params) => {
  return http.request<AttendanceRecordItemType[]>({ url: "/oa/hr/attendancerecord/getRecordByUser", method: "get", params });
};
/** 打卡记录 - 列表 */
export const attendanceRecordAllList = (data) => {
  return http.request<TablePagingResType<AttendanceRecordMulItemType>>({ url: "/oa/hr/attendancerecord/select", method: "post", data });
};
/** ======================== 面部采集 ========================*/

/** 面部采集 - 列表 */
export const faceCollectList = (params) => {
  return http.request<FaceCollectItemType[]>({ url: "/oa/hr/staffinfo/getNoFaceInfoStaff", method: "get", params });
};
/** 面部采集 - 提交采集 */
export const submitFaceCollect = (data) => {
  return http.request<boolean>({ url: "/oa/hr/staffinfo/faceInfoCollection", method: "post", data });
};

/** ======================== 离职申请 ========================*/

/**  离职申请 - 列表 */
export function resignApplyList(data) {
  return http.request<TablePagingResType<ResignApplyItemType>>({ url: "/oa/hr/StaffResign/selectStaffResign", method: "post", data });
}
/**  离职申请 - 新增 */
export function addResignApply(data) {
  return http.request<boolean>({ url: "/oa/hr/StaffResign/insert", method: "post", data });
}
/**  离职申请 - 修改 */
export function updateResignApply(data) {
  return http.request<boolean>({ url: "/oa/hr/StaffResign/update", method: "put", data });
}

/** 获取员工基本信息 */
export const getUserBasicInfo = (params) => {
  return http.request<UserBasicInfoItemType[]>({ url: "/oa/hr/StaffTransfer/queryBeforeInsert", method: "get", params });
};

/** 人事档案数据查询 */
export function fetchUserDocData(data) {
  return http.request({
    url: "/oa/hr/staffinfo/querystaffinfo",
    method: "get",
    params: data
  });
}

/** 工作时间设定: 列表 */
export function timeSettingList(data) {
  return http.request({
    url: "/oa/hr/worktimeinfo/select",
    method: "post",
    data
  });
}
