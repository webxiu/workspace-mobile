<template>
  <div class="form-content">
    <van-notice-bar
      style="font-size: 12px"
      color="#1989fa"
      background="#ecf9ff"
      :speed="30"
      left-icon="volume-o"
      text="加班人、加班天数、加班时长，三个无需录入，由系统自动生成！"
    />
    <van-form @submit="onSubmit">
      <!-- 加班类型组 -->
      <van-divider>加班类型</van-divider>
      <van-cell-group inset>
        <!-- 加班人 -->
        <van-field
          v-model="staffName"
          name="staffName"
          readonly
          label="加班人"
          placeholder="请填写加班人姓名"
          :rules="[{ required: true, message: '加班人姓名不能为空' }]"
        />

        <!-- 加班类型 -->
        <van-field
          v-model="overtimeType"
          name="overtimeType"
          label="加班类型"
          readonly
          placeholder="请选择加班类型"
          @click="showTypePicker = true"
          :rules="[{ required: true, message: '加班类型不能为空' }]"
        />
        <van-popup v-model:show="showTypePicker" position="bottom">
          <van-picker :columns="typeColumns" @confirm="onTypeConfirm" @cancel="showTypePicker = false" />
        </van-popup>

        <!-- 加班缘由 -->
        <van-field
          v-model="remark"
          name="remark"
          rows="2"
          autosize
          label="加班缘由"
          type="textarea"
          maxlength="100"
          placeholder="请输入加班缘由"
          :rules="[{ required: true, message: '加班缘由不能为空' }]"
          show-word-limit
        />
      </van-cell-group>

      <!-- 加班日期组 -->
      <van-divider>加班日期</van-divider>
      <van-cell-group inset>
        <!-- 开始日期 -->
        <van-field
          v-model="startDate"
          name="startDate"
          readonly
          label="开始日期"
          placeholder="请选择开始日期"
          @click="showStartDate = true"
          :rules="[{ required: true, message: '开始日期不能为空' }]"
        />
        <van-popup v-model:show="showStartDate" position="bottom">
          <van-date-picker v-model="startDateArr" @confirm="onStartDateConfirm" @cancel="showStartDate = false" />
        </van-popup>

        <!-- 开始时间 -->
        <van-field
          v-model="startTime"
          name="startTime"
          label="开始时间"
          readonly
          placeholder="请选择开始时间"
          @click="showStartTime = true"
          :rules="[{ required: true, message: '开始时间不能为空' }]"
        />
        <van-popup v-model:show="showStartTime" position="bottom">
          <van-time-picker
            v-model="startTimeArr"
            @confirm="onStartTimeConfirm"
            title="时分"
            @cancel="showStartTime = false"
            :columns-type="['hour', 'minute']"
          />
        </van-popup>

        <!-- 结束日期 -->
        <van-field
          v-model="endDate"
          name="endDate"
          label="结束日期"
          readonly
          placeholder="请选择结束日期"
          @click="showEndDate = true"
          :rules="[{ required: true, message: '结束日期不能为空' }]"
        />
        <van-popup v-model:show="showEndDate" position="bottom">
          <van-date-picker :filter="filterEndDate" v-model="endDateArr" @confirm="onEndDateConfirm" @cancel="showEndDate = false" />
        </van-popup>

        <!-- 结束时间 -->
        <van-field
          v-model="endTime"
          name="endTime"
          label="结束时间"
          readonly
          placeholder="请选择结束时间"
          @click="showEndTime = true"
          :rules="[{ required: true, message: '结束时间不能为空' }]"
        />
        <van-popup v-model:show="showEndTime" position="bottom">
          <van-time-picker v-model="endTimeArr" @confirm="onEndTimeConfirm" @cancel="showEndTime = false" :columns-type="['hour', 'minute']" title="时分" />
        </van-popup>

        <!-- 加班天数 -->
        <van-field
          v-model="days"
          name="days"
          label="加班天数"
          readonly
          placeholder="请填写加班天数"
          :rules="[{ required: true, message: '加班天数不能为空' }]"
        />

        <!-- 加班时长 -->
        <van-field v-model="hours" name="hours" label="加班时长" readonly placeholder="请填写时长" :rules="[{ required: true, message: '加班时长不能为空' }]" />
      </van-cell-group>

      <!-- 保存按钮 -->
      <div style="margin: 30px">
        <van-button round block type="primary" native-type="submit" :loading="loading"> 保存 </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { PickerOption, closeToast, showConfirmDialog, showLoadingToast, showNotify, showToast } from "vant";

import {
  addOverTimeList,
  getOverTimeDetail,
  editOverTimeList,
  fetchUserDocData,
  fetchDetailData,
  timeSettingList,
  fetchEnumList,
  calcJBTimes,
  calcOverTimes,
  insertOverTime,
  updateOverTime
} from "@/api/oaModule";
import { queryStaffUserInfo, queryUserInfo } from "@/api/user";
import { useUserStore } from "@/store/modules/user";
import { useAppStore } from "@/store/modules/app";
import dayjs from "dayjs";
import { commonSubmit } from "@/api/common";

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

defineOptions({
  name: "OverTimeAdd"
});

const staffName = ref(""); // 加班人
const overtimeType = ref(""); // 加班类型
const remark = ref(""); // 加班缘由
const startDate = ref(dayjs().format("YYYY-MM-DD")); // 开始日期
const startTime = ref(""); // 开始时间
const endDate = ref(dayjs().format("YYYY-MM-DD")); // 结束日期
const endTime = ref(""); // 结束时间
const days = ref("0"); // 加班天数
const hours = ref("0"); // 加班时长
const staffCode = ref("");
const loading = ref(false);
const transStaffId = ref("");

const showStartDate = ref(false);
const addResId = ref("");
const showStartTime = ref(false);
const showEndDate = ref(false);
const showEndTime = ref(false);
const showTypePicker = ref(false);

const startTimeArr = computed(() => {
  return startTime.value?.split(":");
});

const startDateArr = computed(() => {
  return startDate.value ? startDate.value.split("-") : dayjs(new Date()).format("YYYY-MM-DD").split("-");
});

const endDateArr = computed(() => {
  return endDate.value ? endDate.value.split("-") : dayjs(new Date()).format("YYYY-MM-DD").split("-");
});

const endTimeArr = computed(() => {
  return endTime.value?.split(":");
});

const filterEndDate = (type: string, options: PickerOption[]): PickerOption[] => {
  if (startDate.value) {
    const [year] = startDate.value.split("-");
    if (type === "year") {
      return options.filter((option) => Number(option.value) >= +year);
    }
  }
  return options;
};

// 加班类型配置
const typeColumns = ref([]);

onMounted(() => {
  if (route.query.id && route.query.mode === "edit") {
    useAppStore().setNavTitle("编辑加班单");
  } else useAppStore().setNavTitle("新增加班单");

  // 获取加班类型
  fetchEnumList({ optioncode: "OvertimeType" }).then((res) => {
    if (res.data) {
      const resDataInfo =
        res.data
          .find((item) => item.optionCode === "OvertimeType")
          ?.optionList?.map((item) => ({
            text: item.optionName,
            value: item.optionValue
          })) || [];
      typeColumns.value = resDataInfo;
    }
  });

  queryStaffUserInfo({
    page: 1,
    limit: 30,
    staffId: userStore.getUserInfo.userCode,
    state: "在职",
    deptIdList: [userStore.getUserInfo.deptId]
  }).then((res) => {
    if (res.data) {
      const result = res.data.records[0] || {};
      console.log(result, " result=====");
      staffName.value = result.staffName;
      staffCode.value = result.staffId;
      transStaffId.value = result.id;
    }
  });
});

onBeforeRouteLeave(() => {
  // 清除操作
  if (route.query.id && route.query.mode === "edit") return;
  clearFormData();
});

watch([startDate, startTime, endDate, endTime], () => {
  if (isFullTimeValue.value) {
    setCalcTimes();
  }
});

// 过滤日期选项
const filterTime = (type: string, options: PickerOption[]) => {
  if (type === "minute") {
    return options.filter((option) => Number(option.value) % 15 === 0);
  }
  return options;
};

const filterEndTime = (type: string, options: PickerOption[]) => {
  if (type === "hour") {
    const endTimeHour = startTime.value.split(":")[0];
    return options.filter((option) => Number(option.value) >= +endTimeHour);
  }

  if (type === "minute") {
    return options.filter((option) => Number(option.value) % 15 === 0);
  }
  return options;
};

const clearFormData = () => {
  // 清除操作
  overtimeType.value = "";
  remark.value = "";
  startDate.value = "";
  startTime.value = "";
  endTime.value = "";
  endDate.value = "";
  days.value = "0";
  hours.value = "0";
};

// 表单提交事件
const onSubmit = (values) => {
  const isPass = dayjs(startDate.value).isBefore(dayjs(endDate.value)) || startDate.value === endDate.value;
  if (!isPass) {
    showToast({ message: "开始日期必须早于结束日期", duration: 3000 });
    return;
  }
  //校验时长是否为30分钟的整数倍
  if (values.hours) {
    if (values.hours % 0.5 !== 0 || values.hours == 0) {
      showToast({ message: "加班时长必须为30分钟的整数倍", duration: 3000 });
      return;
    }
  }

  loading.value = true;

  const overTimeReqParam = {
    deptId: userStore.userInfo.deptId,
    operationType: 2,
    overTimeApplyDTOList: [
      {
        staffCode: staffCode.value,
        deptId: userStore.userInfo.deptId,
        staffId: transStaffId.value,
        staffName: staffName.value,
        productLine: null,
        remark: remark.value,
        overtimeType: overtimeType.value,
        startDate: startDate.value,
        startTime: startTime.value,
        endDate: endDate.value,
        endTime: endTime.value,
        days: days.value,
        id: route.query.id,
        hours: hours.value
      }
    ]
  };

  // 如果是编辑则调用编辑接口然后返回
  if (route.query.id && route.query.mode === "edit") {
    const editConfig = {
      ...values,
      id: route.query.id,
      days: +values.days,
      hours: +values.hours,
      staffCode: userStore.userInfo.userCode || staffCode.value,
      itemSequence: 1,
      createUserId: userStore.userInfo.userCode || staffCode.value,
      operationType: 1
    };
    updateOverTime(overTimeReqParam)
      .then((res) => {
        if (res.status === 200 && res.data) {
          // 清除操作
          clearFormData();
          showNotify({ type: "success", message: (res as any).message });
          setTimeout(() => router.push("/oa/overTime"), 100);
        }
        loading.value = false;
      })
      .catch((err) => {
        loading.value = false;
      })
      .finally(() => (loading.value = false));
    return;
  }

  const beforeClose = (action): Promise<boolean> => {
    return new Promise((resolve) => {
      if (action === "cancel") {
        resolve(true);
        router.push(`/oa/overTime/${addResId.value}`);
      }
      setTimeout(() => {
        if (action === "confirm") {
          commonSubmit({ billNo: addResId.value, billId: "10001" }).then((res) => {
            if (res.data) {
              showToast({ message: "提交成功", type: "success" });
              // 清除操作
              clearFormData();
              setTimeout(() => {
                router.push("/oa/overTime");
              }, 100);
            }
          });
          resolve(true);
        }
      }, 1000);
    });
  };

  console.log(overTimeReqParam, "overTimeReqParam===");

  insertOverTime(overTimeReqParam).then((res) => {
    if (res.data) {
      showToast({ message: "保存成功", type: "success" });
      setTimeout(() => {
        router.push("/oa/overTime");
      }, 1000);
    }
  });

  // addOverTimeList({
  //   ...values,
  //   days: +values.days,
  //   hours: +values.hours,
  //   staffCode: userStore.userInfo.userCode || staffCode.value,
  //   itemSequence: 1,
  //   createUserId: userStore.userInfo.userCode || staffCode.value,
  //   operationType: 1
  // })
  //   .then((res) => {
  //     if (res.status === 200 && res.data) {
  //       addResId.value = res.data;

  //       showConfirmDialog({
  //         title: "提示",
  //         message: "保存成功，是否提交？",
  //         beforeClose
  //       });
  //     }
  //     loading.value = false;
  //   })
  //   .catch((err) => {
  //     loading.value = false;
  //   })
  //   .finally(() => (loading.value = false));
};

const onStartDateConfirm = ({ selectedValues }) => {
  startDate.value = selectedValues.join("-");
  endDate.value = selectedValues.join("-");
  showStartDate.value = false;
};

const onEndTimeConfirm = ({ selectedValues }) => {
  endTime.value = selectedValues.join(":");
  showEndTime.value = false;
};

const onEndDateConfirm = ({ selectedValues }) => {
  endDate.value = selectedValues.join("-");
  showEndDate.value = false;
};

const onStartTimeConfirm = ({ selectedValues }) => {
  startTime.value = selectedValues.join(":");
  showStartTime.value = false;
};

const onTypeConfirm = ({ selectedOptions }) => {
  overtimeType.value = selectedOptions[0]?.text;
  showTypePicker.value = false;
  console.log(overtimeType.value, "overtimeType.value===");

  const dynamicTime = {
    周末加班: { startTime: "08:00", endTime: "22:00" },
    节日加班: { startTime: "08:00", endTime: "22:00" },
    工作日加班: { startTime: "18:00", endTime: "22:00" }
  };

  startTime.value = dynamicTime[overtimeType.value]?.startTime;
  endTime.value = dynamicTime[overtimeType.value]?.endTime;
};

const isFullTimeValue = computed(() => {
  return startDate.value && startTime.value && endDate.value && endTime.value ? true : false;
});

// 计算出加班时长和天数并且设置表单值
const setCalcTimes = () => {
  const id = route.query.id || "";

  if (overtimeType.value) {
    const calcTimeParams = {
      staffCode: userStore.userInfo.userCode || staffCode.value,
      startDate: startDate.value,
      startTime: startTime.value,
      endDate: endDate.value,
      endTime: endTime.value,
      overtimeType: overtimeType.value
    };
    if (id) calcTimeParams["id"] = id;

    calcOverTimes({ overTimeApplyDTOList: [calcTimeParams] })
      .then((res) => {
        if (res.data) {
          days.value = res.data[0]?.days;
          hours.value = res.data[0]?.hours;
        } else {
          showNotify({ type: "danger", message: "错误" });
        }
      })
      .catch(console.log);
  }
};

// 编辑页面获取数据
const getEditInfo = () => {
  showLoadingToast("查询中");
  getOverTimeDetail({ id: route.query.id })
    .then((res) => {
      if (res.data) {
        // 初始化表单的值
        staffName.value = res.data.staffName;
        overtimeType.value = res.data.overtimeType;
        remark.value = res.data.remark;
        startDate.value = res.data.startDate;
        startTime.value = res.data.startTime;
        endDate.value = res.data.endDate;
        endTime.value = res.data.endTime;
        days.value = res.data.days;
        hours.value = res.data.hours;
      }
    })
    .finally(() => closeToast());
};

watch(
  route,
  (newVal) => {
    if (newVal.query?.id && newVal.query?.mode === "edit") {
      getEditInfo();
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.form-content {
  padding-bottom: 32px;

  .popup-scroll {
    height: 50vh;

    .scroll-item {
      padding: 0 30px 15px;
      text-align: justify;
    }

    .close-icon {
      text-align: right;
      font-size: 40px;
      margin: 18px 24px 0 0;
    }

    .line-text {
      font-size: 34px;
    }
    .des {
      color: #969799;
      font-size: 26px;
      z-index: 3000;
    }

    :deep(.van-divider) {
      color: black;
      font-weight: 500;
    }
  }
}
</style>
