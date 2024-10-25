import { reactive, ref } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import ProductStoreModal from "@/views/plmManage/basicData/materialMgmt/components/ProductStoreModal.vue";
import QuoteItem from "../component/QuoteItem.vue";

// 编辑校验
export const formRules = reactive<FormRules>({
  // billNo: [{ required: true, message: "请输入申请单号", trigger: ["blur"] }],
  createDate: [{ required: true, message: "请输入申请日期", trigger: ["blur"] }],
  createUserName: [{ required: true, message: "请输入申请人", trigger: ["blur"] }],
  productCode: [{ required: true, message: "请选择产品编码", trigger: ["blur"] }],
  customerName: [{ required: true, message: "请选择客户名称", trigger: ["blur"] }],
  isRepeatOrder: [{ required: true, message: "请选择是否翻单", trigger: ["blur"] }],
  referenceBillNo: [{ required: true, message: "请选择参考单号", trigger: ["blur"] }],
  referenceMaterialCode: [{ required: true, message: "请选择参考物料编码", trigger: ["blur"] }],
  quoteQuantity: [{ required: true, message: "请输入报价数量", trigger: ["blur"] }],
  processRequirements: [{ required: true, message: "请输入工艺要求", trigger: ["blur"] }],
  powerCableRequirements: [{ required: true, message: "请输入电源线/USB线要求", trigger: ["blur"] }],
  packagingRequirements: [{ required: true, message: "请输入包装要求", trigger: ["blur"] }]
});

// 是否翻单
export const isRepeatOrderList = [
  { label: "是", value: true },
  { label: "否", value: false }
];

export const formConfigs = ({ formData, customList, billNoList }): FormConfigItemType[] => {
  const styleEl = { height: "40px", display: "inline-flex", alignItems: "center" };
  const styleItem = { alignItems: "center" };
  const materialList = ref([]);

  function billNoChange(value: string, isFirst = false) {
    if (!isFirst) formData.referenceMaterialCode = "";
    materialList.value = billNoList?.find((f) => f.FBILLNO === value)?.materialVOS || [];
  }
  billNoChange(formData.referenceBillNo, true);

  return [
    {
      label: "申请单号",
      prop: "billNo",
      class: "center-label",
      colProp: { span: 8 },
      style: styleItem,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="自动生成" style={styleEl} readonly />
    },
    {
      label: "申请日期",
      prop: "createDate",
      class: "center-label",
      colProp: { span: 8 },
      style: styleItem,
      render: ({ formModel, row }) => (
        <el-date-picker
          type="date"
          v-model={formModel[row.prop]}
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择"
          clearable
          style={styleEl}
        />
      )
    },
    {
      label: "申 请 人",
      prop: "createUserName",
      class: "center-label",
      colProp: { span: 8 },
      style: styleItem,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable style={styleEl} />
    },
    {
      label: "产品编码",
      prop: "productCode",
      class: "center-label",
      colProp: { span: 8 },
      style: styleItem,
      render: ({ formModel, row }) => {
        const onSelect = (val) => (formModel[row.prop] = val.productCode);
        return <ProductStoreModal v-model={formModel[row.prop]} isInput={true} placeholder="请选择" onSelect={onSelect} clearable />;
      }
    },
    {
      label: "客户名称",
      prop: "customerName",
      class: "center-label",
      colProp: { span: 8 },
      style: styleItem,
      render: ({ formModel, row }) => (
        <el-tree-select
          v-model={formModel[row.prop]}
          data={customList}
          filterable
          check-strictly
          default-expanded-keys={["0"]}
          node-key="value"
          render-after-expand={false}
          props={{ label: "customerName", value: "customerName" }}
        />
      )
    },
    {
      label: "是否翻单",
      prop: "isRepeatOrder",
      class: "center-label",
      colProp: { span: 8 },
      style: styleItem,
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} placeholder="请选择" value-key="value" class="ui-w-100" style={styleEl}>
          {isRepeatOrderList.map((item) => (
            <el-option key={item.value} label={item.label} value={item.value} />
          ))}
        </el-select>
      )
    },
    {
      label: "参考单号",
      prop: "referenceBillNo",
      class: "center-label",
      colProp: { span: 8 },
      style: styleItem,
      render: ({ formModel, row }) => {
        return (
          <el-tree-select
            v-model={formModel[row.prop]}
            data={billNoList}
            filterable
            check-strictly
            onChange={billNoChange}
            default-expanded-keys={["0"]}
            node-key="FBILLNO"
            render-after-expand={false}
            props={{ label: "FBILLNO", value: "FBILLNO" }}
            // style={styleEl}
          />
        );
      }
    },
    {
      label: "参考物料编码",
      prop: "referenceMaterialCode",
      class: "center-label",
      colProp: { span: 16 },
      style: styleItem,
      render: ({ formModel, row }) => (
        <el-tree-select
          v-model={formModel[row.prop]}
          data={materialList.value}
          filterable
          check-strictly
          node-key="FNUMBER"
          render-after-expand={false}
          props={{ label: "FNAME", value: "FNUMBER" }}
          style={styleEl}
        />
      )
    },
    // {
    //   label: "报价数量",
    //   prop: "quoteQuantity",
    //   class: "center-label",
    //   colProp: { span: 8 },
    //   style: { ...styleItem, height: "auto" },
    //   render: ({ formModel, row }) => <el-input-number v-model={formModel[row.prop]} controls={false} clearable style={styleEl} />
    // },
    {
      label: "工艺要求",
      prop: "processRequirements",
      class: "center-label",
      colProp: { span: 24 },
      style: { ...styleItem, height: "auto" },
      render: ({ formModel, row }) => (
        <el-input v-model={formModel[row.prop]} rows={3} autofocus resize="none" type="textarea" placeholder="请输入" autosize={{ minRows: 3, maxRows: 3 }} />
      )
    },
    {
      label: "电源线/USB线要求",
      prop: "powerCableRequirements",
      class: "center-label",
      colProp: { span: 24 },
      style: { ...styleItem, height: "auto" },
      render: ({ formModel, row }) => (
        <el-input v-model={formModel[row.prop]} rows={3} autofocus resize="none" type="textarea" placeholder="请输入" autosize={{ minRows: 3, maxRows: 3 }} />
      )
    },
    {
      label: "包装要求",
      prop: "packagingRequirements",
      class: "center-label",
      colProp: { span: 24 },
      style: { ...styleItem, height: "auto" },
      render: ({ formModel, row }) => (
        <el-input v-model={formModel[row.prop]} rows={3} autofocus resize="none" type="textarea" placeholder="请输入" autosize={{ minRows: 3, maxRows: 3 }} />
      )
    },
    {
      label: "报价金额及数量",
      prop: "quoteList",
      class: "center-label dynamic-form-item",
      colProp: { span: 24 },
      style: { ...styleItem, height: "auto" },
      slots: { label: ({ label }) => <span class="fz-16 color-111">{label}</span> },
      render: ({ formModel, row }) => <QuoteItem v-model={formModel[row.prop]} />
    }
  ];
};
