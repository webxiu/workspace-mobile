<template>
  <div class="ui-h-100 flex-col">
    <div class="ui-ta-c fw-700 p-30 color-111">{{ navTitle }}</div>
    <van-form class="flex-1 ui-ovy-a">
      <van-row
        :key="idx"
        v-for="(item, idx) in dataList"
        type="flex"
        class="mt-28 fz-28"
      >
        <van-col span="10" class="ui-ta-r fw-700 color-666">
          {{ item.label }}
        </van-col>
        <van-col span="14" class="ui-ta-l pl-28 fw-700 color-111">
          {{ item.value }}
        </van-col>
      </van-row>
    </van-form>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { statusObj } from "../config";

const columnObj = {
  userCode: "编号",
  productionGroup: "组别",
  status: "状态",
  staffName: "姓名",
  beOnDuty: "应出勤(H)",
  actualAttendance: "实际出勤(H)",
  annualLeaveTerms: "年假(H)",
  beLateTime: "迟到时间(M)",
  earlyTime: "早退时间(M)",
  absenteeismTime: "旷工时间(H)",
  thingLeaveTime: "事假(H)",
  peacetimeOverTime: "平时加班时间(H)",
  beAttendanceDay: "应出勤(天)",
  actualAttendanceDay: "实际出勤(天)",
  restOverTime: "休息加班时间(H)",
  specialOverTime: "特殊加班(H)",
  overTimeSum: "加班汇总(H)",
  yearMonthTime: "时间",
  description: "备注",
  // signature: "签名",
};

defineProps({
  detailData: { type: Array, default: () => [] },
});

const navTitle = ref<string>("");
const dataList = ref<Array<{ label: string; value: any }>>([]);

const initData = (data: Array<Record<string, any>>) => {
  navTitle.value = `${data[0].yearMonthTime}考勤明细`;
  data.forEach((item) => {
    for (const k in columnObj) {
      const value = k === "status" ? statusObj[item[k]]?.title : item[k];
      if (columnObj[k]) dataList.value.push({ label: columnObj[k], value });
    }
  });
};

defineExpose({ initData });
</script>
<style lang="scss" scoped></style>
