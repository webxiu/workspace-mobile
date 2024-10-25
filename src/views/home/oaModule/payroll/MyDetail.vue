<template>
  <div class="detail-page">
    <van-notice-bar
      class="user-title"
      color="#1989fa"
      background="#ecf9ff"
      left-icon="info-o"
    >
      【{{ detailInfo.Name }} {{ detailInfo.YearMonth }}】工资单
    </van-notice-bar>
    <div>
      <div class="detail">
        <div class="des-item" v-for="item in salaryDicts">
          <van-row>
            <van-col class="label" span="11">{{ item.title }}：</van-col>
            <!-- <van-col class="value">{{ item.value || "-" }}</van-col> -->
            <van-col :class="[calcItemRes(item) ? 'redStyle' : '', 'value']">{{
              item.value || "- -"
            }}</van-col>
          </van-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { watch, ref } from "vue";
const props = defineProps(["detailInfo", "templatesList"]);

const salaryDicts = ref([]) as any;

const calcItemRes = (item) => {
  return (
    item.label === "SD" ||
    item.label === "YangLBX" ||
    item.label === "YiLBX" ||
    item.label === "SYBX" ||
    item.label === "ZFGJJ" ||
    item.label === "HS" ||
    item.label === "DJGRSDS"
  );
};

watch(props, () => {
  let arr = props.templatesList.map((item) => {
    return {
      label: item.fieldName,
      title: item.fieldTitle,
      value: "",
    };
  });
  salaryDicts.value = arr.map((item) => ({
    label: item.label,
    value:
      (calcItemRes(item) ? "-" : "") +
      (props.detailInfo[item.label] === "-"
        ? ""
        : props.detailInfo[item.label] || ""),
    // : props.detailInfo[item.label],
    // value: props.detailInfo[item.label],
    title: item.title,
  }));
});
</script>

<style scoped lang="scss">
.detail-page {
  padding: 60px 80px 120px;

  .des-item {
    margin-bottom: 24px;
    font-size: 28px;

    .label {
      text-align: right;
    }
    .value {
      font-weight: 600;
      color: black;
    }
    .redStyle {
      color: red !important;
    }
  }
  .user-title {
    margin-bottom: 50px;
    font-size: 30px;
  }
}
</style>
