<template>
  <div>
    <div class="detail-page">
      <van-notice-bar class="user-title" color="#1989fa" background="#ecf9ff" left-icon="info-o"> 【{{ detailInfo.applyName }}】的外出申请单 </van-notice-bar>
      <div>
        <div class="detail">
          <div class="des-item">
            <van-divider content-position="center">外出申请信息</van-divider>
            <div style="display: flex; align-items: center">
              <div class="label">申请单号</div>
              <div class="value">{{ detailInfo.billNo }}</div>
            </div>
          </div>
          <div class="des-item">
            <div style="display: flex; align-items: center">
              <div class="label">申请人</div>
              <div class="value">{{ detailInfo.applyName }}</div>
            </div>
          </div>
          <div class="des-item" v-if="detailInfo.applyDriver">
            <div style="display: flex; align-items: center">
              <div class="label">驾驶人</div>
              <div class="value">{{ detailInfo.applyDriver }}</div>
            </div>
          </div>
          <div class="des-item">
            <div style="display: flex; align-items: center">
              <div class="label">目的地</div>
              <div class="value">{{ detailInfo.destination }}</div>
            </div>
          </div>
          <div class="des-item" v-if="detailInfo.userNames?.length">
            <div style="display: flex; align-items: center">
              <div class="label">同行人</div>
              <div class="value">
                {{ String([...new Set(detailInfo.userNames)]) }}
              </div>
            </div>
          </div>
          <div class="des-item">
            <div style="display: flex; align-items: center">
              <div class="label">外出事由</div>
              <div class="value">
                {{ detailInfo.gooutReason || "无" }}
              </div>
            </div>
          </div>
          <div class="des-item">
            <div style="display: flex; align-items: center">
              <div class="label">车辆来源</div>
              <div class="value">
                {{ calcSource(detailInfo.vehicleSource) || "" }}
              </div>
            </div>
          </div>
          <div class="des-item" v-if="detailInfo.applyVehicleUsage !== null">
            <div style="display: flex; align-items: center">
              <div class="label">用车方式</div>
              <div class="value">
                {{ findOptinNameByOptionValue(detailInfo.applyVehicleUsage) }}
              </div>
            </div>
          </div>
        </div>
        <div class="date">
          <div class="des-item">
            <div style="display: flex; align-items: center">
              <div class="label">预计外出时间</div>
              <div class="value">
                {{ `${detailInfo.planOutDate}` || "" }}
              </div>
            </div>
          </div>
          <div class="des-item" v-if="detailInfo.goOutRegisterVO?.realGoOutDate">
            <div style="display: flex; align-items: center">
              <div class="label">实际外出时间</div>
              <div class="value">
                {{ `${detailInfo.goOutRegisterVO?.realGoOutDate}` }}
              </div>
            </div>
          </div>
          <div class="des-item">
            <div style="display: flex; align-items: center">
              <div class="label">预计返回时间</div>
              <div class="value">
                {{ `${detailInfo.planBackDate}` || "" }}
              </div>
            </div>
          </div>
          <div class="des-item" v-if="detailInfo.remarks">
            <div style="display: flex; align-items: center">
              <div class="label">备注</div>
              <div class="value">{{ detailInfo.remarks }}</div>
            </div>
          </div>
        </div>
        <div class="msg">
          <van-divider content-position="center">审批信息</van-divider>
          <div class="des-item">
            <div style="display: flex; align-items: center">
              <div class="label">当前状态</div>
              <div class="value">
                <van-tag :type="calcTagColor(detailInfo.billState)">
                  {{ BILLSTATE[detailInfo.billState] || "" }}
                </van-tag>
              </div>
            </div>
          </div>

          <div class="des-item" v-if="detailInfo.goOutVehicleVO?.plateNumber">
            <div style="display: flex; align-items: center">
              <div class="label">车牌号</div>
              <div class="value">
                {{ detailInfo.goOutVehicleVO?.plateNumber }}
              </div>
            </div>
          </div>
          <div class="des-item" v-if="detailInfo.goOutVehicleVO?.driverName">
            <div style="display: flex; align-items: center">
              <div class="label">司机</div>
              <div class="value">
                {{ detailInfo.goOutVehicleVO?.driverName }}
              </div>
            </div>
          </div>
          <div class="des-item" v-if="detailInfo.approver?.length">
            <div style="display: flex; align-items: center" v-for="(item, index) in detailInfo.approver">
              <div class="label">当前审批人{{ detailInfo.approver?.length > 1 ? index + 1 : "" }}</div>
              <div class="value">
                <van-tag :type="calcTagColor(detailInfo.billState)">
                  {{ item }}
                </van-tag>
              </div>
            </div>
          </div>
        </div>
        <div class="msg" v-if="detailInfo.goOutVehicleVO?.state">
          <van-divider content-position="center">登记信息</van-divider>
          <div class="des-item-long-text" v-if="detailInfo.goOutRegisterVO?.outMileage">
            <div style="display: flex; align-items: center">
              <div class="label">出车前公里数</div>
              <div class="value">
                {{ detailInfo.goOutRegisterVO?.outMileage }}
              </div>
            </div>
          </div>
          <div class="des-item" v-if="detailInfo.goOutBackRegisterVO?.backMileage">
            <div style="display: flex; align-items: center">
              <div class="label">返程后公里数</div>
              <div class="value">
                {{ detailInfo.goOutBackRegisterVO?.backMileage }}
              </div>
            </div>
          </div>
          <div class="des-item" v-if="detailInfo.goOutBackRegisterVO?.realBackDate">
            <div style="display: flex; align-items: center">
              <div class="label">实际返回时间</div>
              <div class="value">
                {{ detailInfo.goOutBackRegisterVO?.realBackDate }}
              </div>
            </div>
          </div>
          <div class="des-item" v-if="detailInfo.goOutBackRegisterVO?.vehicleInfo">
            <div style="display: flex; align-items: center">
              <div class="label">检查情况说明</div>
              <div class="value">
                {{ detailInfo.goOutBackRegisterVO?.vehicleInfo }}
              </div>
            </div>
          </div>

          <div class="des-item" v-if="detailInfo.goOutBackRegisterVO?.imgPathList && detailInfo.goOutBackRegisterVO?.imgPathList?.length">
            <div style="display: flex; align-items: center">
              <div class="label">相关附件</div>
              <div class="value">
                <van-image
                  style="margin-left: 10px"
                  v-for="item in detailInfo.goOutBackRegisterVO?.imgPathList"
                  :key="item"
                  width="100"
                  height="100"
                  @click="clickImg(BASE_API + item)"
                  :src="`${BASE_API + item}`"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-tabbar @change="changeBottomBar">
      <van-tabbar-item icon="edit" style="display: none">此项为占位项</van-tabbar-item>
      <van-tabbar-item icon="edit" v-show="/(0|3)/.test(detailInfo.billState + '')">修改</van-tabbar-item>
      <van-tabbar-item icon="delete-o" v-show="/(0|3)/.test(detailInfo.billState + '')">删除</van-tabbar-item>
      <van-tabbar-item icon="passed" v-show="/(0|3)/.test(detailInfo.billState + '')">提交</van-tabbar-item>
      <van-tabbar-item icon="revoke" v-show="detailInfo.billState === 1">撤销</van-tabbar-item>
      <van-dialog
        v-model:show="showRevoke"
        :confirmButtonDisabled="confirmButtonDisabled"
        title="撤销当前外出申请单"
        show-cancel-button
        :before-close="confirmRevoke"
      >
        <van-form>
          <van-cell-group inset style="margin-top: 10px">
            <van-field
              ref="inputRef"
              v-model="revokeReason"
              rows="2"
              autosize
              label="留言"
              type="textarea"
              maxlength="50"
              placeholder="请填写撤销原因"
              show-word-limit
              colon
              clearable
              required
              label-align="right"
              :rules="[{ required: true, message: '请填写撤销原因' }]"
            />
          </van-cell-group>
        </van-form>
      </van-dialog>

      <van-tabbar-item icon="todo-list-o" v-show="[1, 2].includes(detailInfo.billState)">审核节点详情</van-tabbar-item>
      <!-- 审核节点详情  start-->
      <NodeDetailModal ref="nodeRef" :detailInfo="detailInfo" billType="outApply" />
      <!-- 审核节点详情  end -->
    </van-tabbar>
    <van-overlay :show="showOverlay" @click="showOverlay = false">
      <div class="wrapper">
        <div class="block" @click.stop>
          <!-- curUrl -->
          <van-image :src="curUrl" />
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch, onUnmounted } from "vue";
import NodeDetailModal from "@/components/NodeDetailModal/index.vue";
import { useRoute, useRouter } from "vue-router";
import { closeToast, showConfirmDialog, showLoadingToast, showNotify } from "vant";

import { useAppStore } from "@/store/modules/app";
import { deleteGoOutList, fetchGoOutList, submitGoOutList, revokeGoOutList } from "@/api/outApply";
import { queryUserInfo } from "@/api/user";
import { carSourceContantInfo } from "@/utils/common";
import { commonSubmit } from "@/api/common";
import { fetchEnumList } from "@/api/oaModule";

defineOptions({ name: "OutApplyDetail" });

const props = defineProps({ id: String });
const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const inputRef = ref(null);
const nodeRef = ref();

const confirmButtonDisabled = ref(false);
const detailInfo: any = ref({
  userName: "",
  billNo: "",
  holidayType: "",
  remark: "",
  createUserName: "",
  createDate: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  days: "",
  hours: "",
  billState: 0,
  approver: [],
  operationType: 0,
  billStateName: ""
});

const revokeReason = ref("");
const showRevoke = ref(false);
const curUrl = ref("");
const showOverlay = ref(false);
const applyVehicleUsageOpts: any = ref([]);

const BASE_API = import.meta.env.VITE_BASE_API;

const BILLSTATE = {
  0: "待提交",
  1: "审核中",
  2: "已审核",
  3: "重新审核"
};

const calcSource = (source) => {
  if (/\d/.test(source)) {
    return carSourceContantInfo[source];
  } else {
    return source;
  }
};

const clickImg = (url) => {
  curUrl.value = url;
  showOverlay.value = true;
};

const calcTagColor = (state) => {
  const colorMap = {
    0: "primary",
    1: "warning",
    2: "success",
    3: "danger"
  };
  return colorMap[state];
};

const viewAuditNodeDetail = () => {
  if (nodeRef.value) {
    nodeRef.value.showApprovalNodePanel = true;
  }
};

const calcActionBtn = computed(() => {
  return detailInfo.value.billState === 1 || detailInfo.value.billState === 2;
});

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
      revokeGoOutList({ id: route.query.id, remark: revokeReason.value })
        .then((res) => {
          if (res.data) {
            resolve(true);
            showNotify({ type: "success", message: (res as any).message });
            setTimeout(() => router.push("/oa/outApply"), 100);
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
  fetchGoOutList({ isOwner: true, page: 1, limit: 10000 }).then((res) => {
    const dataInfo = res.data?.records.filter((item) => item.id === id)[0];
    detailInfo.value = dataInfo;
  });
};

const handleAction = (actionType) => {
  if (actionType === "revoke") {
    showRevoke.value = true;
    return;
  }
  showConfirmDialog({
    message: `您确定要${actionType === "del" ? "删除" : actionType === "submit" ? "提交" : "撤销"}当前外出申请单吗`,
    confirmButtonColor: "red",
    beforeClose: (action) => {
      return new Promise((resolve) => {
        if (action === "confirm") {
          let actionRes;
          if (actionType === "del") {
            actionRes = deleteGoOutList({ ids: [route.query.id] });
          } else if (actionType === "submit") {
            actionRes = commonSubmit({ id: route.query.id, billId: "10038" });
          }
          actionRes
            .then((res) => {
              if (res.data) {
                resolve(true);
                showNotify({ type: "success", message: (res as any).message });
                setTimeout(() => router.push("/oa/outApply"), 100);
              } else {
                resolve(false);
                showNotify({
                  type: "danger",
                  message: "操作失败，请联系开发人员处理！"
                });
              }
            })
            .catch(() => resolve(true));
        } else resolve(true);
      });
    }
  })
    .then(() => {})
    .catch(() => {});
};

// 点击修改跳转到添加页面并且携带参数，修改标志以及记录id
const changeBottomBar = (active) => {
  switch (active) {
    case 1:
      router.push({
        path: "/oa/outApply/add",
        query: { id: route.query.id, mode: "edit" }
      });
      break;
    case 2:
      handleAction("del");
      break;

    case 3:
      handleAction("submit");
      break;

    case 4:
      handleAction("revoke");
      break;

    case 5:
      viewAuditNodeDetail();
      break;

    default:
      break;
  }
};

watch(
  route,
  (newVal) => {
    if (newVal.path === "/oa/outApply/detail") {
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
  appStore.setNavTitle("外出申请单详情");
  fetchOpts();
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
      width: 190px;
    }

    .value {
      font-weight: 600;
      flex: 1;
    }
  }

  .des-item-long-text {
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
