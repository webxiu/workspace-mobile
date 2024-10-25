<template>
  <div class="audit-detail">
    <div class="detail-page">
      <template v-if="showTableList">
        <div :key="index" v-for="(item, index) in detailInfoList" style="padding: 20px">
          <div style="margin-bottom: 10px">
            <span class="tag" type="primary">{{ item.formName }}列表</span>
          </div>
          <HxTable :columns="item.columns" :loading="sLoading" :dataList="item.combineList || []" :height="100" :maxHeight="tableHeight" />
        </div>
      </template>
      <van-collapse v-model="activeNames" key="outer" v-show="!showTableList">
        <van-collapse-item
          :title="item.formName || '-'"
          :is-link="detailInfoList.length > 1"
          :border="false"
          :name="index"
          v-for="(item, index) in detailInfoList"
        >
          <div class="des-item">
            <div v-for="el in item.itemList">
              <van-row :wrap="false" v-if="item.formModel === 'info'">
                <van-row v-if="el.itemName">{{ el.itemName }}</van-row>
                <van-col class="label" span="9">{{ el.inputItemName }}</van-col>
                <van-col v-if="el.inputItemModel === 'date'" span="16" class="textright">
                  {{ formatDate(el.inputItemValue) }}
                </van-col>
                <van-col v-else class="value">{{ el.inputItemValue || "无" }}</van-col>
              </van-row>
            </div>
            <div v-if="item.formModel.includes('etail')">
              <!-- accordion -->
              <van-collapse v-model="activeNames1" key="inner">
                <van-collapse-item
                  :title="item.itemList?.length === 1 ? '' : child.itemName || '-'"
                  :is-link="item.itemList?.length > 1"
                  :name="index"
                  :border="false"
                  class="detail-list"
                  v-for="(child, idx) in item.itemList"
                >
                  <van-form @submit="onSubmit" ref="carFormRef">
                    <div class="des-item" v-for="el in child.detailList">
                      <van-row :wrap="false" class="flex-col" v-if="el.readable">
                        <van-col span="24">
                          <!-- <a target="_blank" v-if="el.inputItemModel === 'file' && el.inputItemFieldName !== 'fileList'" :href="vPath + el.inputItemValue">
                            点击预览或下载
                          </a> -->
                          <div class="fieldWrapper" v-if="el.inputItemFieldName === 'applyVehicleUsage'">
                            <div class="lab">
                              {{ el.inputItemName }}
                            </div>
                            <div v-if="el.inputItemValue === null">
                              <van-radio-group
                                v-if="el.readable"
                                :disabled="!el.writable"
                                style="margin-left: 35px"
                                icon-size="16px"
                                direction="horizontal"
                                v-model="el.inputItemValue"
                              >
                                <van-radio v-for="item in vehicleUsageOpts" :key="item.id" :name="+item.optionValue">{{ item.optionName }}</van-radio>
                              </van-radio-group>
                            </div>
                            <div v-else style="margin-left: 35px; font-weight: 600">
                              {{ findOptinNameByOptionValue(el.inputItemValue) }}
                            </div>
                          </div>
                          <!-- 针对变更调整 -->
                          <div
                            v-else-if="el.inputItemFieldName === 'filePath'"
                            class="fieldWrapper"
                            style="display: flex; flex-direction: column; align-items: flex-start"
                          >
                            <div>
                              <div class="lab">
                                {{ el.inputItemName }}
                              </div>
                              <div v-if="el.inputItemValue" style="color: #1989fa" @click="viewAttr(el, 'fileChange')">
                                {{ el.inputItemValue.split("/").at(-1) ?? "" }}
                              </div>
                              <div v-else style="font-size: 12px; padding: 8px 8px 8px 0">暂无附件信息</div>
                            </div>
                          </div>

                          <!-- 针对回签单调整 -->
                          <div
                            v-else-if="el.inputItemFieldName === 'virtualPath'"
                            class="fieldWrapper"
                            style="display: flex; flex-direction: column; align-items: flex-start"
                          >
                            <div>
                              <div class="lab">
                                {{ el.inputItemName }}
                              </div>
                              <div v-if="el.inputItemValue" style="color: #1989fa" @click="viewAttr(el, 'fileChange')">
                                {{ el.inputItemValue.split("/").at(-1) ?? "" }}
                              </div>
                              <div v-else style="font-size: 12px; padding: 8px 8px 8px 0">暂无附件信息</div>
                            </div>
                          </div>

                          <!-- 针对测试报告多文件 -->
                          <div
                            class="fieldWrapper"
                            style="display: flex; flex-direction: column; align-items: flex-start"
                            v-else-if="['fileList', 'newGeneralTemplateEntryVOList'].includes(el.inputItemFieldName) && el.inputItemModel === 'file'"
                          >
                            <div v-if="el.inputItemValue.every((inputVal) => inputVal.fileName)">
                              <div class="lab">
                                {{ el.inputItemName }}
                              </div>
                              <div v-if="el.inputItemValue && Array.isArray(el.inputItemValue) && el.inputItemValue.length">
                                <div v-for="fileItem in el.inputItemValue">
                                  <div style="color: #1989fa" @click="viewAttr(fileItem)">
                                    {{ fileItem.fileName }}
                                  </div>
                                </div>
                              </div>
                              <div v-else style="font-size: 12px; padding: 8px 8px 8px 0">暂无附件信息</div>
                            </div>
                          </div>

                          <div v-else-if="el.inputItemFieldName === 'vehicleSource'" style="pointer-events: none">
                            <van-field v-if="el.readable" readonly :label="el.inputItemName" :formatter="() => calcSource(el.inputItemValue)" />
                          </div>
                          <div v-else-if="el.inputItemModel === 'img' && el.readable && el.inputItemValue">
                            <div class="car-img">{{ el.inputItemName }}</div>
                            <van-image
                              style="margin-left: 10px"
                              v-for="item in el.inputItemValue"
                              :key="item"
                              width="100"
                              height="100"
                              @click="clickImg(BASE_API + item)"
                              :src="`${BASE_API + item}`"
                            />
                          </div>
                          <div v-else>
                            <van-field
                              v-if="el.readable && el.inputItemFieldName !== 'plateNumber'"
                              :readonly="!el.writable"
                              v-model="el.inputItemValue"
                              type="textarea"
                              rows="1"
                              autosize
                              :name="el.inputItemFieldName"
                              :label="el.inputItemName"
                              :formatter="formatter.bind(null, el)"
                              :required="el.required"
                              :placeholder="el.inputItemModel === 'date' ? '' : '请填写' + el.inputItemName"
                              :rules="[
                                {
                                  required: el.required,
                                  message: el.inputItemName + '必填'
                                }
                              ]"
                            />
                            <div v-if="el.readable && el.inputItemFieldName === 'plateNumber'">
                              <van-field
                                :name="el.inputItemFieldName"
                                v-model="el.inputItemValue"
                                readonly
                                :required="el.required"
                                :label="el.inputItemName"
                                placeholder="选择车辆"
                                @click="el.writable && (showPicker = true)"
                                :rules="[
                                  {
                                    required: el.required,
                                    message: el.inputItemName + '必填'
                                  }
                                ]"
                              />
                              <van-popup v-model:show="showPicker" round position="bottom">
                                <van-picker :columns="carSelectOps" @cancel="showPicker = false" @confirm="(v) => onConfirm(v, el)" />
                              </van-popup>
                            </div>
                          </div>
                        </van-col>
                      </van-row>
                    </div>
                  </van-form>
                </van-collapse-item>
              </van-collapse>
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>
      <div class="comments">
        <div class="top-txt">
          <div class="txt">备注</div>
          <div class="icon" @click="clickEditIcon">
            <van-icon size="20" color="#1989fa" name="edit" />
          </div>
        </div>
        <div class="txt-list">
          <van-list v-if="commentList.length">
            <van-cell v-for="(item, idx) in commentList" :key="idx">
              <template #title>
                <div style="display: flex">
                  <div class="img">
                    <van-image round width="35" height="35" src="/avatar2.jpg" />
                  </div>
                  <div class="name" style="padding-left: 12px; font-weight: bold">
                    {{ item.fromUserName }}
                  </div>
                </div>
              </template>
              <template #value>
                <div>{{ item.createDate }}</div>
              </template>
              <template #label>
                <div>{{ item.remarksContent }}</div>
              </template>
              <template #right-icon>
                <van-icon @click="commentIconClick(item)" name="delete-o" size="18" style="padding: 4px 0 0 6px" />
              </template>
            </van-cell>
          </van-list>
          <div v-else style="font-size: 13px; padding-top: 8px; color: #ccc">暂无备注 ~</div>
        </div>
      </div>
    </div>
    <van-tabbar @change="changeBottomBar" v-model="curActive">
      <van-tabbar-item icon="edit" style="display: none"> 此项为占位项 </van-tabbar-item>

      <van-tabbar-item icon="revoke" v-show="route.query.isOperate === 'true' && revokeBtnShow"> 撤销 </van-tabbar-item>
      <van-tabbar-item icon="success" v-show="(route.query.isOperate === 'true' || route.query.tab === '1') && andActionBtnShow"> 审核 </van-tabbar-item>
      <van-tabbar-item icon="replay" v-show="(route.query.isOperate === 'true' || route.query.tab === '1') && andActionBtnShow"> 回退 </van-tabbar-item>
      <van-tabbar-item icon="apps-o"> 更多操作 </van-tabbar-item>
    </van-tabbar>
    <van-dialog v-model:show="showAuditModal" :title="modalTitle" show-cancel-button :before-close="notNodeDetailAction">
      <van-form ref="formRef" validate-trigger="onSubmit">
        <van-cell-group inset style="margin-top: 10px" v-if="curActive === 2">
          <van-field
            v-model="auditReason"
            rows="2"
            autosize
            name="auditSugges"
            type="textarea"
            maxlength="50"
            label="审批意见"
            placeholder="请填写审批意见"
            show-word-limit
            colon
            clearable
            label-align="right"
          />
        </van-cell-group>
        <van-cell-group inset style="margin-top: 10px">
          <van-field
            rows="2"
            v-if="isRevokeAction"
            autosize
            v-model="revokeWhy"
            name="comment"
            type="textarea"
            maxlength="50"
            label="撤消原因"
            placeholder="请填写撤消原因"
            show-word-limit
            colon
            clearable
            required
            label-align="right"
            :rules="[{ required: true, message: '请填写撤消原因' }]"
          />
        </van-cell-group>
        <van-cell-group v-if="curActive === 3">
          <van-field
            v-model="backNode"
            is-link
            readonly
            name="picker"
            label="回退节点"
            show-word-limit
            colon
            autosize
            label-align="right"
            rows="2"
            placeholder="请选择回退节点"
            required
            @click="showBackPicker = true"
            :rules="[{ required: true, message: '请选择回退节点' }]"
          />
          <van-popup v-model:show="showBackPicker" position="bottom">
            <van-picker :columns="backPickerColumns" @confirm="backOnConfirm" @cancel="showBackPicker = false" />
          </van-popup>
          <van-field
            ref="backReasonRef"
            v-model="backReason"
            rows="2"
            name="bkReason"
            autosize
            type="textarea"
            maxlength="50"
            label="回退原因"
            placeholder="请输入回退原因"
            show-word-limit
            colon
            clearable
            required
            label-align="right"
            :rules="[{ required: true, message: '请填写回退原因' }]"
          />
        </van-cell-group>
      </van-form>
    </van-dialog>
    <van-popup
      v-model:show="showApprovalNodePanel"
      safe-area-inset-bottom
      :lock-scroll="false"
      closeable
      @closed="closePopModal"
      position="bottom"
      id="popuppanel"
      :style="{ height: '90%', overflow: 'auto' }"
    >
      <van-nav-bar title="审批节点详情" id="popup-navbar"></van-nav-bar>
      <div
        :style="{
          marginTop: '10px',
          overflowY: 'auto',
          paddingBottom: '24px'
        }"
      >
        <van-steps direction="vertical" :active="curActiveStep">
          <van-step v-for="(item, index) in approvalNodeData.list">
            <template #active-icon>
              <div v-if="curActiveStep == approvalNodeData.list.length - 1 && ['已提交', '审核同意'].includes(item.nodeStatus)">
                <van-icon name="checked" color="#1989fa" :size="15" />
              </div>
              <div v-else style="width: 12px; height: 12px; border-radius: 100%; background-color: #1989fa" />
            </template>
            <template #inactive-icon>
              <div style="width: 12px; height: 12px; border-radius: 100%; background-color: #ccc" />
            </template>
            <template #finish-icon>
              <div v-if="['已提交', '审核同意'].includes(item.nodeStatus)">
                <van-icon name="checked" color="#1989fa" :size="15" />
              </div>
              <div v-else style="width: 12px; height: 12px; border-radius: 100%; background-color: #1989fa" />
            </template>
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
    <van-overlay :show="showOverlay" @click="showOverlay = false">
      <div class="wrapper">
        <div class="block" @click.stop>
          <!-- curUrl -->
          <van-image :src="curUrl" />
        </div>
      </div>
    </van-overlay>
    <!-- 评论底部弹出 -->
    <van-popup v-model:show="showCommentsBottom" position="bottom" @close="commentContent = ''" :style="{ height: '40%', backgroundColor: '#f7f8fa' }">
      <div class="comment-title">添加备注</div>
      <div class="comment-input-outer">
        <van-form ref="commentRef">
          <van-cell-group inset>
            <van-field
              v-model="commentContent"
              :rules="[{ required: true, message: '请填写备注' }]"
              rows="3"
              autosize
              label="备注"
              required
              :label-width="40"
              type="textarea"
              placeholder="请输入备注"
            />
          </van-cell-group>
        </van-form>
      </div>
      <div style="width: 100%; padding: 24px 0 0; text-align: center">
        <van-button type="primary" style="width: 91%" @click="onSaveComment" :loading="btnLoading">保 存</van-button>
      </div>
    </van-popup>
    <van-action-sheet
      v-model:show="showActionMenu"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="onSelectActionMenu"
      @close="
        showActionMenu = false;
        curActive = 0;
      "
      @cancel="
        showActionMenu = false;
        curActive = 0;
      "
    />
  </div>
</template>

<script setup lang="ts">
import { showConfirmDialog, showFailToast, showNotify, showToast } from "vant";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
  addRemarkList,
  auditAuditTask,
  fetchRemarkList,
  deleteRemarkList,
  getAuditTaskDetail,
  DetailListItemType,
  AuditTaskInfoItemType,
  getBackNodesList,
  revokeAuditTask
} from "@/api/infoCenter";
import { getRouteLink } from "@/config/common";
import { useAppStore } from "@/store/modules/app";
import { getCarIsFreeTimeInfo, getCarOptions } from "@/api/outApply";
import { carSourceContantInfo, formatDate } from "@/utils/common";
import { getKKViewUrl } from "@/utils/storage";
import { Base64 } from "js-base64";
import { useUserStore } from "@/store/modules/user";
import { commonBack } from "@/api/common";
import { fetchEnumList } from "@/api/oaModule";
import HxTable, { TableColumnType } from "@/components/HxTable/index.vue";

defineOptions({ name: "auditTaskDetail" });

const vPath = import.meta.env.VITE_IMAGEURL_PREFIX;
const carFormRef = ref();
const showActionMenu = ref(false);
const outApplyDtoList = ref([]);
const carSelectOps = ref([]);
const showPicker = ref(false);
const commentRef = ref();
const btnLoading = ref(false);

const userStore = useUserStore();

defineProps({ id: String });
const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const formRef = ref(null);
const curActive = ref(0);
const curActiveStep = ref(0);
const detailInfoList = ref<Array<AuditTaskInfoItemType | any>>([]);
const auditReason = ref("");
const approvalNodeData: any = reactive({ list: [] });
const showApprovalNodePanel = ref(false);
const backReason = ref("");
const revokeWhy = ref("");
const backNode = ref("");
const modalTitle = ref("");
const showAuditModal = ref(false);
const isBackAction = ref(false);
const showBackPicker = ref(false);
const backPickerColumns = ref([]);
const isRevokeAction = ref(false);
const showNodeDetailPanel = ref(false);
const backToActivityId = ref("");
const nodeDetailData: any = ref({});
const commentList: any = ref([]);
const showCommentsBottom = ref(false);
const commentContent = ref("");

const activeNames = ref([0, 1]);
const activeNames1 = ref([0, 1]);
const andActionBtnShow = ref(false);
const revokeBtnShow = ref(false);
const curUrl = ref("");
const showOverlay = ref(false);
const vehicleUsageOpts: any = ref([]);
const deliverablesChangeModeOpts = ref<any[]>([]);
const BASE_API = import.meta.env.VITE_BASE_API;
const sLoading = ref(false);
const tableHeight = computed(() => window.innerHeight - 260);

/** 是否表格展示 */
const showTableList = computed(() => {
  const isView = route.query.type === "view";
  const hasList = detailInfoList.value.some((s) => s.itemList && s.itemList.length > 1);
  return isView && hasList;
});

const actions = reactive([
  { name: "转审", key: 1 },
  // { name: "加签", key: 2 },
  { name: "审核节点详情", key: 3 }
]);

const clickImg = (url) => {
  curUrl.value = url;
  showOverlay.value = true;
};

const onSelectActionMenu = (val) => {
  switch (val.key) {
    case 1:
      handleAction("changeAudit");
      break;
    case 2:
      handleAction("addAudit");
      break;
    case 3:
      fetchType2DetailInfo();
      handleAction("auditPop");
      break;

    default:
      break;
  }
};

const viewAttr = (fileItem, viewFileType?) => {
  const kkViewUrl = getKKViewUrl();
  if (viewFileType === "fileChange") {
    const vPath = `${kkViewUrl}api${fileItem.inputItemValue}`;
    const url2 = kkViewUrl + "preview/onlinePreview?url=" + encodeURIComponent(Base64.encode(vPath));
    window.location.href = url2;
    return;
  }

  if (fileItem.virtualFileUrl) {
    const vPath = `${kkViewUrl}api${fileItem.virtualFileUrl}`;
    const url2 = kkViewUrl + "preview/onlinePreview?url=" + encodeURIComponent(Base64.encode(vPath));
    window.location.href = url2;
    return;
  }
  if (fileItem.filePath && fileItem.fileName) {
    const vPath = `${kkViewUrl}api${fileItem.filePath}/${fileItem.fileName}`;
    const url2 = kkViewUrl + "preview/onlinePreview?url=" + encodeURIComponent(Base64.encode(vPath));
    window.location.href = url2;
  }
};

const calcSource = (source) => {
  if (/\d/.test(source)) {
    return carSourceContantInfo[source];
  } else {
    return source;
  }
};

// 确认选择
const onConfirm = ({ selectedOptions }, el) => {
  // 查询车辆的空闲状态
  const id = selectedOptions[0].value;
  getCarIsFreeTimeInfo({ id }).then((res) => {
    if (res.data) {
      el.inputItemValue = selectedOptions[0].text;
      showPicker.value = false;
    }
  });
};

const backOnConfirm = ({ selectedOptions, selectedValues }) => {
  backNode.value = selectedOptions[0].text;
  backToActivityId.value = selectedValues[0];
  showBackPicker.value = false;
};

const openDetailOfNode = (nodeName) => {
  showNodeDetailPanel.value = true;
  nodeDetailData.value = approvalNodeData.list.filter((item) => item.nodeName === nodeName)[0];
};

const notNodeDetailAction = (action: string): Promise<boolean> => {
  const { processDefId, processInstId, billNo, billId, taskId } = route.query;

  return new Promise((resolve) => {
    if (action === "cancel") {
      curActive.value = 0;
      resolve(true);
    } else if (action === "confirm") {
      (formRef.value as any)
        .validate()
        .then(() => {
          let defRes;
          if (curActive.value === 1) {
            const revokeData = {
              processDefId,
              processInsId: processInstId,
              billNo,
              taskId,
              ...(formRef.value as any).getValues()
            };
            defRes = revokeAuditTask(revokeData);
          } else if (curActive.value === 2) {
            const auditData: any = {
              processDefId,
              processInsId: processInstId,
              billNo,
              taskId,
              billId,
              comment: (formRef.value as any).getValues().auditSugges
            };
            if (route.query.billNo?.includes("GT")) auditData.dataLists = outApplyDtoList.value;
            defRes = auditAuditTask(auditData);
          } else if (curActive.value === 3) {
            const backData = {
              processInsId: processInstId,
              processDefId,
              billNo,
              taskId,
              comment: (formRef.value as any).getValues().bkReason,
              backToActivityId: backToActivityId.value
            };
            defRes = commonBack(backData);
          }

          defRes
            .then((res: any) => {
              resolve(true);
              if (res.status === 200 || res.data) {
                auditReason.value = "";
                revokeWhy.value = "";
                backNode.value = "";
                backReason.value = "";
                showNotify({ message: res.message, type: "success" });
                if (getRouteLink()) return;

                setTimeout(() => {
                  router.push("/infoCenter/auditTask");
                }, 500);
              } else {
                showNotify({ message: "操作失败，请联系开发人员处理！" });
                return false;
              }
            })
            .finally(() => {
              resolve(true);
              curActive.value = 0;
            });
        })
        .catch(() => {
          resolve(false);
        });
    }
  });
};

const getDetailInfo = () => {
  const { billId, billNo, processDefId, processInstId } = route.query;
  sLoading.value = true;
  getAuditTaskDetail({
    billId,
    billNo,
    processDefId,
    processInsId: processInstId,
    searchType: 1
  })
    .then(({ data }) => {
      if (data?.length) {
        const columns: TableColumnType[] = [];
        sLoading.value = false;
        detailInfoList.value = data;
        data.forEach((item) => {
          item.combineList = item.itemList.map((list) => {
            const itemObj = list.detailList.reduce((acc, cur) => {
              acc[cur.inputItemFieldName] = cur.inputItemValue;
              let render;
              if (cur.inputItemFieldName.includes("Date")) {
                render = ({ row }) => formatDate(row.startDate, "YYYY-MM-DD");
              }
              // 不存在则添加表格列
              if (!columns.find((col) => col.prop === cur.inputItemFieldName)) {
                columns.push({ label: cur.inputItemName.replace(/(\:)/g, ""), prop: cur.inputItemFieldName, render: render });
              }
              return acc;
            }, {} as DetailListItemType);
            return itemObj;
          });
          if (columns.length) columns.unshift({ label: "序号", prop: "index", width: 36, index: true });
          item.columns = columns;
        });
      }
    })
    .catch(() => (sLoading.value = false));
};

const fixedBody = () => {
  let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
  document.body.style.cssText += "position:fixed;width:100%;top:-" + scrollTop + "px;";
};

const closeBody = () => {
  let body = document.body;
  body.style.position = "";
  let top = body.style.top;
  document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top);
  body.style.top = "";
};

const closePopModal = () => {
  curActive.value = 0;
  closeBody();
};

const handleAction = (actionType) => {
  if (actionType === "back") {
    showAuditModal.value = true;
    isBackAction.value = true;
  }
  if (actionType === "revoke") {
    showAuditModal.value = true;
    isRevokeAction.value = true;
  }

  if (actionType === "audit") {
    showAuditModal.value = true;
  }

  if (actionType === "auditPop") {
    fixedBody();
    showApprovalNodePanel.value = true;
  }

  if (actionType === "addAudit") {
    location.href = "/infoCenter/auditTask/addAudit?billNo=" + route.query.billNo;
  }

  if (actionType === "changeAudit") {
    location.href = "/infoCenter/auditTask/changeAudit?billNo=" + route.query.billNo;
  }
};

const fetchNodesList = () => {
  getBackNodesList({
    processInsId: route.query.processInstId,
    processDefId: route.query.processDefId,
    billNo: route.query.billNo
  }).then((res) => {
    if (res.data) {
      backPickerColumns.value = res.data.map((item) => ({
        text: item.activeName,
        value: item.activeId
      }));
    }
  });
};

const fetchType2DetailInfo = () => {
  const { billId, billNo, processDefId, processInstId } = route.query;
  getAuditTaskDetail({
    billId,
    billNo,
    processDefId,
    processInsId: processInstId,
    searchType: 2
  }).then((res: any) => {
    if (res.data) {
      let flag = res.data.canApprovalFlag;

      if (!flag) {
        const delIdx = actions.findIndex((item) => item.name === "转审");
        if (delIdx >= 0) {
          actions.splice(delIdx, 1);
        }
      }
      let revokeBtnFlag = res.data.nodeList.filter((item) => item.nodeName !== "发起人").every((el) => el.nodeStatus !== "审核同意");

      let curPersonName = res.data.nodeList.find((item) => item.nodeName === "发起人")?.approvalName;
      let curLoginUserName = useUserStore().userInfo.userName;

      const canRevokeBtnFlag = curPersonName === curLoginUserName;

      revokeBtnShow.value = revokeBtnFlag && canRevokeBtnFlag;
      andActionBtnShow.value = flag;
      curActiveStep.value = res.data.curActive;
      approvalNodeData.list = res.data.nodeList;
    }
  });
};

const changeBottomBar = (active) => {
  const auditFlowStart = () => {
    // 配置外出申请流的表单参数
    const hasWritableArr = JSON.parse(JSON.stringify(detailInfoList.value)).filter((item) => {
      item.itemList[0].detailList = item.itemList[0].detailList?.filter((el) => el.writable);
      return item;
    });
    const sendHashMapList: any = [];
    hasWritableArr.forEach((item) => {
      const dataHashMap = {};
      item.itemList[0]?.detailList?.forEach((el) => (dataHashMap[el.inputItemFieldName] = el.inputItemValue));
      sendHashMapList.push({
        formModel: item.formModel,
        billId: item.billId,
        dataHashMap
      });
    });
    outApplyDtoList.value = sendHashMapList;
    curActive.value = active;
    // 点击修改跳转到添加页面并且携带参数，修改标志以及记录id
    switch (active) {
      case 1:
        handleAction("revoke");
        modalTitle.value = "撤消原因";
        break;
      case 2:
        handleAction("audit");
        modalTitle.value = "审批意见";

        break;

      case 3:
        fetchNodesList();

        handleAction("back");
        modalTitle.value = "回退操作";

        break;
      case 4:
        showActionMenu.value = true;
        break;

      default:
        break;
    }
  };

  if (active === 2) {
    // 是否需要派车的标志位
    const isNeedCarFlag = detailInfoList.value[0]?.itemList[0]?.detailList?.find((item) => item.inputItemFieldName === "vehicleSource")?.inputItemValue;

    if (!route.query.billNo?.includes("GT") || !isNeedCarFlag) {
      auditFlowStart();
      return;
    }

    // 派车来源为:其他, 只有申请详情->没有派车详情, 直接提交不做校验
    if (!carFormRef.value[1]) {
      return auditFlowStart();
    }

    carFormRef.value[1]
      ?.validate()
      .then(() => {
        auditFlowStart();
      })
      .catch(() => {
        if (!route.query.billNo?.includes("GT")) {
          auditFlowStart();
        } else {
          curActive.value = 0;
          showFailToast({ message: "请完善车牌号、司机信息" });
        }
      });
  } else {
    curActive.value = active;
    auditFlowStart();
  }
};
const formatter = (el, value) => {
  if (el.inputItemModel === "date") return el.inputItemValue ? formatDate(el.inputItemValue) : "";
  if (el.inputItemFieldName === "vehicleSource") return el.inputItemValue;
  if (el.inputItemFieldName === "applyVehicleUsage") return el.inputItemValue ? "是" : "否";

  return value;
};
const onSubmit = (value) => {};

const getCarNumberOptionList = () => {
  getCarOptions({ state: 1 }).then((res: any) => {
    if (res.data) {
      carSelectOps.value = res.data.map((item) => ({
        text: item.plateNumber,
        value: item.id
      }));
    }
  });
};

const clickEditIcon = () => {
  showCommentsBottom.value = true;
};

const onSaveComment = () => {
  commentRef.value
    ?.validate()
    .then(() => {
      btnLoading.value = true;

      addRemarkList({
        billNo: route.query.billNo,
        remarksContent: commentContent.value
      })
        .then((res) => {
          if (res.data) {
            showToast({ message: "添加成功", type: "success" });
            showCommentsBottom.value = false;
            fetchRemarks();
          }
        })
        .finally(() => {
          btnLoading.value = false;
        });
    })
    .catch(console.log);
};

const commentIconClick = (item) => {
  showConfirmDialog({
    title: "温馨提示",
    message: "是否确认删除此条备注"
  })
    .then(() => {
      deleteRemarkList({ id: item.id, billNo: item.billNo }).then((res) => {
        if (res.data) {
          showToast({ message: "删除成功", type: "success" });
          fetchRemarks();
        }
      });
    })
    .catch(console.log);
};

const fetchRemarks = () => {
  fetchRemarkList({ billNo: route.query.billNo }).then((res) => {
    if (res.data) {
      commentList.value = res.data;
    }
  });
};

const findOptinNameByOptionValue = (optionValue) => {
  return vehicleUsageOpts.value.find((item) => item.optionValue == optionValue)?.optionName ?? "";
};

const findModeOptinNameByOptionValue = (optionValue) => {
  return deliverablesChangeModeOpts.value.find((item) => item.optionValue == optionValue)?.optionName ?? "";
};

const getSelectOpts = () => {
  fetchEnumList({ optioncode: "GoOutVehicleUsage,DeliverablesChangeMode" }).then((res) => {
    if (res.data) {
      const result = res.data.find((item) => item.optionCode === "GoOutVehicleUsage")?.optionList || [];
      vehicleUsageOpts.value = result;
      const resultModeName = res.data.find((item) => item.optionCode === "DeliverablesChangeMode")?.optionList || [];
      deliverablesChangeModeOpts.value = resultModeName;
    }
  });
};

onMounted(() => {
  appStore.setNavTitle("业务审批详情");
  getDetailInfo();
  getSelectOpts();
  getCarNumberOptionList();
  fetchType2DetailInfo();
  fetchRemarks();
});
</script>

<style lang="scss" scoped>
:deep(.van-cell__title.van-field__label) {
  label {
    font-weight: normal;
  }
}

:deep(.comment-input-outer .van-cell__value) {
  color: red;
  font-weight: normal;
}

.comments {
  padding: 32px;
}
.comment-title {
  background-color: #fff !important;
  text-align: center;
  padding: 20px 0;
  margin-bottom: 32px;
  font-weight: 600;
  font-size: 30px;
}

.top-txt {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .txt {
    color: var(--van-cell-text-color);
    font-size: var(--van-cell-font-size);
  }
}

:deep(.van-icon:before) {
  background-color: #fff;
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
  font-size: 29px;
  font-weight: bold;
}
.audit-detail {
  height: calc(100vh - 140px);
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
