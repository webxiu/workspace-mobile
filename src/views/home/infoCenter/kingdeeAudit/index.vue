<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-06-23 09:53:49 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-06-23 09:53:49 
 */ -->
<script lang="ts" setup>
import { showToast } from "vant";
import { reactive, ref, watch, onMounted } from "vue";
import { AuditTaskType, TabActiveColor } from "../index";
import {
  getKingdeeAuditTask,
  getKingdeeAuditedTask,
  getKingdeeLaunchTask,
} from "@/api/infoCenter";
import MyAudit from "./MyAudit.vue";
import MyAudited from "./MyAudited.vue";
import MyInitiate from "./MyInitiate.vue";
import { useRoute } from "vue-router";

const auditList = [
  { title: "我的待办", status: "audit1" },
  { title: "我的已办", status: "audit2" },
  { title: "我的发起", status: "audit3" },
];
const API: { [key: string]: any } = {
  audit1: getKingdeeAuditTask,
  audit2: getKingdeeAuditedTask,
  audit3: getKingdeeLaunchTask,
};
const tabs = [MyAudit, MyAudited, MyInitiate];
const route = useRoute();

const swipeRef = ref();
const childRef = ref();
const apiKey = ref("audit1");
const active = ref<number>(0);
const searchValue = ref<string>("");
const isLoading = ref<boolean>(false);
const queryParams: AuditTaskType = reactive({
  pageNo: 1,
  limit: 50,
  searchKey: "",
});

const curCount = ref<number>(0);
const curCount1 = ref<number>(0);
const curCount2 = ref<number>(0);

onMounted(() => {
  Object.keys(API).forEach((key, index) => {
    getData(key, index);
  });
});

watch(active, (newVal) => {
  const taskState = auditList[newVal].status;
  apiKey.value = taskState;
});

const getCount = (index: number) => {
  const countObj = {
    0: [curCount.value],
    1: [curCount1.value],
    2: [curCount2.value],
  };
  return countObj[index] || "";
};

/**
 * 获取数据
 * @param aKey tab的key名称
 * @param index 获取第几个tab接口
 * @param isShowMsg 是否显示请求成功提示
 */
const getData = (aKey: string, index: number, isShowMsg = false) => {
  isLoading.value = true;
  API[aKey](queryParams)
    .then((res) => {
      if (!res.data) throw "数据获取失败";
      childRef.value?.forEach((child, idx) => {
        if (index === 0) {
          curCount.value = res.data.length;
        } else if (index === 1) {
          curCount1.value = res.data.length;
        } else if (index === 2) {
          curCount2.value = res.data.length;
        }
        if (index === idx) child.initData(res);
      });
      isShowMsg && showToast({ message: "数据获取成功", position: "top" });
    })
    .catch((err) => showToast({ message: "数据获取失败", position: "top" }))
    .finally(() => (isLoading.value = false));
};

const onTabChange = (index: number) => {
  swipeRef.value?.swipeTo(index);
};
const onSwipeChange = (index: number) => {
  active.value = index;
};
const onSearch = (value: string) => {
  queryParams.searchKey = value;
  getData(apiKey.value, active.value);
};

const onRefresh = () => {
  childRef.value?.forEach((_, index) => {
    if (active.value === index) getData(apiKey.value, active.value, true);
  });
};

watch(route, () => onRefresh());
</script>

<template>
  <div class="flex-col ui-h-100">
    <van-sticky>
      <van-tabs
        v-model:active="active"
        class="info-center"
        swipeable
        sticky
        :color="TabActiveColor"
        :title-active-color="TabActiveColor"
        @change="onTabChange"
      >
        <van-tab
          v-for="(item, idx) in auditList"
          :title="item.title"
          :key="idx"
          :badge="idx === active ? `${getCount(idx)}` : ''"
        />
      </van-tabs>
      <van-search
        v-model="searchValue"
        shape="round"
        @search="onSearch"
        placeholder="请输入搜索关键词"
      />
    </van-sticky>
    <van-swipe
      ref="swipeRef"
      class="flex-1 ui-h-100"
      :loop="false"
      :immediate="false"
      :show-indicators="false"
      @change="onSwipeChange"
    >
      <van-swipe-item v-for="(_, idx) in tabs" :key="idx">
        <van-pull-refresh
          class="ui-h-100 ui-ovy-a"
          v-model="isLoading"
          @refresh="onRefresh"
        >
          <component :is="tabs[idx]" ref="childRef" />
        </van-pull-refresh>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<style lang="scss" scoped>
@import url("../../index.scss");
:deep(.van-badge) {
  background: var(--tab-active-color);
}
</style>
