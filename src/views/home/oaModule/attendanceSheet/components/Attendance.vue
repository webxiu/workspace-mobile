<template>
  <div class="flex-col flex-1 ui-ov-h">
    <div class="ui-ta-c fw-700 p-30 color-111">{{ navTitle }}</div>
    <van-form class="flex-1 ui-ovy-a">
      <van-row :key="idx" v-for="(item, idx) in dataList" type="flex" class="mt-28 fz-28">
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
import { getSignature } from "@/api/oaModule";
import { useRoute } from "vue-router";

interface columnObjType {
  staffCode: string;
  productionGroup?: string;
  status: string;
  staffName: string;
  idCard: string;
  beAttendanceDay?: string;
  actualAttendanceDay?: string;
  beOnDuty?: string;
  actualAttendance?: string;
  annualLeaveTerms: string;
  beLateTime: string;
  earlyTime: string;
  absenteeismTime: string;
  thingLeaveTime: string;
  peacetimeOverTime?: string;
  restOverTime?: string;
  specialOverTime?: string;
  overTimeSum?: string;
  absentCount: string;
  yearMonthTime: string;
  description: string;
  deptName: string;
  signTime?: string;
}

const columnObj: columnObjType = {
  staffCode: "工号",
  staffName: "姓名",
  idCard: "身份证号",
  deptName: "部门",
  productionGroup: "组别",
  status: "状态",
  signTime: "签名时间",
  beOnDuty: "应出勤(H)",
  actualAttendance: "实际出勤(H)",
  beAttendanceDay: "应出勤(天)",
  actualAttendanceDay: "实际出勤(天)",
  thingLeaveTime: "事假(H)",
  annualLeaveTerms: "年假(H)",
  beLateTime: "迟到时间(M)",
  earlyTime: "早退时间(M)",
  absenteeismTime: "旷工时间(H)",
  absentCount: "缺卡次数",
  peacetimeOverTime: "平时加班时间(H)",
  restOverTime: "周末加班时间(H)",
  specialOverTime: "特殊加班(H)",
  overTimeSum: "加班汇总(H)",
  yearMonthTime: "考勤年月",
  description: "备注"
  // signature: "签名",
};

const route = useRoute();
const signDate = ref("");

const navTitle = ref<string>("");
const dataList = ref<Array<{ label: string; value: any }>>([]);
const initData = (data: Array<Record<string, any>>) => {
  if (data[0]["employeKind"] === "职员") {
    delete columnObj.beOnDuty;
    delete columnObj.actualAttendance;
    delete columnObj.specialOverTime;
    delete columnObj.productionGroup;
    // delete columnObj.peacetimeOverTime;
    // delete columnObj.restOverTime;
    delete columnObj.overTimeSum;
  } else {
    delete columnObj.beAttendanceDay;
    delete columnObj.actualAttendanceDay;
  }
  navTitle.value = `${data[0].yearMonthTime}考勤明细`;
  data.forEach((item) => {
    for (const k in columnObj) {
      const value = k === "status" ? statusObj[item[k]]?.title : item[k];
      if (k === "signTime") {
        getSignature({ detailId: route.params.id }).then(({ data }) => {
          if (data) {
            signDate.value = data.signTime;
            const insertPos = dataList.value.findIndex((el) => el.label === "状态");
            if (insertPos >= 0) {
              dataList.value.splice(insertPos + 1, 0, { label: columnObj["signTime"]!, value: item.signTime });
            }
          }
        });
      } else {
        if (columnObj[k]) dataList.value.push({ label: columnObj[k], value });
      }
    }
  });
};

defineExpose({ initData });
</script>
<style lang="scss" scoped></style>
