<template>
  <div class="form-content">
    <van-form @submit="onSubmit" validate-trigger="onSubmit">
      <!-- 请假日期组 -->
      <van-divider>外出申请单</van-divider>
      <van-cell-group inset>
        <!-- 申请人 -->
        <van-field
          v-model="applyUserId"
          name="applyUserId"
          readonly
          label="申请人"
          placeholder="请填写申请人姓名"
          required
          :rules="[{ required: true, message: '申请人姓名不能为空' }]"
        />

        <!-- 目的地 -->
        <van-field
          v-model="destination"
          name="destination"
          label="目的地"
          placeholder="填写应简明扼要，建议10字以内"
          required
          :rules="[{ required: true, message: '目的地不能为空' }]"
        />

        <!-- 同行人 -->
        <van-field
          v-for="(item, idx) in withUsers"
          v-model="withUserDict[item.key]"
          :name="'withUser' + item.key"
          :label="'同行人' + (idx + 1)"
          placeholder="请填写同行人"
          right-icon="delete-o"
          required
          :rules="[{ required: true, message: '同行人不能为空' }]"
          @click-right-icon="(e) => delIconClick(item.key, e)"
        />
        <div style="margin: 10px 10px">
          <van-button size="small" style="width: 100%" plain @click="addWithUser">添加同行人</van-button>
        </div>

        <!-- 外出事由 -->
        <van-field
          v-model="gooutReason"
          name="gooutReason"
          rows="2"
          required
          autosize
          label="外出事由"
          type="textarea"
          maxlength="100"
          placeholder="请输入外出事由"
          :rules="[{ required: true, message: '外出事由不能为空' }]"
          show-word-limit
        />

        <!-- 是否需要车辆 -->
        <van-field name="vehicleSource" label="车辆来源" required>
          <template #input>
            <van-radio-group v-model="vehicleSource" direction="horizontal" @change="changeSource">
              <van-radio name="派车" icon-size="17px">派车</van-radio>
              <van-radio name="私家车" icon-size="17px">私家车</van-radio>
              <van-radio name="其它" icon-size="17px">其它</van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <!-- 驾驶人 -->
        <van-field
          v-if="/(私家车|2)/.test(vehicleSource + '')"
          required
          v-model="plateNumber"
          name="plateNumber"
          label="车牌号码"
          type="text"
          placeholder="请填写车牌号码"
          :rules="[{ required: true, message: '车牌号码不能为空' }]"
        />

        <van-field name="vehicleUsage" label="用车方式" v-if="/(派车|1|其它)/.test(vehicleSource + '')" required>
          <template #input>
            <van-radio-group v-if="vehicleSource === '其它'" v-model="vehicleUsage" direction="horizontal">
              <van-radio :name="2" icon-size="17px">打车</van-radio>
              <van-radio :name="3" icon-size="17px">跟随</van-radio>
            </van-radio-group>
            <van-radio-group v-else v-model="vehicleUsage" direction="horizontal">
              <van-radio :name="0" icon-size="17px">自驾</van-radio>
              <van-radio :name="1" icon-size="17px">指派司机</van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <!-- 驾驶人 -->
        <van-field
          v-if="(/(派车|1)/.test(vehicleSource + '') && vehicleUsage === 0) || /(私家车|2)/.test(vehicleSource + '')"
          required
          v-model="driver"
          name="driver"
          label="驾驶人"
          type="text"
          placeholder="请填写驾驶人"
          :rules="[{ required: true, message: '驾驶人不能为空' }]"
        />

        <!-- 外出日期 -->
        <van-field
          required
          v-model="startDate"
          name="startDate"
          readonly
          label="外出日期"
          placeholder="请选择外出日期"
          @click="showStartDate = true"
          :rules="[{ required: true, message: '外出日期不能为空' }]"
        />
        <van-popup v-model:show="showStartDate" position="bottom">
          <van-date-picker v-model="startDateArr" @confirm="onStartDateConfirm" @cancel="showStartDate = false" />
        </van-popup>

        <!-- 外出时间 -->
        <van-field
          required
          v-model="startTime"
          name="startTime"
          label="外出时间"
          readonly
          placeholder="请选择外出时间"
          @click="showStartTime = true"
          :rules="[{ required: true, message: '外出时间不能为空' }]"
        />
        <van-popup v-model:show="showStartTime" position="bottom">
          <van-time-picker
            v-model="startTimeArr"
            @confirm="onStartTimeConfirm"
            title="时分"
            :filter="filterTime"
            @cancel="showStartTime = false"
            :columns-type="['hour', 'minute']"
          />
        </van-popup>

        <!-- 返回日期 -->
        <van-field
          required
          v-model="endDate"
          name="endDate"
          label="返回日期"
          readonly
          placeholder="请选择返回日期"
          @click="showEndDate = true"
          :rules="[{ required: true, message: '返回日期不能为空' }]"
        />
        <van-popup v-model:show="showEndDate" position="bottom">
          <van-date-picker :filter="filterEndDate" v-model="endDateArr" @confirm="onEndDateConfirm" @cancel="showEndDate = false" />
        </van-popup>

        <!-- 返回时间 -->
        <van-field
          v-model="endTime"
          required
          name="endTime"
          label="返回时间"
          readonly
          placeholder="请选择返回时间"
          @click="showEndTime = true"
          :rules="[{ required: true, message: '返回时间不能为空' }]"
        />
        <van-popup v-model:show="showEndTime" position="bottom">
          <van-time-picker
            @confirm="onEndTimeConfirm"
            v-model="endTimeArr"
            :filter="filterEndTime"
            @cancel="showEndTime = false"
            :columns-type="['hour', 'minute']"
            title="时分"
          />
        </van-popup>

        <!-- 备注 -->
        <van-field v-model="remarks" name="remarks" label="备注" type="textarea" autosize placeholder="请填写备注" />
      </van-cell-group>

      <!-- 保存按钮 -->
      <div style="margin: 30px">
        <van-button round block type="primary" native-type="submit" :loading="loading"> 保存 </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { PickerOption, closeToast, showConfirmDialog, showLoadingToast, showNotify, showToast } from "vant";

import { queryUserInfo } from "@/api/user";
import { useAppStore } from "@/store/modules/app";
import dayjs from "dayjs";
import { addGoOutList, fetchGoOutList, updateGoOutList } from "@/api/outApply";
import { carSourceContantInfo } from "@/utils/common";
import { commonSubmit } from "@/api/common";

const route = useRoute();
const router = useRouter();
const saveDataId = ref("");

defineOptions({
  name: "AddApplyList"
});

const applyUserId = ref(""); // 申请人
let withUserDict = reactive({});
const gooutReason = ref(""); // 外出事由
const startDate = ref(dayjs(new Date()).format("YYYY-MM-DD")); // 外出日期

const curMin = () => {
  const minute = dayjs().minute();
  let finalMin: string = ":00";

  if (minute <= 15) {
    finalMin = ":15";
  } else if (minute > 15 && minute <= 30) {
    finalMin = ":30";
  } else if (minute > 30 && minute <= 45) {
    finalMin = ":45";
  } else {
    finalMin = ":00";
  }

  return finalMin;
};
const startTime = ref(dayjs(new Date()).hour() + curMin()); // 外出时间
const endDate = ref(dayjs(new Date()).format("YYYY-MM-DD")); // 返回日期
const endTime = ref(dayjs(new Date()).hour() + curMin()); // 返回时间
const destination = ref(""); // 目的地
const loading = ref(false);
const vehicleSource = ref("派车");
const remarks = ref("");
const vehicleUsage = ref<number | undefined>(0);
const withUsers = ref<any[]>([]);
const withUserNum = ref(0);
const userInfoData = ref<any>({});

const showStartDate = ref(false);
const showStartTime = ref(false);
const showEndDate = ref(false);
const showEndTime = ref(false);
const driver = ref("");
const addResId = ref("");
const plateNumber = ref("");

const changeSource = (val) => {
  if (val === "其它") {
    vehicleUsage.value = 2;
  } else if (val === "派车") {
    vehicleUsage.value = 0;
  } else {
    vehicleUsage.value = undefined;
  }
};

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

const startTimeArr = computed(() => {
  return startTime.value.split(":")?.slice(0, 2);
});

const startDateArr = computed(() => {
  return startDate.value.split("-");
});

const endDateArr = computed(() => {
  return endDate.value.split("-");
});

const endTimeArr = computed(() => {
  return endTime.value.split(":")?.slice(0, 2);
});

const filterEndDate = (type: string, options: PickerOption[]): PickerOption[] => {
  if (startDate.value) {
    const [year, month, day] = startDate.value.split("-");
    if (type === "year") {
      return options.filter((option) => Number(option.value) >= +year);
    }
    // TODO: 跨年，月份选择会出错
    // if (type === "month") {
    //   return options.filter((option) => Number(option.value) >= +month);
    // }
    // if (type === "day") {
    //   return options.filter((option) => Number(option.value) >= +day);
    // }
  }
  return options;
};

const addWithUser = () => {
  withUserNum.value += 1;
  withUsers.value.push({ key: withUserNum.value });
};

const delIconClick = (index, e) => {
  const pos = withUsers.value.findIndex((item) => item.key === index);
  withUsers.value.splice(pos, 1);
  delete withUserDict[index];
};

queryUserInfo({}).then((res) => {
  if (res.data) {
    userInfoData.value = res.data;
    applyUserId.value = res.data.userName;
  }
});

onMounted(() => {
  if (route.query.id && route.query.mode === "edit") {
    getEditInfo();
    useAppStore().setNavTitle("编辑外出申请单");
  } else useAppStore().setNavTitle("新增外出申请单");
});

onBeforeRouteLeave(() => {
  // 清除操作
  // if (route.query.id && route.query.mode === "edit") return;
  // clearFormData();
});

const clearFormData = () => {
  destination.value = "";
  gooutReason.value = "";
  remarks.value = "";
  vehicleSource.value = "派车";
  vehicleUsage.value = 0;
  startDate.value = "";
  startTime.value = "";
  endDate.value = "";
  endTime.value = "";
  driver.value = "";
  withUserDict = {};
};

// 表单提交事件
const onSubmit = (values) => {
  loading.value = true;

  // 如果是编辑则调用编辑接口然后返回
  if (route.query.id && route.query.mode === "edit") {
    const editConfig = {
      id: route.query.id,
      applyUserId: userInfoData.value.id,
      gooutReason: values.gooutReason,
      destination: values.destination,
      planOutDate: values.startDate + " " + values.startTime + ":00",
      planBackDate: values.endDate + " " + values.endTime + ":00",
      vehicleSource: values.vehicleSource,
      goOutVehicleDTO: { plateNumber: values.plateNumber },
      applyDriver: values.driver,
      applyVehicleUsage: vehicleUsage.value,
      userNames: Object.values(withUserDict).filter((item) => item !== userInfoData.value.userName),
      remarks: remarks.value
    };
    updateGoOutList(editConfig)
      .then((res) => {
        if (res.status === 200 && res.data) {
          // 清除操作
          clearFormData();
          showNotify({ type: "success", message: (res as any).message });
          setTimeout(() => router.push("/oa/outApply"), 100);
        }
        loading.value = false;
      })
      .catch((err) => {
        loading.value = false;
      })
      .finally(() => (loading.value = false));
    return;
  }

  // 组装新增的请求参数
  const addParams = {
    applyUserId: userInfoData.value.id,
    gooutReason: values.gooutReason,
    destination: values.destination,
    planOutDate: values.startDate + " " + values.startTime + ":00",
    planBackDate: values.endDate + " " + values.endTime + ":00",
    vehicleSource: values.vehicleSource,
    applyVehicleUsage: vehicleUsage.value,
    applyDriver: values.driver,
    goOutVehicleDTO: { plateNumber: values.plateNumber },
    remarks: remarks.value,
    userNames: Object.values(withUserDict)
  };
  const isValidDate = dayjs(addParams.planOutDate).isBefore(dayjs(addParams.planBackDate));

  if (!isValidDate) {
    loading.value = false;
    return showToast({ message: "结束日期必须在开始日期之后", type: "fail" });
  }

  const beforeClose = (action): Promise<boolean> => {
    return new Promise((resolve) => {
      if (action === "cancel") {
        resolve(true);
        router.push(`/oa/outApply/detail?id=${addResId.value}`);
      }
      setTimeout(() => {
        if (action === "confirm") {
          commonSubmit({ id: addResId.value, billId: "10038" }).then((res) => {
            if (res.data) {
              showToast({ message: "提交成功", type: "success" });
              // 清除操作
              clearFormData();
              setTimeout(() => {
                router.push("/oa/outApply");
              }, 100);
            }
          });
          resolve(true);
        }
      }, 1000);
    });
  };

  const secondApi = saveDataId.value ? updateGoOutList : addGoOutList;

  if (saveDataId.value) addParams["id"] = saveDataId.value;

  secondApi(addParams)
    .then((res) => {
      addResId.value = res.data;
      if (res.status === 200 && res.data) {
        saveDataId.value = res.data;
        showConfirmDialog({
          title: "提示",
          message: "保存成功，是否提交？",
          beforeClose
        });
      } else showNotify({ type: "danger", message: (res as any).message });
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

// 编辑页面获取数据
const getEditInfo = () => {
  showLoadingToast("查询中");
  fetchGoOutList({ isOwner: true })
    .then((res) => {
      if (res.data) {
        const resData = res.data.records?.filter((item) => item.id === route.query.id)[0];
        // 初始化表单的值
        destination.value = resData.destination;
        gooutReason.value = resData.gooutReason;
        if (/\d/.test(resData.vehicleSource)) {
          vehicleSource.value = carSourceContantInfo[resData.vehicleSource];
        } else {
          vehicleSource.value = resData.vehicleSource;
        }
        plateNumber.value = resData.goOutVehicleVO?.plateNumber;
        vehicleUsage.value = resData.applyVehicleUsage;
        startDate.value = resData.planOutDate.split(" ")[0];
        startTime.value = resData.planOutDate.split(" ")[1]?.substr(0, 5);
        endDate.value = resData.planBackDate.split(" ")[0];
        endTime.value = resData.planBackDate.split(" ")[1]?.substr(0, 5);
        driver.value = resData.applyDriver;
        remarks.value = resData.remarks;
        const filterArr = [...new Set(resData.userNames)];

        withUserNum.value = filterArr.length;

        for (let i = 0; i < filterArr.length; i++) {
          withUsers.value.push({ key: i + 1 });
          withUserDict[i + 1] = filterArr[i];
        }
      }
    })
    .finally(() => closeToast());
};
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
