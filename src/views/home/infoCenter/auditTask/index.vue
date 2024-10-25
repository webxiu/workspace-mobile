<script lang="ts" setup>
import { reactive, ref, watch, onMounted } from "vue";
import { showToast } from "vant";
import { AuditTaskType, TabActiveColor } from "../index";
import { getAuditTask1, getAuditTask2, getAuditTask3 } from "@/api/infoCenter";
import MyAudit from "./MyAudit.vue";
import MyAudited from "./MyAudited.vue";
import MyInitiate from "./MyInitiate.vue";
import { useRoute } from "vue-router";

const auditList = [
  { title: "我的待办", status: "audit1" },
  { title: "我的已办", status: "audit2" },
  { title: "我的发起", status: "audit3" }
];
const API: { [key: string]: any } = {
  audit1: getAuditTask1,
  audit2: getAuditTask2,
  audit3: getAuditTask3
};
const tabs = [MyAudit, MyAudited, MyInitiate];

const swipeRef = ref();
const route = useRoute();
const childRef = ref();
const apiKey = ref("audit1");
const active = ref<number>(0);
const badgeNum = ref(0);
const searchValue = ref<string>("");
const refreshing = ref<boolean>(false);
const queryParams: AuditTaskType = reactive({
  page: 1,
  limit: 10,
  searchKey: ""
});

onMounted(() => getData());

watch(active, (newVal) => {
  const taskState = auditList[newVal].status;
  apiKey.value = taskState;
  getData();
});

watch(route, (newVal) => {
  if (newVal.path === "/infoCenter/auditTask") {
    getData();
  }
});

const getData = () => {
  refreshing.value = true;
  API[apiKey.value](queryParams)
    .then((res) => {
      setData(res);
      refreshing.value = false;
      showToast({ message: "数据获取成功", position: "top" });
    })
    .catch((err) => {
      showToast({ message: "数据获取失败", position: "top" });
    });
};

const setData = (data) => {
  childRef.value?.forEach((child, index) => {
    if (active.value === index) {
      child.initData(data);
    }
  });
};

const onTabChange = (index: number) => {
  swipeRef.value?.swipeTo(index);
};
const onSwipeChange = (index: number) => {
  active.value = index;
};
const onSearch = (value: string) => {
  queryParams.searchKey = value;
  getData();
};

const onRefresh = () => {
  childRef.value?.forEach((_: any, index) => {
    if (active.value === index) getData();
  });
};

const setBadgeNum = (num) => (badgeNum.value = num);
</script>

<template>
  <van-sticky>
    <van-tabs v-model:active="active" class="info-center" swipeable sticky :color="TabActiveColor" :title-active-color="TabActiveColor" @change="onTabChange">
      <van-tab v-for="(item, idx) in auditList" :title="item.title" :key="idx" :badge="idx === 0 && idx === active ? badgeNum : ''" />
    </van-tabs>
    <van-search v-model="searchValue" shape="round" @search="onSearch" placeholder="请输入搜索关键词" />
  </van-sticky>
  <van-swipe ref="swipeRef" :loop="false" :immediate="false" :show-indicators="false" @change="onSwipeChange">
    <van-swipe-item v-for="(_, idx) in tabs" :key="idx">
      <!-- <van-pull-refresh v-model="refreshing" @refresh="onRefresh"> -->
      <component :is="tabs[idx]" ref="childRef" @fetchData="getData" @setBadgeNum="setBadgeNum" @onRefresh="onRefresh" :queryParams="queryParams" />
      <!-- </van-pull-refresh> -->
    </van-swipe-item>
  </van-swipe>
</template>

<style lang="scss" scoped>
@import url("../../index.scss");
:deep(.van-badge) {
  background: var(--tab-active-color);
}
</style>
