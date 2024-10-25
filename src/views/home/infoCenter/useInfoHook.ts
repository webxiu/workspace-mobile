import { onMounted, reactive, ref, watch } from "vue";

import { AxiosResponse } from "@/utils/request";
import { showToast } from "vant";

export interface AuditTaskType {
  limit: number;
  page?: number;
  pageNo?: number;
  searchFrom?: number;
  taskState?: number;
  searchKey?: string;
}

export const TabActiveColor = "#1989fa";

type ApiType = (params: AuditTaskType) => Promise<AxiosResponse<any, any>>;

/**
 * 获取接口数据Hooks
 * @param api 请求API
 * @param params 请求参数
 * @param callback 回调参数
 */
export function useSearchHook(api: ApiType, params: AuditTaskType, callback?: Function) {
  const result = reactive({ data: {} });
  const isLoading = ref<boolean>(false);

  onMounted(() => {
    getData();
  });

  watch(params, (newVal) => {
    result.data = newVal;
    getData();
  });

  const getData = () => {
    isLoading.value = true;
    api(params)
      .then((res) => {
        result.data = res;
        isLoading.value = false;
        callback && callback(res);
        showToast({ message: "数据获取成功", position: "top" });
      })
      .catch((err) => {
        showToast({ message: "数据获取失败", position: "top" });
      });
  };
  return { data: result, isLoading, getData };
}
