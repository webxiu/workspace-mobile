/**
 * 通用请求Hooks
 */

import { onMounted, reactive, ref, watch } from "vue";

import { AxiosResponse } from "@/utils/request";
import type { Ref } from "vue";
import { showToast } from "vant";
import { throttle } from "@/utils/common";

export type RequestParamsType = Record<string, any>;

export interface ResponseType<T> {
  data: Ref<BaseResponseType<T>>;
  isLoading: Ref<boolean>;
  /** 获取数据: {showMsg} 是否显示提示信息, 默认不提示 */
  getData: (showMsg?: boolean) => void;
}

export interface RequestOptionType<D> {
  // 请求API
  api: D;
  // 请求参数
  params: RequestParamsType;
  // 回调参数
  callback?: Function;
  // 成功提示信息
  successMsg?: string;
  // 失败提示信息
  failMsg?: string;
  // 返回data的初始值
  initValue: any;
}

/**
 * 获取接口数据Hooks
 * @param options.api 请求API
 * @param options.params 请求参数
 * @param options.callback 回调参数
 * @param options.successMsg 成功提示信息
 * @param options.failMsg 失败提示信息
 */
export function useAxios<T extends any, D extends (...arg: any) => Promise<AxiosResponse<any, any>>>(options: RequestOptionType<D>): ResponseType<T> {
  const { api, params, callback, successMsg = "数据获取成功", failMsg = "数据获取失败", initValue } = options;

  const _data = ref({
    data: initValue,
    message: "",
    status: 0,
    timestamp: 0
  });
  const isLoading = ref(false);

  onMounted(() => getData());
  watch(
    params,
    throttle(() => getData())
  );

  /**
   * 获取接口数据
   * @param showMsg 是否显示提示信息
   */
  const getData = (showMsg = false) => {
    isLoading.value = true;
    api(params)
      .then((res) => {
        if (!res.data) throw "暂无数据";
        _data.value = res as any;
        isLoading.value = false;
        callback && callback(res);
        showMsg && showToast({ message: successMsg, position: "top" });
      })
      .catch((err) => {
        isLoading.value = false;
        showToast({ message: failMsg, position: "top" });
        callback && callback();
      });
  };
  return { data: _data, isLoading: isLoading, getData };
}
