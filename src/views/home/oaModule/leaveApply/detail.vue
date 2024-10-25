<template>
  <div>
    <div class="detail-page">
      <van-notice-bar class="user-title" color="#1989fa" background="#ecf9ff" left-icon="info-o"> 【{{ detailInfo.userName }}】的请假单 </van-notice-bar>
      <div>
        <div class="detail">
          <van-divider content-position="center">请假详情</van-divider>
          <div class="des-item">
            <div style="display: flex; align-items: center">
              <div class="label">请假人</div>
              <div class="value">{{ detailInfo.userName }}</div>
            </div>
          </div>
          <div class="des-item">
            <div style="display: flex; align-items: center">
              <div class="label">请假单号</div>
              <div class="value">{{ detailInfo.billNo }}</div>
            </div>
          </div>
          <div class="des-item">
            <div style="display: flex; align-items: center">
              <div class="label">请假类型</div>
              <div class="value">{{ detailInfo.holidayType }}</div>
            </div>
          </div>
          <div class="des-item">
            <div style="display: flex; align-items: center">
              <div class="label">请假缘由</div>
              <div class="value">
                {{ detailInfo.remark || "无" }}
              </div>
            </div>
          </div>
          <div class="des-item">
            <div style="display: flex; align-items: center">
              <div class="label">创建人</div>
              <div class="value">{{ detailInfo.createUserName }}</div>
            </div>
          </div>
          <div class="des-item">
            <div style="display: flex; align-items: center">
              <div class="label">创建日期</div>
              <div class="value">{{ detailInfo.createDate }}</div>
            </div>
          </div>
        </div>
        <div class="date">
          <van-divider content-position="center">请假日期</van-divider>
          <div class="des-item">
            <div style="display: flex; align-items: center">
              <div class="label">开始日期</div>
              <div class="value">
                {{ `${detailInfo.startDate} ${detailInfo.startTime}` }}
              </div>
            </div>
          </div>
          <div class="des-item">
            <div style="display: flex; align-items: center">
              <div class="label">结束日期</div>
              <div class="value">
                {{ `${detailInfo.endDate} ${detailInfo.endTime}` }}
              </div>
            </div>
          </div>
          <div class="des-item">
            <div style="display: flex; align-items: center">
              <div class="label">天数</div>
              <div class="value">{{ detailInfo.days }}</div>
            </div>
          </div>
          <div class="des-item">
            <div style="display: flex; align-items: center">
              <div class="label">时长</div>
              <div class="value">{{ detailInfo.hours }}</div>
            </div>
          </div>
        </div>
        <div class="msg">
          <van-divider content-position="center">审批信息</van-divider>
          <div class="des-item">
            <div style="display: flex; align-items: center">
              <div class="label">当前状态</div>
              <div class="value">
                <van-tag :type="colorSelector(detailInfo.billStateName)">
                  {{ detailInfo.billStateName }}
                </van-tag>
              </div>
            </div>
          </div>
          <div class="des-item" v-if="detailInfo.approver?.length">
            <div style="display: flex; align-items: center" v-for="(item, index) in detailInfo.approver">
              <div class="label">当前审批人{{ detailInfo.approver?.length > 1 ? index + 1 : "" }}</div>
              <div class="value">
                <van-tag :type="colorSelector(detailInfo.billStateName)">
                  {{ item }}
                </van-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-tabbar @change="changeBottomBar">
      <van-tabbar-item icon="edit" style="display: none">此项为占位项</van-tabbar-item>
      <van-tabbar-item icon="edit" v-show="!route.query.tab && !calcActionBtn">修改</van-tabbar-item>
      <van-tabbar-item icon="delete-o" v-show="!route.query.tab && !calcActionBtn">删除</van-tabbar-item>
      <van-tabbar-item icon="passed" v-show="!route.query.tab && !calcActionBtn">提交</van-tabbar-item>
      <van-tabbar-item icon="revoke" v-show="detailInfo.billState === 1">撤销</van-tabbar-item>
      <van-tabbar-item icon="todo-list-o" v-show="[1, 2].includes(detailInfo.billState)">审核节点详情</van-tabbar-item>

      <!-- 审核节点详情  start-->
      <NodeDetailModal ref="nodeRef" :detailInfo="detailInfo" billType="leaveApply" />
      <!-- 审核节点详情  end -->

      <van-dialog
        v-model:show="showRevoke"
        :confirmButtonDisabled="confirmButtonDisabled"
        title="撤销当前请假单"
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
    </van-tabbar>
  </div>
</template>

<script setup lang="tsx">
import { onMounted, ref, computed, watch, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { closeToast, showConfirmDialog, showLoadingToast, showNotify } from "vant";
import { deleteLeaveList, getLeaveDetail, revokeLeaveList } from "@/api/oaModule";
import { colorSelector } from "@/utils/getStatusColor";
import { useAppStore } from "@/store/modules/app";
import NodeDetailModal from "@/components/NodeDetailModal/index.vue";
import { commonSubmit } from "@/api/common";

interface DetailInfoType {
  holidayType: string;
  remark: string;
  createUserName: string;
  createDate: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  days: string;
  hours: string;
  userName: string;
  billNo: string;
  billState: number;
  approver: string[];
  operationType: number;
  billStateName: string;
}

defineOptions({
  name: "LeaveApplyDetail"
});

const props = defineProps({ id: String });
const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const inputRef = ref(null);
const showApprovalNodePanel = ref(false);
const nodeRef = ref();

const confirmButtonDisabled = ref(false);
const detailInfo = ref<DetailInfoType>({
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

const calcActionBtn = computed(() => {
  return detailInfo.value.operationType === 2 || detailInfo.value.billState === 1 || detailInfo.value.billState === 2;
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
  getLeaveDetail({ id }).then((res) => {
    detailInfo.value = res.data;
  });
};

const handleAction = (actionType) => {
  if (actionType === "revoke") {
    showRevoke.value = true;
    return;
  }
  showConfirmDialog({
    message: `您确定要${actionType === "del" ? "删除" : actionType === "submit" ? "提交" : "撤销"}当前请假单吗`,
    confirmButtonColor: "red",
    beforeClose: (action) => {
      return new Promise((resolve) => {
        if (action === "confirm") {
          let actionRes;
          if (actionType === "del") {
            actionRes = deleteLeaveList({ id: props.id });
          } else if (actionType === "submit") {
            actionRes = commonSubmit({
              billNo: detailInfo.value.billNo,
              billId: "10001"
            });
          }
          actionRes.then((res) => {
            if (res.data) {
              resolve(true);
              showNotify({ type: "success", message: (res as any).message });
              setTimeout(() => router.push("/oa/leaveApply"), 100);
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

const viewAuditNodeDetail = () => {
  if (nodeRef.value) {
    nodeRef.value.showApprovalNodePanel = true;
  }
};

// 点击修改跳转到添加页面并且携带参数，修改标志以及记录id
const changeBottomBar = (active) => {
  switch (active) {
    case 1:
      router.push({
        path: "/oa/leaveApply/add",
        query: { id: props.id, mode: "edit" }
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
    if (newVal.params.id) {
      getDetailInfo(newVal.params.id);
    }
  },
  { immediate: true }
);

onMounted(() => {
  appStore.setNavTitle("请假单详情");
});
</script>

<style lang="scss" scoped>
.detail-page {
  padding: 60px 80px 120px;
  margin-bottom: 80px;

  .des-item {
    margin-bottom: 24px;
    font-size: 28px;

    .label {
      width: 160px;
    }

    .value {
      font-weight: 600;
      flex: 1;
    }
  }
  .user-title {
    margin-bottom: 100px;
    font-size: 30px;
  }
}
</style>
