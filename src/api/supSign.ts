import http from "@/utils/request";

/** 验证供应商 */
export function verifySupplier(data) {
  return http.request({ url: "/authentication", method: "POST", data });
}

/** 查询采购订单的信息 */
export function querySignNoInfo(data) {
  return http.request({
    url: "/app/qywx/workspace/signback/getpobybillno",
    method: "POST",
    data,
  });
}

/** 查询采购订单列表 */
export function querySignList(data) {
  return http.request({
    url: "/app/qywx/workspace/signback/getpobysupcode",
    method: "POST",
    data,
  });
}

/** 保存 */
export function uploadSignAttr(data) {
  return http.request({
    headers: { "content-type": "application/x-www-form-urlencoded" },
    url: "app/qywx/workspace/signback/insertuploadfile",
    method: "POST",
    data,
  });
}

/** 提交 */
export function submitSupSignAttr(data) {
  return http.request({
    url: "app/qywx/workspace/signback/sumbile",
    method: "POST",
    params: data,
  });
}
