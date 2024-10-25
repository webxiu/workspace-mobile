<script lang="ts" setup>
import { reactive, ref } from "vue";

import { AuditTaskType } from "../index";
import MyAudit from "./MyAudit.vue";
import MyAudited from "./MyAudited.vue";
import MyInitiate from "./MyInitiate.vue";
import MyStop from "./MyStop.vue";
import { useAxios } from "@/hooks/useAxios";
import { getMyTask } from "@/api/infoCenter";

const auditList = [
  { title: "待处理", status: 2 },
  { title: "已处理", status: 3 },
  { title: "已暂停", status: 1 },
  { title: "已终止", status: 4 },
];
const tabs = [MyAudit, MyAudited, MyInitiate, MyStop];

const active = ref(0);
const childRef = ref();
const queryParams: AuditTaskType = reactive({
  page: 1,
  limit: 50,
  searchFrom: 3,
  taskState: 2,
});

const setData = (data) => {
  childRef.value?.forEach((child, index) => {
    if (active.value === index) {
      child.initData(data);
    }
  });
};

const onTabChange = (index: number) => {
  active.value = index;
  const taskState = auditList[index].status;
  queryParams.taskState = taskState;
};

const onRefresh = () => {
  childRef.value?.forEach((_: any, index: number) => {
    if (active.value === index) getData();
  });
};

const { isLoading, getData } = useAxios({
  api: getMyTask,
  params: queryParams,
  callback: setData,
  initValue: [],
});
</script>

<template>
  <van-tabs
    v-model:active="active"
    class="info-center"
    swipeable
    @change="onTabChange"
  >
    <van-tab v-for="(item, idx) in auditList" :title="item.title" :key="idx">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <component :is="tabs[idx]" ref="childRef" />
      </van-pull-refresh>
    </van-tab>
  </van-tabs>
</template>

<style lang="scss" scoped>
@import url("../../index.scss");
</style>
