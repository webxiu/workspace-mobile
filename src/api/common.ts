/*
 * @Author: lixiuhai
 * @Date: 2023-06-23 10:05:57
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-21 17:17:09
 */

import { CodeCompareItemType, CompareDetailItemType, CompareResultItemType, CompareResultResType } from "./types";
import http, { AxiosRequestConfig } from "@/utils/request";

export type { CodeCompareItemType, CompareDetailItemType, CompareResultResType, CompareResultItemType };

/**
 * 获取经营数据
 * @param params 请求参数
 * @param config 配置项
 * @returns 请求实例
 */
export const loginApi = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/app/qywx/workspace/mangerdata/saleokratedata",
    method: "POST",
    params,
    ...config
  });
};
/**
 * 获取经营数据
 * @param params 请求参数
 * @param config 配置项
 * @returns 请求实例
 */
export const getAsyncRoutes = (params, config?: AxiosRequestConfig) => {
  return http.request({
    url: "/home/usermenu",
    method: "POST",
    params,
    ...config
  });
};

/** 通用提交接口 */
export const commonSubmit = (params, config?: AxiosRequestConfig) => {
  return http.request<boolean>({
    url: "/app/common/approval/submit",
    method: "POST",
    data: params,
    ...config
  });
};

/** 通用回退接口 */
export const commonBack = (params, config?: AxiosRequestConfig) => {
  return http.request<boolean>({
    url: "/app/common/approval/back",
    method: "POST",
    data: params,
    ...config
  });
};

/** 条码验证历史列表 */
export const codeCompareList = (data, config?: AxiosRequestConfig) => {
  return http.request<TablePagingResType<CodeCompareItemType>>({
    url: "/app/qywx/workspace/orcodeverify/select",
    method: "POST",
    data: data,
    ...config
  });
};

/** 二维码验证结果详情列表 */
export const codeCompareInfo = (data, config?: AxiosRequestConfig) => {
  return http.request<CompareResultItemType[]>({
    url: "/app/qywx/workspace/orcodeverify/getverifyrecordbymasterid",
    method: "get",
    params: data,
    ...config
  });
};

/** 条码验证上传  */
export const codeCompare = (data, config?: AxiosRequestConfig | any) => {
  return http.request<CompareResultResType>({
    headers: { "Content-Type": "multipart/form-data" },
    url: "/app/qywx/workspace/orcodeverify/qrcodeverify",
    method: "POST",
    data: data,
    ...config
  });
};
