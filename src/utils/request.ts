/*
 * @Author: lixiuhai
 * @Date: 2023-06-23 10:03:17
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-28 17:52:02
 */

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getCookie, setCookie } from "@/utils/storage";

import axios from "axios";
import { getUrlParameters } from "@/utils/common";
import { showToast } from "vant";
import { useUserStoreWithOut } from "@/store/modules/user";

const axiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_BASE_API,
  timeout: 2 * 60 * 1000
});

/**
 * 状态码说明:
 * 502: TOKEN过期
 * 504: 没有token
 * 508: token不合法
 * 509: 身份验证异常
 */
const STATUS_CODE = [401, 502, 504, 508, 509];

axiosInstance.interceptors.request.use((config) => {
  // config.headers["Authorization"] = "Bearer " + getUserInfo().token;
  const queryData = getUrlParameters(location.href);
  if (!getCookie()) setCookie(Date.now().toString());
  if (queryData.projectId) {
    const dbKey = queryData.projectId.split("/")[1];
    config.headers["dbKey"] = `/${dbKey}`;
  }
  return config;
});
axiosInstance.interceptors.response.use(
  (response: AxiosRequestConfig<BaseResponseType<{}>>): any => {
    const data = response.data;
    if (data?.status === 200) {
      return data;
    }
    if (STATUS_CODE.includes(data?.status as number)) {
      showToast({ message: data?.message || "请重新登录", type: "fail", duration: 3000, position: "middle" });
      useUserStoreWithOut().logout();
    } else if (data?.status === 403) {
      showToast({ message: "未授权", position: "top" });
    } else {
      let errMsg = data?.message;
      if (typeof data === "string") errMsg = data; // 接口不包装直接返回错误信息的情况
      if (errMsg) {
        const errText = errMsg.toString().substring(0, 1000);
        showToast({ message: errText, duration: 3000, position: errText.length < 100 ? "top" : "middle", wordBreak: "break-all" });
      }
    }
    return Promise.reject(data);
  },
  (err) => {
    if (axios.isCancel(err)) {
      showToast({ message: err.message || "取消请求", position: "top" });
    } else {
      const isTimeout = err.message.includes("timeout");
      const msgText = err.message || "网络错误";
      const message = isTimeout ? "网络请求超时" : msgText;
      showToast({ message, type: "fail", position: "top", duration: 3000 });
    }
    return Promise.reject(err);
  }
);

/** 自定义响应结果类型 */
function createRequest(instance: AxiosInstance) {
  return function (config: AxiosRequestConfig) {
    return instance(config) as Promise<BaseResponseType<{}>>;
  };
}

/**
 * 用于网络请求的方法
 */
export const request = createRequest(axiosInstance);

export { AxiosRequestConfig, AxiosResponse };
export default axiosInstance;
