<!-- /*
 * 我的待办
 * @Author: lixiuhai 
 * @Date: 2023-06-23 09:55:09 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-06-23 09:55:09 
 */ -->
<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import TaskList, { TaskItemType } from "./components/TaskList.vue";

const resultList = ref();
const router = useRouter();

const onLookInfo = (item: TaskItemType) => {
  router.push(`/infoCenter/kingdeeAudit/auditDetail?auditStatus=0&billNo=${item.billNo}&fbillNumber=${item.fbillNumber}&billType=${item.formId}&deployKey=${item.deployKey}`);
};

const initData = (data) => {
  resultList.value = data;
};
defineExpose({ initData });
</script>

<template>
  <TaskList v-if="resultList?.data.length > 0" :dataList="resultList?.data" @onLookInfo="onLookInfo" />
  <van-empty v-else description="暂无数据" />
</template>

<style lang="scss" scoped></style>
