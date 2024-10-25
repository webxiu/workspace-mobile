<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-06-23 09:53:49 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-06-23 09:53:49 
 */ -->
<template>
  <div class="mt-40 pl-28 pr-28">
    <div class="title">
      <div class="fz-36 color-111 fw-700">{{ deployKey }}</div>
      <div class="fz-28 color-999 mt-10">{{ billNo }}</div>
    </div>
    <van-form class="pt-10">
      <van-cell-group inset>
        <van-row type="flex" class="mt-28 fz-28" v-for="item in customerOrderList">
          <van-col span="8" class="ui-ta-r fw-700 color-666"> {{ item.label }}： </van-col>
          <van-col span="14" class="ui-ta-l pl-8">{{ item.value }}</van-col>
        </van-row>
      </van-cell-group>
    </van-form>
    <div class="pt-24 pb-24">
      <div class="fw-700 mt-20 mb-20 fz-32 color-111">明细</div>
      <div class="kd-table ui-ovy-a">
        <table v-if="tableColumns.length > 0">
          <thead>
            <tr>
              <td class="row-td" v-for="item in tableColumns">
                {{ item.label }}
              </td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tableData" :key="index">
              <td class="row-td" v-for="(cell, idx) in item" :key="idx">
                <van-text-ellipsis class="table-cell-cont" :content="`${cell.value}`" expand-text="展开" collapse-text="收起" />
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="ui-ta-c p-30" style="border: 1px solid #eee">暂无数据</div>
      </div>
    </div>
    <div class="pb-24">
      <div class="fw-700 mt-20 mb-20 fz-32 color-111">附件列表</div>
      <div class="mb-12 fz-28" v-for="(item, index) in attrFileList" v-if="attrFileList?.length">
        <div @click="onViewItem(item)" :key="item.id" style="color: #1989fa; display: flex; align-items: center">
          <div>
            <div
              style="
                width: 15px;
                height: 15px;
                margin-right: 8px;
                border-radius: 50%;
                font-size: 12px;
                background-color: #1989fa;
                display: flex;
                color: #fff;
                justify-content: center;
                align-items: center;
              "
            >
              {{ index + 1 }}
            </div>
          </div>
          <div style="overflow-wrap: anywhere">
            {{ item.fileName }}
          </div>
        </div>
      </div>
      <div v-else class="fz-28">暂无附件信息</div>
    </div>
    <div class="flex-col mt-30 pb-60">
      <FlowAudit :item="item" v-for="(item, i) in auditNodeList" :key="i" />
    </div>

    <van-tabbar id="detailBottom" active-color="#646566" v-if="auditStatus === '0'">
      <van-tabbar-item @click="onClickAudit('1')" icon="success" style="color: #32cd32"> 审核通过 </van-tabbar-item>
      <van-tabbar-item @click="onClickAudit('2')" icon="revoke"> 驳回重审 </van-tabbar-item>
      <van-tabbar-item @click="onClickAudit('3')" icon="close" style="color: #f00">终止 </van-tabbar-item>
    </van-tabbar>
    <van-overlay :show="showLayer" @click="showLayer = false">
      <div class="flex just-center align-center ui-h-100">
        <div class="approval-form-box">
          <van-form @submit="onSubmit" @click.stop>
            <van-cell-group inset>
              <van-field
                v-model="auditForm.approvalType"
                name="approvalType"
                label="快捷选择意见"
                placeholder="点击选择"
                is-link
                readonly
                @click.stop="showPicker = true"
              />
              <van-popup v-model:show="showPicker" position="bottom" @click.stop>
                <van-picker title="快捷选择" :columns="columns" @confirm="onConfirm" @cancel="showPicker = false" />
              </van-popup>
              <van-field
                v-if="showLayer"
                :required="auditType == '2'"
                :rules="auditType == '2' ? [{ required: true, message: '驳回意见必填' }] : []"
                v-model="auditForm.disposition"
                name="disposition"
                :label="labelText"
                :placeholder="`请输入${labelText}`"
              />
            </van-cell-group>
            <div style="margin: 16px" class="ui-ta-c flex jus-between">
              <van-button round class="mr-80 flex-1" @click.stop="showLayer = false"> 取消 </van-button>
              <van-button round @click.stop type="primary" native-type="submit" class="flex-1" color="#07c160" :loading="loading"> 确认 </van-button>
            </div>
          </van-form>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { reactive, ref, PropType, onMounted, computed } from "vue";
import { useAppStore } from "@/store/modules/app";
import { showToastModel } from "@/utils/getStatusColor";
import { showConfirmDialog, showSuccessToast, showLoadingToast, closeToast } from "vant";
import FlowAudit, { AuditNodeItemType } from "./components/FlowAudit.vue";
import { getRouteLink } from "@/config/common";
import { Base64 } from "js-base64";
import {
  detailsByBillNoforProduce,
  approvalNodeDetails,
  approvalInstanceDetails,
  fastSelectApprovalAdviceList,
  auditPass,
  fetchAttrViewUrl
} from "@/api/infoCenter";
import { getKKViewUrl } from "@/utils/storage";

interface BillNoForProduceType {
  billNo: any;
  fbillNumber: any;
  formId: any;
  status: any;
  processState: any;
  deployKey: any;
  processCreateUserName: any;
  approvalResult: any;
  processStartTime: any;
  approverUserNames: any;
  completedTime: any;
  userCode: any;
  unApprovalCount: any;
  detailMasterResults: Array<Record<string, any>>;
  detailChildrenResults: Array<Record<string, any>>;
  detailChildrenColumns: Array<Record<string, any>>;
  detailFiles: Array<{ fileName: string; id: number }>;
}

defineProps({
  dataList: { type: Array as PropType<any[]>, default: () => [] }
});
const appStore = useAppStore();
const route = useRoute();
const router = useRouter();

const attrFileList = ref<Array<{ fileName: string; id: number }>>([]);

/**
 * auditStatus(隐藏底部菜单): 0:我的待办 1:我的已办 2:我的发起
 */
const { billNo, billType, fbillNumber, deployKey } = route.query;
const auditStatus = (route.query?.auditStatus as string) || "0";

const auditNodeList = ref<AuditNodeItemType[]>([]);
const showLayer = ref<boolean>(false);
const showPicker = ref<boolean>(false);
const loading = ref<boolean>(false);
const auditType = ref<string>("");
const auditForm = reactive({ approvalType: "", disposition: "" });
// 订单采购详情
const customerOrderList = ref<Array<{ label: string; value: any }>>([]);
// 明细表格配置列
const tableColumns = ref<Array<any>>([]);
// 明细表格数据
const tableData = ref<Array<any>>([]);

// 快捷选择(当前选中)
const columns = ref<Array<any>>([]);
// 快捷选择(所有选项)
const auditOptions = reactive({
  agreeOptions: [],
  rejectOptions: [],
  stopOptions: []
});

const onViewItem = (item) => {
  showLoadingToast({ message: "请稍后" });
  fetchAttrViewUrl(item.id)
    .then((res) => {
      if (res.data) {
        closeToast();
        const resPathAndName = res.data;
        const kkViewUrl = getKKViewUrl();

        const vPath = `${kkViewUrl}api${resPathAndName}`;

        const url2 = kkViewUrl + "preview/onlinePreview?url=" + encodeURIComponent(Base64.encode(vPath));

        // window.open(url2);
        window.location.href = url2;
      }
    })
    .catch(() => closeToast());
  // .finally(() => closeToast());
};

onMounted(() => {
  getData();
  appStore.setNavTitle("业务审批详情");
});

const labelText = computed(() => {
  const auditObj = { 1: "通过意见", 2: "驳回原因", 3: "终止原因" };
  return auditObj[auditType.value];
});

const getData = () => {
  showLoadingToast("加载中...");
  // 1.获取采购订单和明细
  detailsByBillNoforProduce({ billNo, billType, fbillNumber, searchType: 1 })
    .then((res: any) => {
      if (!res.data) throw (res as any).message;
      const data: BillNoForProduceType = res.data;
      // 测试采购订单审批
      const sortMasterResults = data.detailMasterResults.sort((a, b) => a.FSEQ - b.FSEQ);
      sortMasterResults.forEach((item) => {
        const label = Object.keys(item).filter((f) => f !== "FSEQ");
        customerOrderList.value.push({
          label: label[0],
          value: item[label[0]]
        });
      });
      // 表格列名称
      const sortColumns = data.detailChildrenColumns.sort((a, b) => a.FSEQ - b.FSEQ);
      sortColumns.forEach((item) => {
        const label = Object.keys(item).filter((f) => f !== "FSEQ");
        if (label[0]) {
          tableColumns.value.push({ label: label[0] });
        }
      });

      // 附件信息列表数据
      attrFileList.value = data.detailFiles || [];

      // 表格行数据(依据sortColumns的列顺序排序)
      tableData.value = data.detailChildrenResults.map((item) => {
        const arr: any = [];
        tableColumns.value.forEach((cell) => {
          Object.keys(item).forEach((key) => {
            if (cell.label === key) arr.push({ label: key, value: item[key] });
          });
        });
        return arr;
      });
      closeToast();
    })
    .catch((err) => {
      const timer = setTimeout(() => {
        closeToast();
        clearTimeout(timer);
      }, 2000);
    });

  // 获取意见下拉框选项
  fastSelectApprovalAdviceList({ billType })
    .then((res) => {
      if (!res.data) throw (res as any).message;
      const data = res.data;
      const agreeList = data[1]?.map((text: string) => ({ text, value: text }));
      const rejectList = data[2]?.map((text: string) => ({
        text,
        value: text
      }));
      const stopList = data[3]?.map((text: string) => ({ text, value: text }));
      auditOptions.agreeOptions = agreeList;
      auditOptions.rejectOptions = rejectList;
      auditOptions.stopOptions = stopList;
    })
    .catch(console.log);

  // 2.获取审批流程
  approvalNodeDetails({ billNo })
    .then((res) => {
      if (!res.data) throw (res as any).message;
      const data: AuditNodeItemType[] = res.data;
      auditNodeList.value = data;
    })
    .catch(console.log)
    .finally(() => getRuningAudit());
};

// 3.获取审批流程(运行中)
const getRuningAudit = () => {
  approvalInstanceDetails({ billNo })
    .then((res) => {
      if (!res.data) throw (res as any).message;
      const data: AuditNodeItemType[] = res.data;
      auditNodeList.value = [...JSON.parse(JSON.stringify(auditNodeList.value)), ...data];
    })
    .catch(console.log);
};

const onClickAudit = (type: string) => {
  if (type === "1") {
    columns.value = auditOptions.agreeOptions;
  } else if (type === "2") {
    columns.value = auditOptions.rejectOptions;
  } else if (type === "3") {
    columns.value = auditOptions.stopOptions;
  }
  showLayer.value = true;
  auditType.value = type;
  auditForm.approvalType = "";
  auditForm.disposition = "";
};

const onConfirm = ({ selectedOptions }) => {
  auditForm.approvalType = selectedOptions[0]?.text;
  auditForm.disposition = selectedOptions[0]?.text;
  showPicker.value = false;
};
// 提交确认
const onSubmit = () => {
  showConfirmDialog({
    title: "德龙电器温馨提示",
    message: "确定要审核该单据吗?"
  }).then((res) => {
    const approvalType = auditType.value;
    const disposition = auditForm.disposition;
    const params = { billNo, billType, approvalType, disposition };
    loading.value = true;
    auditPass(params)
      .then((res) => {
        if (!res.data) throw (res as any).message;
        showSuccessToast("处理成功！");
        if (getRouteLink()) return;
        router.go(-1);
      })
      .catch((err) => showToastModel("fail", err.message, "德龙电器温馨提示"))
      .finally(() => (loading.value = false));
  });
};
</script>

<style lang="scss" scoped>
.kd-table {
  border: 1px solid #eee;
  table {
    border-collapse: collapse;
  }
  .row-td {
    background: rgba(253, 253, 253, 0.5);
    border: 1px solid rgba(234, 239, 243, 1);
    font-size: 28px;
    font-weight: 400;
    color: rgba(63, 63, 63, 1);
    border: 1px solid #d6d6d6;
  }
  thead td.row-td {
    min-height: 38px;
    line-height: 38px;
    padding: 20px 20px;
    font-weight: 700;
    white-space: nowrap;
    min-width: 260px;
  }
  thead {
    display: inline-block;
  }
  tbody {
    display: inline-block;
    overflow-y: auto;
    max-height: 350px;
  }
  tbody td.row-td {
    min-height: 120px;
    padding: 5px;
    padding: 20px 20px;
    line-height: 38px;
    min-width: 260px;
    .table-cell-cont {
      width: inherit;
    }
  }
}
.approval-form-box {
  margin: 20px;
  padding: 40px 20px;
  border-radius: 12px;
  background-color: #d3d3d3;
}
</style>
