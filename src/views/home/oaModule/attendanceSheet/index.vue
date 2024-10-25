<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-06-23 09:56:41 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-06-23 09:56:41 
 */ -->
<script lang="ts" setup>
import { showToast } from "vant";
import { useRoute, useRouter } from "vue-router";
import { useAxios } from "@/hooks/useAxios";
import { statusObj } from "./config";
import { reactive, ref, onMounted, watch } from "vue";
import { getAttendanceSheet, getAttendanceSheetYear } from "@/api/oaModule";

interface AttendanceSheetItemType {
  id: number;
  userCode: string;
  staffName: string;
  yearMonthTime: string;
  status: string;
}

const router = useRouter();
const route = useRoute();
const attendanceList = ref<AttendanceSheetItemType[]>([]);
const yearList = ref<Array<{ text: string; value: string }>>([]);
const queryParams = reactive({ date: "", status: "" });

onMounted(() => getYearList());

const onLoad = (data) => {
  if (data) attendanceList.value = data.data;
};
const onRefresh = () => getData(true);

// 获取列表数据
const { isLoading, getData } = useAxios<
  AttendanceSheetItemType[],
  typeof getAttendanceSheet
>({
  initValue: [],
  api: getAttendanceSheet,
  params: queryParams,
  callback: onLoad,
});

// 获取年份
const getYearList = async () => {
  try {
    const res = await getAttendanceSheetYear({});
    if (res.status !== 200) throw res.data;
    const years = res.data as Array<{ year: string }>;
    let maxYear: string = "1890";
    const yearOptions = years.map(({ year }) => {
      if (maxYear < year) maxYear = year;
      return { text: year, value: year };
    });
    queryParams.date = maxYear;
    yearList.value = [{ text: "全部", value: "" }, ...yearOptions];
  } catch (error) {
    showToast({ message: "获取年份失败", position: "top" });
  }
};

const onJumpDetail = (item: AttendanceSheetItemType) => {
  router.push(
    `/oa/attendanceSheet/${item.id}?userCode=${item.userCode}&yearMonthTime=${item.yearMonthTime}`
  );
};

watch(route, () => onRefresh());
</script>

<template>
  <div class="flex-col ui-h-100">
    <van-sticky>
      <van-dropdown-menu>
        <van-dropdown-item v-model="queryParams.date" :options="yearList" />
      </van-dropdown-menu>
    </van-sticky>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" class="flex-1">
      <van-list
        v-model:loading="isLoading"
        :finished="true"
        finished-text="没有更多了"
        @load="onLoad"
        class="p-16 box-border"
        v-if="attendanceList.length > 0"
      >
        <van-cell
          v-for="(item, index) in attendanceList"
          :key="item.id"
          class="customer-cell"
          @click="onJumpDetail(item)"
        >
          <div class="flex just-between">
            <div class="ui-va-m">
              <span class="custom-index">{{ index + 1 }}</span>
              <span class="ml-8 color-333">
                【{{ item.staffName }} - {{ item.yearMonthTime }}】
              </span>
            </div>
            <van-button
              type="primary"
              size="mini"
              :color="statusObj[item.status]?.color"
            >
              {{ statusObj[item.status]?.title }}
            </van-button>
          </div>
          <div class="flex just-between align-end mt-46">
            <div>
              <van-icon name="underway-o" />
              <span class="ml-8 color-333">
                考勤月份：{{ item.yearMonthTime }}
              </span>
            </div>
            <van-button type="primary" plain size="mini" style="border: none">
              详情<van-icon name="arrow" />
            </van-button>
          </div>
        </van-cell>
      </van-list>
      <van-empty v-else description="暂无数据" />
    </van-pull-refresh>
  </div>
</template>

<style lang="scss" scoped>
.custom-index {
  background: gray;
  color: #fff;
  border-radius: 50%;
  display: inline-block;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  font-size: 24px;
}
.customer-cell {
  margin-top: 20px;
  border: 1px solid #dddee1;
}
:deep(.van-cell__value) {
  text-align: left;
}
</style>
