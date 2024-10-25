<template>
  <div class="purchase-wrap" v-loading="loading">
    <div class="flex-col align-center">
      <!-- <img src="@/assets/logo/print_color_logo.png" width="100%" /> -->
      <p class="title">报价申请单</p>
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
  </div>
</template>

<script setup lang="ts">
import { formRules, formConfigs } from "./utils/config";
import EditForm from "@/components/EditForm/index.vue";
import { onMounted, reactive, ref } from "vue";
import { customListQuoteApply, kingDeeSaleList, QuoteApplyListItemType } from "@/api/oaManage/marketing";

const props = defineProps<{ row?: QuoteApplyListItemType }>();

const formRef = ref();
const formData = reactive({ ...props.row });
const loading = ref(false);
const customList = ref<any[]>([]);
const billNoList = ref<any[]>([]);

onMounted(() => {
  getOptions();
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

function getRef() {
  return formRef.value;
}

defineExpose({ getRef, formData });
</script>

<style lang="scss">
$color: #111;
$size: 16px;

.purchase-wrap {
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
