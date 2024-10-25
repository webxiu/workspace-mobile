<template>
  <div class="wrap flex-col ui-h-100">
    <van-sticky>
      <div class="filter-area">
        <van-search v-model="formData.staffName" show-action shape="round" placeholder="请输入姓名" @search="getData" />
      </div>
    </van-sticky>

    <van-pull-refresh v-model="loading" @refresh="getData" class="flex-1 ui-ovy-a">
      <van-list finished-text="没有更多了" :finished="true" class="p-20 box-border" v-if="dataList.length > 0">
        <van-cell v-for="(item, index) in dataList" :key="item.id" class="border-line mb-16 border-10" style="padding: 0">
          <van-cell value="操作" class="header" is-link @click.stop="onOperate(item)">
            <!-- 使用title插槽来自定义标题 -->
            <template #title>
              <van-badge :content="index + 1" color="#5686ff"></van-badge>
              【{{ item.staffName }} - {{ item.billNo }}】
              <van-tag plain :type="BillStateObj[item.billState]?.type">{{ BillStateObj[item.billState]?.name }}</van-tag>
            </template>
          </van-cell>

          <van-cell class="content">
            <template #title>
              <div v-for="(cell, index) in itemList" :key="index" class="flex color-333">
                <span> <van-icon :name="cell.icon" class="ui-va-m fw-700" /></span>
                <span class="ellipsis">
                  <span class="ml-8 label-colon">
                    <span class="label-name">{{ cell.label }}</span>
                  </span>
                  <span>{{ item[cell.value] }}</span>
                </span>
              </div>
            </template>
          </van-cell>
        </van-cell>
      </van-list>
      <van-empty v-else description="暂无数据" />
      <van-back-top />
    </van-pull-refresh>
    <van-popup v-model:show="showOpt" :style="{ padding: '25px 10px 80px' }" position="bottom" round>
      <div>单据【{{ rowData.billNo }}】处理:</div>
      <van-row class="mt-40">
        <van-col v-for="(item, index) in optList" :key="index" :span="item.span" class="ui-ta-c">
          <van-button :type="item.type" plain :icon="item.icon" size="small" @click="onCommit(item)">{{ item.label }}</van-button>
        </van-col>
      </van-row>
    </van-popup>
    <!--新增按钮-->
    <FloatButton btnKey="resign_apply" icon="plus" @click="onAdd" />
    <HxDrawer ref="maskRef" :destroyOnClose="true" :title="editTitle">
      <Add :type="editType" :row="_formData" @finish="onFinish" />
    </HxDrawer>
  </div>
</template>

<script setup lang="tsx">
import dayjs from "dayjs";
import Add from "./add.vue";
import { commonSubmit } from "@/api/common";
import { ref, onMounted, reactive } from "vue";
import HxDrawer from "@/components/HxDrawer/index.vue";
import FloatButton from "@/components/FloatButton/index.vue";
import { closeToast, showConfirmDialog, showLoadingToast, showToast } from "vant";
import { getLoginInfo } from "@/utils/storage";
import { BillStateObj } from "@/config/constant";
import { ResignApplyItemType, getUserBasicInfo, resignApplyList } from "@/api/oaModule";
import { commonBackLogic } from "@/utils/common";

const loading = ref(false);
const dataList = ref<ResignApplyItemType[]>([]);
const showOpt = ref(false);
const maskRef = ref();
const editTitle = ref("");
const editType = ref<"add" | "edit" | "view">("add");
const rowData = ref<ResignApplyItemType>({} as ResignApplyItemType);
const _formData = ref<ResignApplyItemType>({} as ResignApplyItemType);

const formData = reactive({
  page: 1,
  limit: 30,
  staffName: ""
});

const optList = reactive([
  { label: "提交", name: "submit", type: "success", icon: "certificate", span: 6 },
  { label: "修改", name: "edit", type: "primary", icon: "edit", span: 6 },
  { label: "回退", name: "back", type: "danger", icon: "revoke", span: 6 },
  { label: "查看", name: "view", type: "warning", icon: "orders-o", span: 6 }
]);
const itemList = reactive([
  { label: "姓名", value: "staffName", icon: "contact-o" },
  { label: "工号", value: "staffCode", icon: "coupon-o" },
  { label: "部门", value: "deptName", icon: "hotel-o" },
  { label: "职务", value: "roleName", icon: "medal-o" },
  { label: "入职日期", value: "startDate", icon: "tosend " },
  { label: "离职类别", value: "resignationType", icon: "points " },
  { label: "离职原因", value: "resignationReason", icon: "comment-circle-o" },
  { label: "申请日期", value: "applyDate", icon: "underway-o" }
]);

onMounted(() => getData());

function getData() {
  loading.value = true;
  resignApplyList(formData)
    .then(({ data }) => (dataList.value = data.records || []))
    .finally(() => (loading.value = false));
}

const onOperate = (item: ResignApplyItemType) => {
  showOpt.value = true;
  rowData.value = item;
};

const openDialog = (type: "add" | "edit" | "view", item: ResignApplyItemType) => {
  const userInfo = getLoginInfo();
  editTitle.value = { add: "新增申请", edit: "修改申请", view: "查看申请" }[type];
  editType.value = type;
  showOpt.value = false;
  _formData.value = {
    ...item,
    staffCode: item.staffCode,
    deptName: item.deptName,
    roleName: item.roleName,
    startDate: item.startDate,
    resignationType: item.resignationType,
    resignationReason: item.resignationReason,
    staffName: item.staffName || userInfo.userName,
    applyDate: item.applyDate || dayjs().format("YYYY-MM-DD")
  };
  maskRef.value.open();
  showLoadingToast({ message: "加载中...", loadingType: "spinner", forbidClick: true });
  getUserBasicInfo({ staffCode: userInfo.userCode })
    .then(({ data }) => Object.assign(_formData.value, data[0] || item))
    .finally(() => closeToast());
};

const onAdd = () => {
  openDialog("add", {} as ResignApplyItemType);
};

const onCommit = (item) => {
  if (item.name === "edit") return openDialog("edit", rowData.value);
  if (item.name === "view") return openDialog("view", rowData.value);
  if (item.name === "back") return onBack();
  if (item.name === "submit") return onSubmit();
};

const onSubmit = () => {
  showConfirmDialog({ title: "确认提交吗?" }).then(() => {
    commonSubmit({
      billNo: rowData.value.billNo,
      billId: rowData.value.billId
    }).then(({ data }) => {
      if (!data) return showToast({ message: "提交失败", type: "fail" });
      showToast({ message: "提交成功", type: "success" });
      showOpt.value = false;
      getData();
    });
  });
};

const onBack = () => {
  const row = rowData.value;
  commonBackLogic({ billNo: row.billNo })
    .then((data) => {
      showOpt.value = false;
      getData();
    })
    .catch(console.log);
};

const onFinish = (res) => {
  if (res) {
    getData();
    maskRef.value.close();
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  .label-name {
    width: 120px;
    display: inline-block;
  }
  .content {
    :deep(.van-cell__title) {
      width: 100%;
    }
  }
  .header {
    :deep(.van-cell__title) {
      display: flex;
      align-items: center;
      flex: 70%;
    }
  }

  :deep(.van-cell__value),
  :deep(.van-icon-arrow:before) {
    color: #5686ff;
  }
  :deep(.van-badge--top-right) {
    transform: none;
  }
}
</style>
