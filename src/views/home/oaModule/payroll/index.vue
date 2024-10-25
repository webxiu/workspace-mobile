<script lang="ts" setup>
import { onMounted, ref } from "vue";
import PayList from "./PayList.vue";
import { getPayYears } from "@/api/oaModule";
import dayjs from "dayjs";

const tabs = [PayList];
const swipeRef = ref();
const yearValue = ref("");
const filterOptions = ref([{ text: "全部", value: "" }]);

onMounted(() => {
  getCurrentYear();
  getPayYearsList();
});

const getCurrentYear = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  const curYear = dayjs(date).format("YYYY");
  yearValue.value = curYear;
};

const dropMenuChange = (val) => (yearValue.value = val);

// 获取已发工资年份列表
const getPayYearsList = () => {
  getPayYears({}).then(({ data }) => {
    if (!data) return;
    data.forEach(({ year }) => {
      filterOptions.value.push({ text: year, value: year });
    });
  });
};
</script>

<template>
  <div class="over-time">
    <van-sticky>
      <!-- 下拉菜单 -->
      <van-dropdown-menu>
        <van-dropdown-item v-model="yearValue" :options="filterOptions" @change="dropMenuChange" />
      </van-dropdown-menu>
    </van-sticky>

    <!-- 滑动区域 -->
    <van-swipe ref="swipeRef" :loop="false" :show-indicators="false">
      <van-swipe-item v-for="(_, index) in tabs" :key="index">
        <component :is="tabs[index]" :dropKey="yearValue" ref="sonRef"></component>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<style lang="scss" scoped>
:deep(.van-tabs__wrap) {
  touch-action: manipulation;
}
:deep(.van-tabs__content) {
  width: 750px;
  height: 100%;
  background: #f60;
}
.add-action {
  width: 120px;
  border-radius: 50%;
  box-shadow: 2px 3px 6px grey;
  background-color: #5686ff;
  bottom: 30px;
  right: 70px;
  height: 120px;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}
</style>
