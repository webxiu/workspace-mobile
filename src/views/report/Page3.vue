<template>
  <div class="section page3">
    <div class="bg-star">
      <img src="@/assets/report/page1_star.gif" />
    </div>
    <div class="content">
      <div class="text-wrap flex-1 ui-w-100">
        <div ref="chartRef" style="width: 100%; height: 300px"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, markRaw, watch } from "vue";
import * as echarts from "echarts";
import type { ECharts } from "echarts";

interface Props {
  index: number;
}
const props = defineProps<Props>();

const chartRef = ref<HTMLElement>();
const chart = ref<ECharts>();

const option = {
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [
        120,
        { value: 200, itemStyle: { color: "#a90000" } },
        150,
        351,
        49,
        70,
        110,
        190,
        130,
      ],
      type: "bar",
    },
  ],
};

onMounted(() => {
  if (chartRef.value) {
    chart.value = markRaw(echarts.init(chartRef.value));
  }
  chart.value?.setOption(option);
});

watch(props, (val) => {
  if (val.index === 2) {
    const timer = setTimeout(() => {
      chart.value?.clear();
      chart.value?.setOption(option);
      clearTimeout(timer);
    }, 300);
  }
});
</script>

<style scoped lang="scss">
.page3 {
  background-color: cadetblue;
  background-image: url("@/assets/report/bg03.png");
  background-size: cover;
  background-position: center;
  .bg-star {
    position: absolute;
    width: 100%;
    height: 100%;
    color: rgb(103, 103, 103);
    box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 0px;
    animation: 1s ease 0s 1 normal both running puffIn;
    img {
      opacity: 0.5;
    }
  }

  .content {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .text-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
    }
  }
}

@keyframes puffIn {
  0% {
    opacity: 0;
    transform-origin: 50% 50%;
    transform: scale(2);
  }

  to {
    opacity: 1;
    transform-origin: 50% 50%;
    transform: scale(1);
  }
}
</style>
