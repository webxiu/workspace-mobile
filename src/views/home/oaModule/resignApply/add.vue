<template>
  <HxForm
    ref="formRef"
    :formData="formData"
    :formConfigs="formConfigs({ type })"
    :submitColProp="{ span: 18 }"
    :resetColProp="{ span: 6 }"
    :showSubmit="['add', 'edit'].includes(type)"
    :showReset="['add', 'edit'].includes(type)"
    @submit="onSubmit"
  />
</template>

<script setup lang="tsx">
import { ref, watch } from "vue";
import HxForm, { FormConfigItemType } from "@/components/HxForm/index.vue";
import { addResignApply, ResignApplyItemType, updateResignApply } from "@/api/oaModule";
import DatePicker from "@/components/HxForm/DatePicker.vue";
import { showConfirmDialog, showToast } from "vant";
import { BillState } from "@/config/constant";

const props = withDefaults(defineProps<{ type: "add" | "edit" | "view"; row?: ResignApplyItemType }>(), {
  row: () => ({} as ResignApplyItemType)
});

const formData = ref(props.row);
const emits = defineEmits(["finish"]);

// 离职类别
const resignType = [
  { label: "正常离职", value: "正常离职" },
  { label: "急辞", value: "急辞" },
  { label: "试用期不合格", value: "试用期不合格" },
  { label: "解除劳动合同关系", value: "解除劳动合同关系" },
  { label: "其他", value: "其他" }
];

watch(props, () => (formData.value = props.row), {
  immediate: true,
  deep: true
});

const formConfigs = ({ type }): FormConfigItemType[] => {
  return [
    { label: "姓名", name: "staffName", readonly: type === "view", placeholder: "请输入" },
    { label: "工号", name: "staffCode", readonly: type === "view", placeholder: "请输入" },
    { label: "部门", name: "deptName", readonly: type === "view", placeholder: "请选择", rules: [{ required: true, message: "请填写用户名" }] },
    { label: "职务", name: "roleName", readonly: type === "view", placeholder: "请选择" },
    {
      label: "入职日期",
      name: "startDate",
      readonly: type === "view",
      placeholder: "请选择",
      rules: [{ required: true, message: "入职日期不能为空" }],
      render: ({ formModel, row }) => <DatePicker v-model={formModel[row.name]} readonly={type === "view"} />
    },
    {
      label: "离职类别",
      name: "resignationType",
      readonly: type === "view",
      clearable: true,
      placeholder: "请选择",
      slots: ({ formModel, row }) => ({
        input: () => (
          <van-radio-group v-model={formModel[row.name]} direction="horizontal" shape="square" class="readonly" disabled={type === "view"}>
            {resignType.map((item) => (
              <van-radio key={item.value} name={item.value} class="mb-8">
                {item.label}
              </van-radio>
            ))}
          </van-radio-group>
        )
      })
    },
    {
      label: "申请日期",
      name: "applyDate",
      readonly: type === "view",
      placeholder: "请选择",
      rules: [{ required: true, message: "开始日期不能为空" }],
      render: ({ formModel, row }) => <DatePicker v-model={formModel[row.name]} />
    },
    {
      label: "离职原因",
      name: "resignationReason",
      readonly: type === "view",
      placeholder: "请输入",
      type: "textarea",
      rows: 3,
      maxlength: 30,
      showWordLimit: true
    }
  ];
};

const onSubmit = (values) => {
  if (props.type === "edit" && ![BillState.submit, BillState.reject].includes(props.row.billState)) {
    return showToast({ message: "只有待提交和重新审核的单据才能修改", position: "top" });
  }
  showConfirmDialog({ title: "确认提交?" })
    .then(() => {
      const reqApi = { add: addResignApply, edit: updateResignApply };
      reqApi[props.type]({ ...props.row, ...values }).then((res) => {
        const title = { add: "新增", edit: "修改" }[props.type];
        emits("finish", res.data);
        showToast({ message: res.data ? `${title}成功` : `${title}失败`, position: "top" });
      });
    })
    .catch(console.log);
};
</script>
