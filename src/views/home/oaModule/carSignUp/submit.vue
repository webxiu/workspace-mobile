<template>
  <div>
    <div class="detail-page">
      <van-notice-bar class="user-title" color="#1989fa" background="#ecf9ff" left-icon="info-o">
        【{{ detailInfo.applyName }}】的{{ signType === "go" ? "出车" : "返程" }}登记
      </van-notice-bar>
      <div>
        <div class="detail">
          <div class="des-item">
            <van-divider content-position="center">详细信息</van-divider>

            <van-row>
              <van-col class="label" span="8">申请人：</van-col>
              <van-col class="value">{{ detailInfo.applyName }}</van-col>
            </van-row>
          </div>
          <div class="des-item">
            <van-row>
              <van-col class="label" span="8">目的地：</van-col>
              <van-col class="value">{{ detailInfo.destination }}</van-col>
            </van-row>
          </div>
          <div class="des-item" v-if="detailInfo.userNames?.length">
            <van-row>
              <van-col class="label" span="8">同行人：</van-col>
              <van-col class="value">{{ String([...new Set(detailInfo.userNames)] ?? "") }}</van-col>
            </van-row>
          </div>
          <div class="des-item" v-if="detailInfo.goOutVehicleVO?.plateNumber">
            <van-row>
              <van-col class="label" span="8">车牌号：</van-col>
              <van-col class="value">{{ detailInfo.goOutVehicleVO?.plateNumber }}</van-col>
            </van-row>
          </div>
          <div class="des-item" v-if="detailInfo.goOutVehicleVO?.driverName">
            <van-row>
              <van-col class="label" span="8">司机：</van-col>
              <van-col class="value">{{ detailInfo.goOutVehicleVO?.driverName }}</van-col>
            </van-row>
          </div>
          <div class="des-item">
            <van-row>
              <van-col class="label" span="8">外出事由：</van-col>
              <van-col class="value">{{ detailInfo.gooutReason || "无" }}</van-col>
            </van-row>
          </div>
          <div class="des-item">
            <van-row>
              <van-col class="label" span="8">车辆来源：</van-col>
              <van-col class="value">{{ calcSource(detailInfo.vehicleSource) || "" }}</van-col>
            </van-row>
          </div>
          <div class="des-item">
            <van-row>
              <van-col class="label" span="8">用车方式：</van-col>
              <van-col class="value">{{ findOptinNameByOptionValue(detailInfo.applyVehicleUsage) }}</van-col>
            </van-row>
          </div>
        </div>
        <div class="date">
          <div
            class="des-item"
            v-if="
              detailInfo.goOutRegisterVO?.realGoOutDate &&
              /(4|5)/.test(route.query.goOutStatus as string)
            "
          >
            <van-row>
              <van-col class="label" span="8">实际外出时间：</van-col>
              <van-col class="value">
                {{ `${detailInfo.goOutRegisterVO?.realGoOutDate}` }}
              </van-col>
            </van-row>
          </div>
          <div class="des-item">
            <van-row>
              <van-col class="label" span="8">预计外出时间：</van-col>
              <van-col class="value">
                {{ `${detailInfo.planOutDate}` }}
              </van-col>
            </van-row>
          </div>
          <div class="des-item">
            <van-row>
              <van-col class="label" span="8">预计返回时间：</van-col>
              <van-col class="value">
                {{ `${detailInfo.planBackDate}` }}
              </van-col>
            </van-row>
          </div>
          <div class="des-item">
            <van-row>
              <van-col class="label" span="8">当前状态：</van-col>
              <van-col class="value">
                <van-tag :type="signUpColorCalc(detailInfo.goOutVehicleVO?.state, 'tag')">
                  {{ signUpColorCalc(detailInfo.goOutVehicleVO?.state, "text") }}
                </van-tag>
              </van-col>
            </van-row>
          </div>
        </div>
        <div v-if="!isEditFlag">
          <van-divider content-position="center">登记信息</van-divider>

          <div class="des-item" v-if="detailInfo.goOutRegisterVO?.outMileage">
            <van-row>
              <van-col class="label">出车前公里数：</van-col>
              <van-col class="value">{{ detailInfo.goOutRegisterVO?.outMileage }}</van-col>
            </van-row>
          </div>

          <div class="des-item" v-if="detailInfo.goOutBackRegisterVO?.backMileage">
            <van-row>
              <van-col class="label">返程时公里数：</van-col>
              <van-col class="value">{{ detailInfo.goOutBackRegisterVO?.backMileage }}</van-col>
            </van-row>
          </div>

          <div class="des-item" v-if="detailInfo.goOutBackRegisterVO?.realBackDate">
            <van-row>
              <van-col class="label">实际返回时间：</van-col>
              <van-col class="value">{{ detailInfo.goOutBackRegisterVO?.realBackDate }}</van-col>
            </van-row>
          </div>

          <div class="des-item" v-if="detailInfo.goOutBackRegisterVO?.vehicleInfo">
            <van-row>
              <van-col class="label">返程检查说明：</van-col>
              <van-col class="value">{{ detailInfo.goOutBackRegisterVO?.vehicleInfo }}</van-col>
            </van-row>
          </div>

          <div class="des-item" v-if="detailInfo.goOutBackRegisterVO?.imgPathList && detailInfo.goOutBackRegisterVO?.imgPathList?.length">
            <van-row>
              <van-col class="label">相关附件：</van-col>
              <van-col class="value">
                <van-image
                  style="margin-left: 10px"
                  v-for="item in detailInfo.goOutBackRegisterVO?.imgPathList"
                  :key="item"
                  width="100"
                  height="100"
                  @click="clickImg(BASE_API + item)"
                  :src="`${BASE_API + item}`"
                />
              </van-col>
            </van-row>
          </div>
        </div>
        <div class="msg" v-if="isEditFlag">
          <van-divider content-position="center">登记信息</van-divider>

          <van-form ref="carFormRef" @submit="onSubmit">
            <van-cell-group inset style="margin-top: 10px">
              <van-field
                v-model="carConfigForm.outMileage"
                name="outMileage"
                label="出车前公里数"
                type="number"
                v-if="signType === 'go'"
                label-align="top"
                placeholder="请填写出车前公里数"
                required
                :rules="[{ required: true, message: '请填写出车前公里数' }]"
              />

              <!-- 实际外出日期 -->
              <van-field
                v-model="carConfigForm.realStartDate"
                name="realStartDate"
                readonly
                label="实际出发日期"
                required
                v-if="signType === 'go'"
                label-align="top"
                placeholder="请选择实际出发日期"
                @click="showRealStartDate = true"
                :rules="[{ required: true, message: '实际出发日期不能为空' }]"
              />
              <van-popup v-model:show="showRealStartDate" position="bottom">
                <van-date-picker v-model="currentRealDateArr" @confirm="onRealStartDateConfirm" @cancel="showRealStartDate = false" />
              </van-popup>

              <!-- 实际外出时间 -->
              <van-field
                v-model="carConfigForm.realStartTime"
                name="realStartTime"
                label="实际出发时间"
                required
                v-if="signType === 'go'"
                label-align="top"
                readonly
                placeholder="请选择实际出发时间"
                @click="showRealStartTime = true"
                :rules="[{ required: true, message: '实际出发时间不能为空' }]"
              />
              <van-popup v-model:show="showRealStartTime" position="bottom">
                <van-time-picker @confirm="onRealStartTimeConfirm" title="时分" @cancel="showRealStartTime = false" :columns-type="['hour', 'minute']" />
              </van-popup>

              <van-field
                v-model="carConfigForm.backMileage"
                name="backMileage"
                label="出车后公里数"
                type="number"
                v-if="signType === 'back'"
                label-align="top"
                placeholder="请填写出车后公里数"
                required
                :rules="[{ required: true, message: '请填写出车后公里数' }]"
              />
              <!-- 外出返回日期 -->
              <van-field
                v-model="carConfigForm.startDate"
                name="startDate"
                readonly
                label="实际返回日期"
                required
                v-if="signType === 'back'"
                label-align="top"
                placeholder="请选择实际返回日期"
                @click="showStartDate = true"
                :rules="[{ required: true, message: '实际返回日期不能为空' }]"
              />
              <van-popup v-model:show="showStartDate" position="bottom">
                <van-date-picker v-model="currentDateArr" @confirm="onStartDateConfirm" @cancel="showStartDate = false" />
              </van-popup>

              <!-- 外出返回时间 -->
              <van-field
                v-model="carConfigForm.startTime"
                name="startTime"
                label="实际返回时间"
                required
                v-if="signType === 'back'"
                label-align="top"
                readonly
                placeholder="请选择实际返回时间"
                @click="showStartTime = true"
                :rules="[{ required: true, message: '实际返回时间不能为空' }]"
              />
              <van-popup v-model:show="showStartTime" position="bottom">
                <van-time-picker @confirm="onStartTimeConfirm" title="时分" @cancel="showStartTime = false" :columns-type="['hour', 'minute']" />
              </van-popup>
              <van-field
                v-model="carConfigForm.vehicleInfo"
                name="vehicleInfo"
                rows="2"
                autosize
                label="回厂检查情况说明"
                v-if="signType === 'back'"
                label-align="top"
                type="textarea"
                maxlength="50"
                placeholder="请填写回检说明"
                show-word-limit
                clearable
                required
                :rules="[{ required: true, message: '请填写回检说明' }]"
              />
              <van-field
                name="tempImgNamesList"
                label="图片上传"
                required
                label-align="top"
                v-if="signType === 'back'"
                :rules="[{ required: true, message: '请上传附件' }]"
              >
                <template #input>
                  <van-uploader v-model="carConfigForm.tempImgNamesList" multiple />
                </template>
              </van-field>
            </van-cell-group>
          </van-form>
        </div>
      </div>
    </div>
    <van-tabbar @change="changeBottomBar" v-if="isEditFlag">
      <van-tabbar-item icon="edit" style="display: none">此项为占位项</van-tabbar-item>

      <van-tabbar-item icon="passed">提交{{ signType === "back" ? "返程" : "出车" }}登记</van-tabbar-item>
    </van-tabbar>
    <van-overlay :show="showOverlay" @click="showOverlay = false">
      <div class="wrapper">
        <div class="block" @click.stop>
          <van-image :src="curUrl" />
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { TagType, closeToast, showConfirmDialog, showLoadingToast, showNotify, showToast } from "vant";
import { deleteLeaveList, fetchEnumList, revokeLeaveList } from "@/api/oaModule";
import { useAppStore } from "@/store/modules/app";
import { fetchStartSignUpList, fetchEndSignUpList, signUpStart, uploadCarAttrList, signUpEnd, fetchStartSignUpDetail } from "@/api/outApply";
import dayjs from "dayjs";
import { carSourceContantInfo } from "@/utils/common";

defineOptions({ name: "OutApplySubmit" });

const BASE_API = import.meta.env.VITE_BASE_API;

const showOverlay = ref(false);
const startDate = ref(""); // 外出日期

const minDate = new Date();
const currentDateArr = ref(new Date().toLocaleDateString().split("/"));
const currentRealDateArr = ref(new Date().toLocaleDateString().split("/"));
const showStartDate = ref(false);
const showStartTime = ref(false);

const showRealStartDate = ref(false);
const showRealStartTime = ref(false);

const carFormRef = ref();

const props = defineProps({ id: String });
const router = useRouter();
const route = useRoute();

const { goOutStatus, type } = route.query;
const isEditFlag = (type === "go" && goOutStatus === "3") || (type === "back" && goOutStatus === "4");
const appStore = useAppStore();
const inputRef = ref(null);
const signType = route.query.type;
const carConfigForm: any = reactive({});

const confirmButtonDisabled = ref(false);
const detailInfo = ref<any>({});

const revokeReason = ref("");
const showRevoke = ref(false);
const curUrl = ref("");
const applyVehicleUsageOpts = ref<any[]>([]);

if (signType === "back" && route.query.goOutStatus === "4") {
  carConfigForm.startDate = dayjs(new Date()).format("YYYY-MM-DD");
  //carConfigForm.startTime = dayjs(new Date()).format("HH:mm");
}

const clickImg = (url) => {
  curUrl.value = url;
  showOverlay.value = true;
};

const calcSource = (source) => {
  if (/\d/.test(source)) {
    return carSourceContantInfo[source];
  } else {
    return source;
  }
};

const signUpColorCalc = (state, showType) => {
  switch (state) {
    case 4:
      return (showType === "tag" ? (route.query.type === "back" ? "warning" : "success") : route.query.type === "back" ? "待登记" : "已登记") as TagType;
    case 3:
      return (showType === "tag" ? "warning" : "待登记") as TagType;
    case 5:
      return (showType === "tag" ? "success" : "已登记") as TagType;
    default:
      break;
  }
};

const onStartDateConfirm = ({ selectedValues }) => {
  carConfigForm.startDate = selectedValues.join("-");
  showStartDate.value = false;
};

const onRealStartDateConfirm = ({ selectedValues }) => {
  carConfigForm.realStartDate = selectedValues.join("-");
  showRealStartDate.value = false;
};

const onStartTimeConfirm = ({ selectedValues }) => {
  carConfigForm.startTime = selectedValues.join(":");
  showStartTime.value = false;
};

const onRealStartTimeConfirm = ({ selectedValues }) => {
  carConfigForm.realStartTime = selectedValues.join(":");
  showRealStartTime.value = false;
};

const confirmRevoke = (action: string): boolean | Promise<boolean> => {
  return new Promise((resolve) => {
    if (action === "cancel") {
      resolve(true);
      return;
    }
    if (revokeReason.value) {
      showLoadingToast({
        message: "处理中",
        forbidClick: true,
        duration: 5000
      });
      confirmButtonDisabled.value = true;
      revokeLeaveList({ id: props.id, remark: revokeReason.value })
        .then((res) => {
          if (res.data) {
            resolve(true);
            showNotify({ type: "success", message: (res as any).message });
            setTimeout(() => router.push("/oa/leaveApply"), 100);
          } else {
            resolve(false);
            confirmButtonDisabled.value = false;
            showNotify({
              type: "danger",
              message: "操作失败，请联系开发人员处理！"
            });
          }
        })
        .finally(() => {
          closeToast();
        });
    }
    resolve(false);
    (inputRef.value as any).validate();
  });
};

const getDetailInfo = (id) => {
  if (route.query.id && route.query.type === "go") {
    fetchStartSignUpDetail({ id: route.query.id }).then((res) => {
      if (res.data) {
        detailInfo.value = res.data[0];
      }
    });

    return;
  }

  const typeApi = { go: fetchStartSignUpList, back: fetchEndSignUpList };
  typeApi[route.query.type as string]({
    goOutStatus: route.query.goOutStatus ? +route.query.goOutStatus : null
  }).then((res) => {
    if (res.data) {
      detailInfo.value = res.data?.filter((item) => item.id === route.query.id)[0];
    }
  });
};

const handleAction = (actionType, data?) => {
  const typeApi = { go: signUpStart, back: signUpEnd };
  if (actionType === "revoke") {
    showRevoke.value = true;
    return;
  }
  const title = signType === "go" ? "出车" : "返程";
  showConfirmDialog({
    message: `您确定要${actionType === "del" ? "删除" : actionType === "submit" ? "提交" : "撤销"}当前${title}登记吗`,
    confirmButtonColor: "red",
    beforeClose: (action) => {
      return new Promise((resolve) => {
        if (action === "confirm") {
          let actionRes;
          if (actionType === "del") {
            actionRes = deleteLeaveList({ id: props.id });
          } else if (actionType === "submit") {
            const copyData = JSON.parse(JSON.stringify(carConfigForm));
            const newCopyData = {
              outMileage: copyData.outMileage,
              realGoOutDate: copyData.realStartDate + " " + copyData.realStartTime + ":00"
            };
            const newReqData = {
              applyId: route.query.id,
              backMileage: copyData.backMileage,
              realBackDate: copyData.startDate + " " + copyData.startTime + ":00",
              vehicleInfo: copyData.vehicleInfo,
              tempImgNamesList: copyData.resourceNameList
            };
            const reqParamsData = route.query.type === "go" ? newCopyData : newReqData;
            actionRes = typeApi[route.query.type as string]({
              applyId: route.query.id,
              ...reqParamsData
            });
          }
          actionRes.then((res) => {
            if (res.data) {
              resolve(true);
              showNotify({ type: "success", message: (res as any).message });
              setTimeout(() => router.push("/oa/carSignUp"), 100);
            } else {
              resolve(false);
              showNotify({
                type: "danger",
                message: "操作失败，请联系开发人员处理！"
              });
            }
          });
        } else resolve(true);
      });
    }
  })
    .then(() => {})
    .catch(() => {});
};
// 防止重复点击
let uploadFlag = true;
const changeBottomBar = (active) => {
  carFormRef.value
    ?.validate()
    .then(() => {
      if (route.query.type === "go") {
        handleAction("submit");
        return;
      }
      if (carConfigForm.tempImgNamesList.length) {
        const files = carConfigForm.tempImgNamesList.map((item) => item.file);
        const data = new FormData();

        for (const file of files) {
          data.append("files", file);
        }

        showLoadingToast("正在处理");
        if (uploadFlag) {
          uploadFlag = false;
          uploadCarAttrList(data)
            .then((res) => {
              if (res.data) {
                carConfigForm.resourceNameList = res.data.resourceNameList;
                handleAction("submit");
              }
            })
            .finally(() => {
              uploadFlag = true;
              closeToast();
            });
        }
      }
    })
    .catch(() => {
      showToast({ message: "请填写登记信息", type: "fail" });
    });
};

const onSubmit = (v) => {};

watch(
  route,
  (newVal) => {
    if (newVal.path === "/oa/carSignUp/submit") {
      getDetailInfo(newVal.query.id);
    }
  },
  { immediate: true }
);

const findOptinNameByOptionValue = (optionValue) => {
  return applyVehicleUsageOpts.value.find((item) => item.optionValue == optionValue)?.optionName ?? "";
};

const fetchOpts = () => {
  fetchEnumList({ optioncode: "GoOutVehicleUsage" }).then((res) => {
    if (res.data) {
      const result = res.data.find((item) => item.optionCode === "GoOutVehicleUsage")?.optionList || [];
      applyVehicleUsageOpts.value = result;
    }
  });
};

onMounted(() => {
  fetchOpts();
  appStore.setNavTitle("提交用车登记");
});
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  background-color: #fff;
}
.detail-page {
  padding: 60px 80px 120px;
  margin-bottom: 80px;

  .des-item {
    margin-bottom: 44px;
    font-size: 28px;

    .label {
      text-align: right;
    }

    .value {
      font-weight: 600;
    }
  }
  .user-title {
    margin-bottom: 100px;
    font-size: 30px;
  }
}
</style>
