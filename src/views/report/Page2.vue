<template>
  <div class="section page2">
    <div class="bg-star">
      <img src="@/assets/report/page1_star.gif" />
    </div>
    <div class="content">
      <div class="text-wrap flex-1 ui-w-100">
        <div ref="chartRef" style="width: 600px; height: 300px"></div>
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
  // legend: {
  //     top: 'bottom'
  // },
  title: {
    text: "2023年产品发货占比",
    subtext: "数据来源：海外销售",
    left: "center",
  },
  // toolbox: {
  //     show: true,
  //     feature: {
  //         mark: {show: true},
  //         dataView: {show: true, readOnly: false},
  //         restore: {show: true},
  //         saveAsImage: {show: true}
  //     }
  // },
  series: [
    {
      name: "销售比例",
      type: "pie",
      radius: [20, 80],
      // center: ['25%', '25%'],
      roseType: "area",
      itemStyle: {
        borderRadius: 5,
      },
      data: [
        { value: 0.4146, name: "直发器:41.46%" },
        { value: 0.27, name: "卷发器:27%" },
        { value: 0.2254, name: "玉米烫:22.54%" },
        { value: 0.0874, name: "烤盘:8.74%" },
        { value: 0.026, name: "美容仪:0.26%" },
        { value: 0.2296, name: "吹风机:22.96%" },
      ],
    },
  ],
};

watch(props, (val) => {
  if (val.index === 1) {
    const timer = setTimeout(() => {
      chart.value?.clear();
      chart.value?.setOption(option);
      clearTimeout(timer);
    }, 300);
  }
});

onMounted(() => {
  if (chartRef.value) {
    chart.value = markRaw(echarts.init(chartRef.value));
  }
  chart.value?.setOption(option);
});
</script>

<style scoped lang="scss">
.page2 {
  background-color: cadetblue;
  background-image: url("@/assets/report/bg02.png");
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
