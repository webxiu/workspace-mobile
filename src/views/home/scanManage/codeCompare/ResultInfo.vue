<template>
  <HailenTable :columns="columns" :dataList="dataList" />
</template>

<script setup lang="tsx">
import HailenTable, { TableColumnType } from "./HailenTable.vue";

withDefaults(defineProps<{ dataList: any[] }>(), {
  dataList: () => []
});

const columns: TableColumnType[] = [
  { label: "序号", prop: "index", span: 3, render: ({ index }) => <span>{index + 1}</span> },
  { label: "二维码内容", prop: "qrCodeContent", span: 9 },
  { label: "文本内容", prop: "numberContent", span: 8 },
  {
    label: "结果",
    prop: "finishedResult",
    span: 4,
    render: ({ row }) => (
      <van-tag size="large" type={row.verifyResult === "OK" ? "success" : "danger"}>
        {row.verifyResult || "--"}
      </van-tag>
    )
  }
];
</script>

<style scoped lang="scss">
.compare-history {
  display: flex;
  flex: 1;
  height: 100%;
  width: 100%;
  overflow: hidden;
  flex-direction: column;
}

.compare-list {
  flex: 1;
  overflow-y: auto;
}
</style>
