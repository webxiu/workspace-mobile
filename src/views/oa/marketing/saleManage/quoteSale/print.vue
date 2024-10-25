<template>
  <div class="sale-wrap" v-loading="loading">
    <div class="flex-col align-center">
      <!-- <img src="@/assets/logo/print_color_logo.png" width="100%" /> -->
      <p class="title">销售报价单</p>
    </div>
    <EditForm
      ref="formRef"
      size="small"
      :formInline="formData"
      :formItemGutter="0"
      :formRules="formRules"
      :formProps="{ labelWidth: '150px', requireAsteriskPosition: 'right', inlineMessage: true }"
      :formConfigs="formConfigs({ formData, customList, billNoList })"
      class="border-form"
    />
    <title-cate name="报价" class="mt-20 mb-10" />
    <pure-table
      border
      row-key="id"
      :adaptive="true"
      align-whole="left"
      size="small"
      :data="dataList"
      :columns="columns"
      highlight-current-row
      :show-overflow-tooltip="true"
      style="margin-bottom: 20px"
    />
    <pure-table
      border
      row-key="id"
      :adaptive="true"
      align-whole="left"
      size="small"
      :data="dataList2"
      :columns="columns2"
      highlight-current-row
      :show-overflow-tooltip="true"
    />
    <title-cate name="BOM" class="mt-20 mb-10" />
    <pure-table
      border
      :height="200"
      row-key="id"
      :adaptive="true"
      align-whole="left"
      size="small"
      :data="dataList3"
      :columns="columns3"
      highlight-current-row
      :show-overflow-tooltip="true"
    >
      <template #operation="{ row }">
        <el-button size="small" type="primary" @click.stop="onCalculatePrice(row)">采购核价</el-button>
      </template>
    </pure-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import EditForm from "@/components/EditForm/index.vue";
import { formRules, formConfigs } from "./utils/config";
import { customListQuoteApply, kingDeeSaleList, QuoteApplyListItemType } from "@/api/oaManage/marketing";
import { setColumn, tableEditRender } from "@/utils/table";

const props = defineProps<{ row?: QuoteApplyListItemType }>();

const formRef = ref();
const formData = reactive({ ...props.row });
const loading = ref(false);
const customList = ref<any[]>([]);
const billNoList = ref<any[]>([]);
const dataList = ref<any[]>([]);
const dataList2 = ref<any[]>([]);
const dataList3 = ref<any[]>([]);
const columns = ref<TableColumnList[]>([]);
const columns2 = ref<TableColumnList[]>([]);
const columns3 = ref<TableColumnList[]>([]);

onMounted(() => {
  getOptions();
  getColumnConfig();
  dataList.value = [
    {
      kkk_1: "10",
      kkk_2: "10.2",
      kkk_3: "45.6",
      kkk_4: "10.2",
      kkk_5: "2024-10-22"
    }
  ];
  const countList = props.row.quoteQuantityLists;
  countList.forEach((item, index) => {
    const item1 = {
      aaa_1: `(数量${index + 1})`,
      aaa_2: "21.6",
      aaa_3: "21.6",
      aaa_4: "",
      aaa_5: "",
      aaa_6: "21.6",
      aaa_7: "21.6",
      aaa_8: "21.6",
      aaa_9: "21.6",
      aaa_10: "21.6"
    };
    const item2 = {
      aaa_1: `(数量${index + 1})参考占比收入`,
      aaa_2: "10.2",
      aaa_3: "10.2",
      aaa_4: "",
      aaa_5: "",
      aaa_6: "10.2",
      aaa_7: "10.2",
      aaa_8: "10.2",
      aaa_9: "10.2",
      aaa_10: "10.2"
    };
    dataList2.value.push(item1);
    dataList2.value.push(item2);
  });

  dataList3.value = [
    {
      bbb_1: "物料编码",
      bbb_2: "物料名称",
      bbb_3: "规格型号",
      bbb_4: "物料属性",
      bbb_5: "计价单位",
      bbb_6: "计价单位数量",
      bbb_7: "材料单价来源",
      bbb_8: "采购日期",
      bbb_9: "材料单价",
      bbb_10: "材料金额"
    },
    {
      bbb_1: "物料编码2",
      bbb_2: "物料名称2",
      bbb_3: "规格型号2",
      bbb_4: "物料属性2",
      bbb_5: "计价单位2",
      bbb_6: "计价单位数量2",
      bbb_7: "材料单价来源2",
      bbb_8: "采购日期2",
      bbb_9: "材料单价2",
      bbb_10: "材料金额2"
    }
  ];
});

function getOptions() {
  const p1 = customListQuoteApply({});
  const p2 = kingDeeSaleList({ page: 1, limit: 10000 });
  loading.value = true;
  Promise.all([p1, p2])
    .then(([data1, data2]) => {
      customList.value = data1.data || [];
      billNoList.value = data2.data.records || [];
    })
    .finally(() => (loading.value = false));
}

// 编辑表格
const editCell_1 = tableEditRender();
const editCell_2 = tableEditRender();

const getColumnConfig = async () => {
  const columnData: TableColumnList[] = [
    { label: "上一订单数量(PCS)", prop: "kkk_1", align: "center", minWidth: 160 },
    { label: "上一订单售价(USD)", prop: "kkk_2", align: "center" },
    { label: "上一订单毛利率(%)", prop: "kkk_3", align: "center" },
    { label: "上一订单汇率", prop: "kkk_4", align: "center" },
    { label: "上一订单日期", prop: "kkk_5", align: "center" }
  ];
  const columnData2: TableColumnList[] = [
    {
      label: "变动成本",
      prop: "aaa_t",
      align: "center",
      minWidth: 160,
      children: [
        {
          label: "类别",
          prop: "aaa_m1",
          align: "center",
          children: [{ label: "MOQ", prop: "aaa_1", align: "center", minWidth: 160 }]
        },
        {
          label: "不含数金额",
          prop: "aaa_m1",
          align: "center",
          children: [
            { label: "裸机材料", prop: "aaa_2", align: "center" },
            { label: "包材", prop: "aaa_3", align: "center" },
            { label: "人工成本", prop: "aaa_4", align: "center", cellRenderer: (data) => editCell_1.editCellRender({ type: "input", data, isEdit: true }) },
            { label: "制造费用", prop: "aaa_5", align: "center", cellRenderer: (data) => editCell_1.editCellRender({ type: "input", data, isEdit: true }) },
            { label: "单机成本合计", prop: "aaa_6", align: "center", minWidth: 180 },
            { label: "单位边际贡献", prop: "aaa_7", align: "center", minWidth: 180 },
            { label: "出口报价(美金)", prop: "aaa_8", align: "center", minWidth: 180 },
            { label: "内销报价(人民币)", prop: "aaa_9", align: "center", minWidth: 180 },
            {
              label: "公司需求毛利率(%)",
              prop: "aaa_10",
              align: "center",
              minWidth: 180,
              cellRenderer: (data) => editCell_1.editCellRender({ type: "input", data, isEdit: true })
            }
          ]
        }
      ]
    }
  ];

  const columnData3: TableColumnList[] = [
    { label: "物料编码", prop: "bbb_1", align: "center", cellRenderer: (data) => editCell_2.editCellRender({ type: "input", data, isEdit: true }) },
    { label: "物料名称", prop: "bbb_2", align: "center", cellRenderer: (data) => editCell_2.editCellRender({ type: "input", data, isEdit: true }) },
    { label: "规格型号", prop: "bbb_3", align: "center", cellRenderer: (data) => editCell_2.editCellRender({ type: "input", data, isEdit: true }) },
    { label: "物料属性", prop: "bbb_4", align: "center" },
    { label: "计价单位", prop: "bbb_5", align: "center" },
    { label: "计价单位数量", prop: "bbb_6", align: "center" },
    { label: "材料单价来源", prop: "bbb_7", align: "center" },
    { label: "采购日期", prop: "bbb_8", align: "center" },
    { label: "材料单价", prop: "bbb_9", align: "center" },
    { label: "材料金额", prop: "bbb_10", align: "center" }
  ];
  columns.value = setColumn({ columnData: columnData, indexColumn: { hide: true }, radioColumn: { hide: true }, operationColumn: { hide: true } });
  columns2.value = setColumn({ columnData: columnData2, indexColumn: { hide: true }, radioColumn: { hide: true }, operationColumn: { hide: true } });
  columns3.value = setColumn({ columnData: columnData3, indexColumn: { hide: true } });
};

function onCalculatePrice(row) {
  console.log("核算价格", row);
}

function getRef() {
  return formRef.value;
}

defineExpose({ getRef, formData });
</script>

<style lang="scss">
$color: #111;
$size: 16px;

.sale-wrap {
  color: $color;
  font-family: "宋体", Arial, sans-serif, serif;
  .title {
    flex: 1;
    font-size: 30px;
    color: $color;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .el-input__prefix {
    display: none;
  }

  .el-form-item label,
  .el-input__inner,
  .el-textarea__inner {
    font-size: $size;
    font-family: "宋体", Arial, sans-serif, serif;
    color: $color;
    cursor: default;
  }
}
</style>
