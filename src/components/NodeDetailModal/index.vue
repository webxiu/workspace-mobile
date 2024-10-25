<template>
  <div>
    <van-popup
      v-model:show="showApprovalNodePanel"
      closeable
      @closed="curActive = 0"
      position="bottom"
      id="popuppanel"
      :style="{ height: '90%', overflow: 'auto' }"
    >
      <van-nav-bar title="审批节点详情" id="popup-navbar"></van-nav-bar>
      <div :style="{ marginTop: '10px', 'overflow-y': 'scroll' }">
        <van-steps direction="vertical" :active="curActiveStep">
          <van-step v-for="(item, index) in approvalNodeData.list">
            <div style="display: flex; justify-content: space-between">
              <div style="display: flex">
                <div class="nodename" style="margin-bottom: 22px; margin-right: 12px">
                  {{ item.nodeName }}
                </div>
                <div class="sp-type" v-if="item.nodeType">
                  <van-tag type="primary">{{ item.nodeType }}</van-tag>
                </div>
              </div>
              <div class="sp-more" v-on:click="openDetailOfNode(item.nodeName)">
                <i class="van-icon van-icon-arrow"></i>
              </div>
            </div>
            <van-row type="flex" class="steprow">
              <van-col span="8">
                <span class="person-firstname">{{ item.firstName }}</span>
                <span class="personname">{{ item.approvalName }}</span>
              </van-col>
              <van-col span="6">
                <span class="sp-status" :style="{ color: item.color }">{{ item.nodeStatus }}</span>
              </van-col>
              <van-col span="10" class="sp-timeparent">
                <span class="sp-time">{{ item.approvalDate }}</span></van-col
              >
            </van-row>
            <van-row type="flex" v-if="item.taskDefId != 'startEvent1' && item.approvalRemark && item.approvalRemark != ''" style="margin-top: 14px">
              <van-col span="8">审批意见：</van-col>
              <van-col span="16">
                {{ item.approvalRemark }}
              </van-col>
            </van-row>
          </van-step>
        </van-steps>
      </div>
    </van-popup>

    <van-popup v-model:show="showNodeDetailPanel" closeable position="bottom" id="popuppanel" :style="{ height: '90%', overflow: 'visible' }">
      <van-nav-bar :title="nodeDetailData.nodeName" id="popup-navbar"></van-nav-bar>
      <div>
        <van-steps direction="vertical" :active="-1">
          <van-step v-for="(item, index) in nodeDetailData.nodeDetailList">
            <van-row type="flex" style="margin-top: -8px; padding-top: 8px">
              <van-col span="8">
                <span class="person-firstname">{{ item.firstName }}</span>
                <span class="personname">{{ item.approvalName }}</span></van-col
              >
              <van-col span="6">
                <span class="sp-status" :style="{ color: item.color }">{{ item.nodeStatus }}</span>
              </van-col>
              <van-col span="10" class="sp-timeparent">
                <span class="sp-time">{{ item.approvalDate }}</span></van-col
              >
            </van-row>
            <van-row type="flex" v-if="item.taskDefId != 'startEvent1' && item.approvalRemark && item.approvalRemark != ''" style="margin-top: 14px">
              <van-col span="8">审批意见：</van-col>
              <van-col span="16">
                {{ item.approvalRemark }}
              </van-col>
            </van-row>
          </van-step>
        </van-steps>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, watch, ref } from "vue";
import { useRoute } from "vue-router";

import { getAuditTaskDetail } from "@/api/infoCenter";

const props = defineProps({ id: String, detailInfo: Object, billType: String });
const route = useRoute();
const curActive = ref(0);
const curActiveStep = ref(0);
const approvalNodeData: any = reactive({ list: [] });
const showApprovalNodePanel = ref(false);
const showNodeDetailPanel = ref(false);
const nodeDetailData: any = ref({});

const andActionBtnShow = ref(false);
const revokeBtnShow = ref(false);

const openDetailOfNode = (nodeName) => {
  showNodeDetailPanel.value = true;
  nodeDetailData.value = approvalNodeData.list.filter((item) => item.nodeName === nodeName)[0];
};

const fetchType2DetailInfo = ({ billId, billNo }) => {
  const reqType = {
    leaveApply: "10001",
    outApply: "10038"
  };
  getAuditTaskDetail({
    billId: reqType[props.billType!],
    billNo,
    searchType: 2
  }).then((res: any) => {
    if (res.data) {
      let flag = res.data.canApprovalFlag;
      let revokeBtnFlag = res.data.nodeList.filter((item) => item.nodeName !== "发起人").every((el) => el.nodeStatus === "审核同意");

      revokeBtnShow.value = revokeBtnFlag;
      andActionBtnShow.value = flag;
      curActiveStep.value = res.data.curActive;
      approvalNodeData.list = res.data.nodeList;
    }
  });
};

watch(
  () => props.detailInfo,
  (newVal) => {
    if ([1, 2].includes(newVal?.billState)) {
      fetchType2DetailInfo({ billId: newVal?.billId, billNo: newVal?.billNo });
    }
  }
);

defineExpose({ showApprovalNodePanel });
</script>

<style scoped lang="scss">
:deep(.van-cell__title.van-field__label) {
  label {
    font-weight: normal;
  }
}

:deep(.van-cell__value) {
  font-weight: 600;
}

:deep(.van-cell) {
  padding-bottom: 5px;
}
.car-img {
  padding-left: 32px;
  margin-top: 20px;
  color: var(--van-cell-text-color);
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  background-color: #fff;
}
.fieldWrapper {
  color: var(--van-field-label-color);
  padding-left: 32px;
  display: flex;
  align-items: center;
  margin-top: 20px;

  .lab {
    margin-right: 12px;
  }
}
.person-firstname {
  width: 40px;
  height: 40px;
  border: 1px solid #75b9e6;
  border-radius: 50%;
  text-align: center;
  line-height: 40px;
  display: inline-block;
  color: white;
  background-color: #75b9e6;
  font-size: 16px;
}
.personname {
  margin-left: 10px;
}
.audit-detail {
  height: calc(100vh - 100px);
  overflow-y: auto;
  .detail-page {
    .des-item {
      margin-bottom: 0;
      font-size: 28px;
      .label {
        font-weight: 700;
        color: gray;
        letter-spacing: 1px;
      }
      .text-info {
        padding-top: 15px;
        max-height: 400px;
        overflow-y: auto;
        word-break: break-all;
        flex: auto;
        padding-left: 30px;
      }
    }
    .user-title {
      margin-top: 60px;
      font-size: 30px;
    }
  }
}
</style>
