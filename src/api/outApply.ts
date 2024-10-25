/** 新增请假单 */

import http from "@/utils/request";

/** ========================================外出申请单============================= */

/** 插入 */
export const addGoOutList = (data) => {
  return http.request({
    url: "/oa/hr/gooutapply/insertapply",
    method: "POST",
    data,
  });
};

/** 提交 */
export const submitGoOutList = (data) => {
  return http.request({
    url: "/oa/hr/gooutapply/submitapply",
    method: "POST",
    data,
  });
};

/** 撤销 */
export const revokeGoOutList = (data) => {
  return http.request({
    url: "/oa/hr/gooutapply/revoke",
    method: "POST",
    data,
  });
};

/** 删除 */
export const deleteGoOutList = (data) => {
  return http.request({
    url: "/oa/hr/gooutapply/deleteapply",
    method: "POST",
    data,
  });
};

/** 更新 */
export const updateGoOutList = (data) => {
  return http.request({
    url: "/oa/hr/gooutapply/updateapply",
    method: "POST",
    data,
  });
};

/** 查询列表 */
export const fetchGoOutList = (data) => {
  return http.request({
    url: "/oa/hr/gooutapply/selectapply",
    method: "POST",
    data,
  });
};

/** 出车登记列表 */
export const fetchStartSignUpList = (data) => {
  return http.request({
    url: "/oa/hr/gooutregister/getgooutregisterlist",
    method: "POST",
    data,
  });
};

/** 出车登记详情 */
export const fetchStartSignUpDetail = (data) => {
  return http.request({
    url: "/oa/hr/gooutregister/getgooutregisterbyid",
    method: "POST",
    data,
  });
};

/** 返程登记列表 */
export const fetchEndSignUpList = (data) => {
  return http.request({
    url: "/oa/hr/gooutregister/getgooutbackregisterlist",
    method: "POST",
    data,
  });
};

/** 登记出车 */
export const signUpStart = (data) => {
  return http.request({
    url: "/oa/hr/gooutregister/insertgooutregister",
    method: "POST",
    data,
  });
};

/** 登记返程 */
export const signUpEnd = (data) => {
  return http.request({
    url: "/oa/hr/gooutregister/insertgooutbackregister",
    method: "POST",
    data,
  });
};

/** 获取车辆下拉选项 */
export const getCarOptions = (data) => {
  return http.request({
    url: "/oa/hr/carinfo/select",
    method: "POST",
    data,
  });
};

/** 获取车辆下拉选项 */
export const getCarIsFreeTimeInfo = (data) => {
  return http.request({
    url: "/oa/hr/carinfo/carisletsure",
    method: "POST",
    data,
  });
};

/** 上传附件 */
export const uploadCarAttrList = (data) => {
  return http.request({
    headers: { "Content-Type": "multipart/form-data" },
    url: "/oa/hr/gooutregister/uploadfile",
    method: "POST",
    data,
  });
};
