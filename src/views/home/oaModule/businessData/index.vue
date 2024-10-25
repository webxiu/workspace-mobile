<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-06-23 09:56:53 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-06-23 09:56:53 
 */ -->
<template>
  <div class="business-data">
    <van-search readonly clickable size="large" id="business-search" placeholder="请选择日期" v-model="timeValue" @click="show"></van-search>
    <van-popup v-model:show="isOpen" position="bottom">
      <van-date-picker
        v-model="currentDate"
        type="year-month"
        title="选择年月"
        @confirm="onConfirm"
        @cancel="isOpen = false"
        :columns-type="['year', 'month']"
      />
    </van-popup>
    <div ref="chartRef1" class="graph" style="height: 300px"></div>
    <div ref="chartRef2" class="graph" style="height: 300px"></div>
    <div ref="chartRef3" class="graph" style="height: 300px"></div>
    <div ref="chartRef4" class="graph" style="height: 600px"></div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import type { ECharts } from "echarts";
import { getDateTime } from "@/utils/common";
import { getSaleokratedata } from "@/api/oaModule";
import { onMounted, ref, reactive, markRaw } from "vue";
import { showLoadingToast, closeToast, showToast } from "vant";
import { option_1, option_2, option_3, option_4 } from "./config";

const { year, month, dateTime } = getDateTime();
const isOpen = ref<boolean>(false);
const currentDate = ref<string[]>([]);
const timeValue = ref<string>(`${year}年${month}月`);
const querParams = reactive({
  year: year,
  month: month,
  time: dateTime,
  starttime: `${year}-01-01`
});

const chartRef1 = ref<HTMLElement>();
const chartRef2 = ref<HTMLElement>();
const chartRef3 = ref<HTMLElement>();
const chartRef4 = ref<HTMLElement>();
const EInstance1 = ref<ECharts>();
const EInstance2 = ref<ECharts>();
const EInstance3 = ref<ECharts>();
const EInstance4 = ref<ECharts>();

onMounted(() => {
  currentDate.value = [`${year}`, month];
  chartRef1.value && (EInstance1.value = markRaw(echarts.init(chartRef1.value)));
  chartRef2.value && (EInstance2.value = markRaw(echarts.init(chartRef2.value)));
  chartRef3.value && (EInstance3.value = markRaw(echarts.init(chartRef3.value)));
  chartRef4.value && (EInstance4.value = markRaw(echarts.init(chartRef4.value)));
  getData();
});

const show = () => {
  isOpen.value = true;
};

const onConfirm = ({ selectedValues }) => {
  isOpen.value = false;
  const curYear = new Date().getFullYear().toString();
  const selectYear = selectedValues[0];
  const { year, lastDate, dateTime } = getDateTime(selectYear);
  const endTime = selectYear < curYear ? lastDate : dateTime;

  currentDate.value = selectedValues;
  querParams.time = endTime;
  querParams.starttime = `${year}-01-01`;
  querParams.year = selectedValues[0];
  querParams.month = selectedValues[1];
  timeValue.value = `${selectedValues[0]}年${selectedValues[1]}月`;

  getData();
};

const getData = async () => {
  try {
    let { year, month } = querParams;
    showLoadingToast("加载中...");
    const res = await getSaleokratedata(querParams);
    if (!res.data) throw (res as any).message;
    const data1 = res.data.saleokratedata;
    const data2 = res.data.productioninstockdetail;
    const data3 = res.data.complaintlistTomanagerdate;
    const data4 = res.data.staffinfodate;
    closeToast();

    //销售数据
    const option = option_1({ data: data1, year, month });
    EInstance1.value?.setOption(option);
    //生产数据
    const option2 = option_2({ data: data2, year, month });
    EInstance2.value?.setOption(option2);
    //客户投诉
    const option3 = option_3({ data: data3, year, month });
    EInstance3.value?.setOption(option3);
    //人力资源
    const option4 = option_4({ data: data4, year, month });
    EInstance4.value?.setOption(option4);
  } catch (error) {
    const timer = setTimeout(() => {
      closeToast();
      clearTimeout(timer);
    }, 2000);
    showToast({ message: "数据获取失败", position: "top" });
  }
};
</script>

<style lang="scss" scoped>
.business-data {
  padding: 0 20px;
  .graph {
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 40px;
    box-shadow: 0 0 4px 0 #ccc;
  }
  :deep(.van-search) {
    padding: 56px 24px;
    background-color: #fff;
  }
  :deep(#business-search) {
    text-align: center;
    font-size: 48px;
    color: #ff0000;
  }
  :deep(.van-icon-search) {
    display: block;
    font-size: 64px;
  }
}
</style>
