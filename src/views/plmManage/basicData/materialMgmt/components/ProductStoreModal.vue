<!-- /*
 * @Author: Hailen
 * @Date: 2024-06-05 15:12:21
 * @Last Modified by:   Hailen
 * @Last Modified time: 2024-06-05 15:12:21
 */ -->

<script setup lang="ts">
import { h, ref, watch } from "vue";
import { menuPageRouter } from "@/config/constant";
import { addDialog } from "@/components/ReDialog";
import { message, showMessageBox } from "@/utils/message";
import ProductStore from "@/views/plmManage/productMgmt/productStore/index.vue";

const props = defineProps({
  isInput: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  modelValue: { type: [String, Number], default: "" }
});

const value = ref();
const rowData = ref();
const emits = defineEmits(["update:modelValue", "select"]);

watch(props, (val) => (value.value = val.modelValue), { immediate: true });

function onRowClick() {
  if (props.disabled || props.readonly) return;
  const { PageUrl, setRouterInfo } = menuPageRouter();
  setRouterInfo(PageUrl.productStore, () => {
    addDialog({
      title: "选择产品",
      props: { tableHeight: 300, isModal: true },
      width: "700px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(ProductStore, { onSelectRow: (v) => (rowData.value = v) }),
      beforeSure: (done, { options }) => {
        const row = rowData.value;
        if (!row) return message("请选择产品", { type: "error" });
        showMessageBox(`确认选择产品型号【${row.productCode}】吗?`).then(() => {
          row.productType = row.productType.split("-")[1].trim();
          emits("update:modelValue", row.productType);
          emits("select", row);
          done();
        });
      }
    });
  });
}
</script>

<template>
  <el-input v-if="isInput" v-model="value" :readonly="props.readonly" :disabled="props.disabled" v-bind="$attrs" @click="onRowClick" />
  <el-button v-else @click="onRowClick" v-bind="$attrs">选择</el-button>
</template>
