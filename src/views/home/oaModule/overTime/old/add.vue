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
          v-model="userName"
          name="userName"
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
          placeholder="请选择加班类型"
          readonly
          @click="showTypePicker = true"
          :rules="[{ required: true, message: '加班类型不能为空' }]"
        />
        <van-popup v-model:show="showTypePicker" position="bottom">
          <van-picker
            :columns="typeColumns"
            @confirm="onTypeConfirm"
            @cancel="showTypePicker = false"
          />
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
          label="开始日期"
          @blur="lastBlur"
          placeholder="请选择开始日期"
          readonly
          @click="showStartDate = true"
          :rules="[{ required: true, message: '开始日期不能为空' }]"
        />
        <van-popup v-model:show="showStartDate" position="bottom">
          <van-date-picker
            @confirm="onStartDateConfirm"
            @cancel="showStartDate = false"
          />
        </van-popup>

        <!-- 开始时间 -->
        <van-field
          v-model="startTime"
          name="startTime"
          label="开始时间"
          placeholder="请选择开始时间"
          readonly
          @blur="lastBlur"
          @click="showStartTime = true"
          :rules="[{ required: true, message: '开始时间不能为空' }]"
        />
        <van-popup v-model:show="showStartTime" position="bottom">
          <van-time-picker
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
          @blur="lastBlur"
          readonly
          placeholder="请选择结束日期"
          @click="showEndDate = true"
          :rules="[{ required: true, message: '结束日期不能为空' }]"
        />
        <van-popup v-model:show="showEndDate" position="bottom">
          <van-date-picker
            @confirm="onEndDateConfirm"
            @cancel="showEndDate = false"
          />
        </van-popup>

        <!-- 结束时间 -->
        <van-field
          v-model="endTime"
          name="endTime"
          label="结束时间"
          placeholder="请选择结束时间"
          readonly
          @click="showEndTime = true"
          @blur="lastBlur"
          :rules="[{ required: true, message: '结束时间不能为空' }]"
        />
        <van-popup v-model:show="showEndTime" position="bottom">
          <van-time-picker
            @confirm="onEndTimeConfirm"
            @cancel="showEndTime = false"
            :columns-type="['hour', 'minute']"
            title="时分"
          />
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
        <van-field
          v-model="hours"
          name="hours"
          label="加班时长"
          readonly
          placeholder="请填写时长"
          :rules="[{ required: true, message: '加班时长不能为空' }]"
        />
      </van-cell-group>

      <!-- 保存按钮 -->
      <div style="margin: 30px">
        <van-button round block type="primary" native-type="submit">
          {{ route.query.id ? "修改" : "新增" }}
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { showNotify } from "vant";
import { useRoute, useRouter } from "vue-router";

import {
  addOverTimeList,
  calcJBTimes,
  getOverTimeDetail,
  editOverTimeList,
} from "@/api/oaModule";
import { queryUserInfo } from "@/api/user";
import { useUserStore } from "@/store/modules/user";
import { useAppStore } from "@/store/modules/app";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const userName = ref(""); // 加班人
const overtimeType = ref(""); // 加班类型
const remark = ref(""); // 加班缘由
const startDate = ref(""); // 开始日期
const startTime = ref(""); // 开始时间
const endDate = ref(""); // 结束日期
const endTime = ref(""); // 结束时间
const days = ref("0"); // 加班天数
const hours = ref("0"); // 加班时长

const showStartDate = ref(false);
const showStartTime = ref(false);
const showEndDate = ref(false);
const showEndTime = ref(false);
const showTypePicker = ref(false);

// 加班类型配置
const typeColumns = [
  { text: "工作日加班", value: "工作日加班" },
  { text: "周末加班", value: "周末加班" },
  { text: "节日加班", value: "节日加班" },
];

watch([startDate, startTime, endDate, endTime], () => {
  if (isFullTimeValue.value) {
    setCalcTimes();
  }
});

const isFullTimeValue = computed(() => {
  return startDate.value && startTime.value && endDate.value && endTime.value
    ? true
    : false;
});

const lastBlur = () => {
  // 只有开始日期时间和结束日期时间都有值才发起请求
  const alreadyAccess =
    startDate.value && startTime.value && endDate.value && endTime.value;

  if (alreadyAccess) setCalcTimes();
};

// 表单提交事件
const onSubmit = (values) => {
  // 如果是编辑则调用编辑接口然后返回
  if (route.query.id && route.query.mode === "edit") {
    const editConfig = {
      ...values,
      id: route.query.id,
      days: +values.days,
      hours: +values.hours,
      userId: userStore.userInfo.userCode,
      itemSequence: 1,
      createUserId: userStore.userInfo.userCode,
      operationType: 1,
      overtimeType: overtimeType.value,
    };
    editOverTimeList(editConfig).then((res) => {
      if (res.status === 200 && res.data) {
        showNotify({ type: "success", message: (res as any).message });
        setTimeout(
          () => router.push("/oa/overTime/" + "" + route.query.id),
          100
        );
      } else showNotify({ type: "danger", message: (res as any).message });
    });
    return;
  }

  addOverTimeList({
    ...values,
    days: +values.days,
    hours: +values.hours,
    userId: userStore.userInfo.userCode,
    itemSequence: 1,
    createUserId: userStore.userInfo.userCode,
    operationType: 1,
  }).then((res) => {
    if (res.status === 200 && res.data) {
      showNotify({ type: "success", message: (res as any).message });
      setTimeout(() => router.push("/oa/overTime"), 100);
    } else showNotify({ type: "danger", message: (res as any).message });
  });
};

const onStartDateConfirm = ({ selectedValues }) => {
  startDate.value = selectedValues.join("-");
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
};

// 计算出加班时长和天数并且设置表单值
const setCalcTimes = () => {
  calcJBTimes({
    userId: userStore.userInfo.userCode,
    startDate: startDate.value,
    startTime: startTime.value,
    endDate: endDate.value,
    endTime: endTime.value,
    overtimeType: overtimeType.value,
  }).then((res) => {
    if (res.data) {
      days.value = res.data.days;
      hours.value = res.data.hours;
    }
  });
};

// 编辑页面获取数据
const getEditInfo = () => {
  getOverTimeDetail({ id: route.query.id }).then((res) => {
    // 初始化表单的值
    userName.value = res.data.userName;
    overtimeType.value = res.data.overtimeType;
    remark.value = res.data.remark;
    startDate.value = res.data.startDate;
    startTime.value = res.data.startTime;
    endDate.value = res.data.endDate;
    endTime.value = res.data.endTime;
    days.value = res.data.days;
    hours.value = res.data.hours;
  });
};

onMounted(() => {
  queryUserInfo({}).then((res) => {
    userName.value = res.data.userName;
  });

  if (route.query.id && route.query.mode === "edit") {
    getEditInfo();
    useAppStore().setNavTitle("新增加班单");
  } else useAppStore().setNavTitle("编辑加班单");
});
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

    .des {
      color: #969799;
      font-size: 12px;
    }

    :deep(.van-divider) {
      color: black;
      font-weight: 500;
    }
  }
}
</style>
