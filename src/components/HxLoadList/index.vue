<template>
  <div class="wrap flex-col ui-h-100">
    <van-sticky>
      <slot name="header" />
    </van-sticky>
    <van-pull-refresh v-model="freshLoading" @refresh="onRefresh" class="flex-1 ui-ovy-a">
      <van-list v-model:loading="loading" :finished="finished" :finished-text="finishedText" @load="onLoad" class="p-16 box-border" v-if="dataList.length > 0">
        <van-cell v-for="(item, index) in dataList" :key="item[activeKey] || index">
          <div class="ui-ta-l ui-w-100 ui-ov-h">
            <slot name="list" :item="item" />
          </div>
        </van-cell>
      </van-list>
      <van-empty v-else :description="emptyText" />
      <van-back-top />
    </van-pull-refresh>
    <slot name="footer" />
  </div>
</template>

<script setup lang="tsx" generic="T extends Record<string, any>">
import { onMounted, reactive, ref, UnwrapRef, watch } from "vue";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { closeToast, showLoadingToast } from "vant";

/**
 * 分页列表下拉和上拉数据加载通用组件
 * 插槽: header、list、footer
 */
export interface Props<T extends Record<string, any>> {
  /** 接口参数 */
  formData?: Record<string, any>;
  /** 唯一标识 */
  activeKey?: string;
  /** 空数据提示 */
  emptyText?: string;
  /** 加载完成底部文字 */
  finishedText?: string;
  /** 是否显示loading遮罩 */
  showToastLoading?: boolean;
  /** 加载中提示(当showToastLoading为true时生效) */
  toastText?: string;
  /** 带分页的接口 */
  api: (data: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<TablePagingResType<T>, any>>;
  /** 刷新前参数获取 */
  onParams?: (data: any) => any;
}

const props = withDefaults(defineProps<Props<T>>(), {
  formData: () => ({}),
  activeKey: "id",
  emptyText: "暂无数据",
  finishedText: "没有更多了",
  toastText: "加载中...",
  showToastLoading: true,
  onParams: () => ({})
});
const finished = ref(false);
const loading = ref(false);
const freshLoading = ref(false);
const dataList = ref<T[]>([]);
const formData = reactive(props.formData);

onMounted(() => onLoad());

watch(props.formData, () => onLoad());

function onRefresh() {
  const params = props.onParams(formData);
  formData.page = 1;
  dataList.value = [];
  freshLoading.value = true;
  Object.assign(formData, params);
  onLoad();
}

/** 获取接口数据 */
function onLoad() {
  loading.value = true;
  if (props.showToastLoading) {
    showLoadingToast({
      message: props.toastText,
      loadingType: "spinner",
      forbidClick: true
    });
  }
  props
    .api(formData)
    .then(({ data }) => {
      if (dataList.value.length >= data.total || data.records.length === 0) {
        finished.value = true;
        return;
      }
      formData.page += 1;
      dataList.value = [...dataList.value, ...(data.records as UnwrapRef<T[]>)];
    })
    .finally(() => {
      closeToast();
      freshLoading.value = false;
      loading.value = false;
    });
}
</script>
