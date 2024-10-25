<template>
  <div class="form-content">
    <van-form @submit="onSubmit">
      <!-- 请假类型组 -->
      <van-divider>请假类型</van-divider>
      <van-cell-group inset>
        <!-- 请假人 -->
        <van-field
          v-model="userName"
          name="userName"
          readonly
          label="请假人"
          placeholder="请填写请假人姓名"
          :rules="[{ required: true, message: '请假人姓名不能为空' }]"
        />

        <!-- 剩余年休假 -->
        <van-field v-model="freeYearDays" readonly label="剩余年休假" />

        <!-- 请假类型 -->
        <van-field
          v-model="holidayType"
          name="holidayType"
          label="请假类型"
          readonly
          placeholder="请选择请假类型"
          @click="showTypePicker = true"
          :rules="[{ required: true, message: '请假类型不能为空' }]"
        />
        <van-popup v-model:show="showTypePicker" position="bottom">
          <van-picker :columns="typeColumns" @confirm="onTypeConfirm" @cancel="showTypePicker = false" />
        </van-popup>

        <!-- 请假缘由 -->
        <van-field
          v-model="remark"
          name="remark"
          rows="2"
          autosize
          label="请假缘由"
          type="textarea"
          maxlength="100"
          placeholder="请输入请假缘由"
          :rules="[{ required: true, message: '请假缘由不能为空' }]"
          show-word-limit
        />
      </van-cell-group>

      <!-- 请假日期组 -->
      <van-divider>请假日期</van-divider>
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
            :min-hour="8"
            v-model="startTimeArr"
            :max-hour="18"
            @confirm="onStartTimeConfirm"
            title="时分"
            :filter="filterTime"
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
          <van-time-picker
            :min-hour="8"
            v-model="endTimeArr"
            :max-hour="18"
            @confirm="onEndTimeConfirm"
            @cancel="showEndTime = false"
            :filter="filterEndTime"
            :columns-type="['hour', 'minute']"
            title="时分"
          />
        </van-popup>

        <!-- 请假天数 -->
        <van-field
          v-model="days"
          name="days"
          label="请假天数"
          readonly
          placeholder="请填写请假天数"
          :rules="[{ required: true, message: '请假天数不能为空' }]"
        />

        <!-- 请假时长 -->
        <van-field v-model="hours" name="hours" label="请假时长" readonly placeholder="请填写时长" :rules="[{ required: true, message: '请假时长不能为空' }]" />

        <!-- 请假说明 -->
        <van-field label="请假说明" is-link @click="showInstruct = true" readonly />
        <!-- 请假说明弹出层 -->
        <van-popup v-model:show="showInstruct" position="bottom">
          <div class="popup-scroll">
            <div class="close-icon">
              <van-icon name="cross" @click="showInstruct = false" />
            </div>
            <div class="scroll-item">
              <van-divider content-position="left">年假</van-divider>
              <div class="des">
                入职满一年到10年内的人员拥有5天年假，满10年以上的人员拥有10天年假，年假可拆分请假；
                人员工作实际满一年后开始休年假，第二年按照12月31日截止休年假，不足一年按比例折扣。 例如2022年3月2日入职，2023-03-02至2023-12-31日可以休年假;
                年假计算公式为: 从入职当天的日期到今年最后一天的时间天数 / 今年的总天数 ,然后向下取整。 条件如下: 1. 入职未满一年没有年假 2.
                入职刚满一年的当年,从入职日期开始到当年年底相差天数/当年总天数,然后向下取整获取天数 如 2022-03-15
                入职的,那么需要到2023-03-15才有年假,假设算2023年的年假就是 03-15 到 2022-12-31 的相差天数 / (2023年总天数) = x.68 天,那么向下取整为 x 天 3.
                入职满一年后续的年假,从01-01开始到年底相差天数 / 当年总天数,然后向下取整 如 第二年从01-01 开始对这位员工进行计算, 即为 01-01 到 2023-12-31
                的相差天数 / 2023年总天数 = x.79 天,那么向下取整为x天
              </div>
            </div>
            <div class="scroll-item">
              <van-divider content-position="left">产假</van-divider>
              <div class="des">
                员工休产假须提出书面休假申请、“准生证”复印件。 员工顺产产假为 178天，难产增加 30 天, 多胞胎每多育一胎增加 15 天；其中产前假均为15
                天；男员工妻子生育的（须提供“ 准生证 ” 复印件），可享受陪产假15 天；如遇公休，节假日不顺延，未休满者按正常出勤对待，不另付薪。
                2.1、违反计划生育政策生育的（如非婚生育、计划外生育的），不享受产假，按事假处理，此期间不支付工资福利待遇，生育费用员工自行承担
              </div>
            </div>
            <div class="scroll-item">
              <van-divider content-position="left">婚假</van-divider>

              <div class="des">
                员工休婚假须提出书面休假申请单和“结婚证”复印件、提供原件验证。 按法定结婚年龄 ( 女 20 周岁，男 22 周岁 ) 结婚的，可享受 3 天婚假；
                婚假均含节假日，必须一次性休完不能累积，婚假期间支付员工基本工资
              </div>
            </div>
            <div class="scroll-item">
              <van-divider content-position="left">丧假</van-divider>
              <div class="des">
                直系亲属丧亡给假 3 天；直系亲属的定义为：父母、配偶、子女; 丧假为带薪假，员工申请丧假，需出示直系亲属关系证明及直系亲属死亡证明复印件
              </div>
            </div>
          </div>
        </van-popup>
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
  addLeaveList,
  calcTimes,
  getLeaveDetail,
  editLeaveList,
  fetchUserDocData,
  fetchDetailData,
  timeSettingList,
  fetchEnumList,
  getPersonInfo
} from "@/api/oaModule";
import { queryUserInfo } from "@/api/user";
import { useUserStore } from "@/store/modules/user";
import { useAppStore } from "@/store/modules/app";
import dayjs from "dayjs";
import { commonSubmit } from "@/api/common";

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

defineOptions({
  name: "LeaveApplyAdd"
});

const userName = ref(""); // 请假人
const holidayType = ref(""); // 请假类型
const remark = ref(""); // 请假缘由
const startDate = ref(dayjs().format("YYYY-MM-DD")); // 开始日期
const startTime = ref(""); // 开始时间
const endDate = ref(dayjs().format("YYYY-MM-DD")); // 结束日期
const endTime = ref(""); // 结束时间
const days = ref("0"); // 请假天数
const hours = ref("0"); // 请假时长
const userId = ref("");
const loading = ref(false);
const freeYearDays = ref("");

const showStartDate = ref(false);
const addResId = ref("");
const showStartTime = ref(false);
const showEndDate = ref(false);
const showEndTime = ref(false);
const showTypePicker = ref(false);
const showInstruct = ref(false);

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

// 请假类型配置
const typeColumns = ref([]);

const getYearDays = () => {
  getPersonInfo({}).then((res) => {
    if (res.data) {
      freeYearDays.value = res.data.annualLeave;
    }
  });
};

onMounted(() => {
  getYearDays();
  if (route.query.id && route.query.mode === "edit") {
    useAppStore().setNavTitle("编辑请假单");
  } else useAppStore().setNavTitle("新增请假单");

  // 获取请假类型
  fetchEnumList({ optioncode: "AskForLeaveType" }).then((res) => {
    if (res.data) {
      const resDataInfo =
        res.data
          .find((item) => item.optionCode === "AskForLeaveType")
          ?.optionList?.map((item) => ({
            text: item.optionName,
            value: item.optionValue
          })) || [];
      typeColumns.value = resDataInfo;
    }
  });

  queryUserInfo({}).then((res) => {
    userName.value = res.data.userName;
    userId.value = res.data.userCode;

    fetchUserDocData({ userCode: res.data.userCode }).then((res: any) => {
      fetchDetailData({ id: res.data[0]?.id }).then((res: any) => {
        const workRuleId = res.data?.workRuleId;
        timeSettingList({ page: 1, limit: 10000 }).then((res: any) => {
          if (res.data && res.data.length) {
            const workTimeInfo = res.data.find((item) => item.id === workRuleId);
            startTime.value = workTimeInfo.forenoonStart;
            endTime.value = workTimeInfo.afternoonEnd;
          }
        });
      });
    });
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
  holidayType.value = "";
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
      showToast({ message: "请假时长必须为30分钟的整数倍", duration: 3000 });
      return;
    }
  }

  loading.value = true;

  // 如果是编辑则调用编辑接口然后返回
  if (route.query.id && route.query.mode === "edit") {
    const editConfig = {
      ...values,
      id: route.query.id,
      days: +values.days,
      hours: +values.hours,
      userId: userStore.userInfo.userCode || userId.value,
      itemSequence: 1,
      createUserId: userStore.userInfo.userCode || userId.value,
      operationType: 1
    };
    editLeaveList(editConfig)
      .then((res) => {
        if (res.status === 200 && res.data) {
          // 清除操作
          clearFormData();
          showNotify({ type: "success", message: (res as any).message });
          setTimeout(() => router.push("/oa/leaveApply"), 100);
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
        router.push(`/oa/leaveApply/${addResId.value}`);
      }
      setTimeout(() => {
        if (action === "confirm") {
          commonSubmit({ billNo: addResId.value, billId: "10001" }).then((res) => {
            if (res.data) {
              showToast({ message: "提交成功", type: "success" });
              // 清除操作
              clearFormData();
              setTimeout(() => {
                router.push("/oa/leaveApply");
              }, 100);
            }
          });
          resolve(true);
        }
      }, 1000);
    });
  };

  addLeaveList({
    ...values,
    days: +values.days,
    hours: +values.hours,
    userId: userStore.userInfo.userCode || userId.value,
    itemSequence: 1,
    createUserId: userStore.userInfo.userCode || userId.value,
    operationType: 1
  })
    .then((res) => {
      if (res.status === 200 && res.data) {
        addResId.value = res.data;

        showConfirmDialog({
          title: "提示",
          message: "保存成功，是否提交？",
          beforeClose
        });
      }
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
    })
    .finally(() => (loading.value = false));
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
  holidayType.value = selectedOptions[0]?.text;
  showTypePicker.value = false;
};

const isFullTimeValue = computed(() => {
  return startDate.value && startTime.value && endDate.value && endTime.value ? true : false;
});

// 计算出请假时长和天数并且设置表单值
const setCalcTimes = () => {
  const id = route.query.id || "";

  const calcTimeParams = {
    userId: userStore.userInfo.userCode || userId.value,
    startDate: startDate.value,
    startTime: startTime.value,
    endDate: endDate.value,
    endTime: endTime.value,
    holidayType: holidayType.value
  };
  if (id) calcTimeParams["id"] = id;
  calcTimes(calcTimeParams)
    .then((res) => {
      if (res.data) {
        days.value = res.data.days;
        hours.value = res.data.hours;
      } else {
        showNotify({ type: "danger", message: "错误" });
      }
    })
    .catch(console.log);
};

// 编辑页面获取数据
const getEditInfo = () => {
  showLoadingToast("查询中");
  getLeaveDetail({ id: route.query.id })
    .then((res) => {
      if (res.data) {
        // 初始化表单的值
        userName.value = res.data.userName;
        holidayType.value = res.data.holidayType;
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
