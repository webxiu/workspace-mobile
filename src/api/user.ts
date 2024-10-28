/*
 * @Author: lixiuhai
 * @Date: 2023-06-23 10:05:48
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-25 11:14:18
 */

import { LoginUserInfoType, UserAuthItemType } from "./types";

import http from "@/utils/request";

export type { UserAuthItemType, LoginUserInfoType };

export type LoginType = { userNo: string; password: string; orgDomain?: string };

/** 登录 */
export function login(data: LoginType) {
  return http.request({ url: "/verifyuser", method: "POST", data });
}

/** 注销登录 */
export function logout() {
  return http.request({ url: "/logout", method: "GET" });
}

/** 查询用户信息 */
export function queryUserInfo(params) {
  return http.request<LoginUserInfoType>({ url: "/getowneruserinfo", method: "GET", params });
}

/** 查询人事档案信息 */
export function queryStaffUserInfo(params) {
  return http.request({ url: "/oa/hr/staffinfo/select", method: "POST", data: params });
}

/** 使用Code自动登录(接口未出) */
export function autoLogin(params) {
  return http.request({ url: "/app/qywx/api/mobileAppLogin", method: "GET", params });
}

/** 查询用户菜单权限 */
export function queryUserAuthList(params) {
  return http.request<UserAuthItemType[]>({ url: "/home/usermenuqywx", method: "GET", params });
}

/** 查询kkView预览地址 */
export function queryKKViewUrl() {
  return http.request<string>({ url: "/sys/system/getPrevewDomain", method: "GET", params: {} });
}

/** 获取部门树 */
export function getDeptTreeData(params) {
  return http.request({ url: "/sys/com/getdepttreedata", method: "GET", params });
}

/** 根据部门查询用户列表 */
export function getUserListByDept(params) {
  return http.request({ url: "/sys/sys/userinfo/select", method: "POST", data: params });
}
