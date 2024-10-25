<template>
  <div class="dynamic-item ui-w-100" style="margin: -1px -1px">
    <div class="flex flex-1 align-center ui-w-100" v-for="(item, index) in dataList" :key="item.id">
      <el-form-item
        label="数量"
        class="flex-1"
        :prop="'quoteList.' + index + '.count'"
        :rules="[{ required: true, message: '请输入报价数量', trigger: 'blur' }]"
      >
        <el-input-number v-model="item.count" placeholder="请输入数量" :controls="false" clearable />
      </el-form-item>
      <el-form-item label="金额" class="flex-1" :prop="'quoteList.' + index + '.price'" :rules="{ required: true, message: '请输入报价金额', trigger: 'blur' }">
        <el-input-number v-model="item.price" placeholder="请输入价格" :controls="false" clearable />
      </el-form-item>
      <el-form-item label-width="0px" style="border-left: 0px">
        <el-button @click.prevent="removeAction(item)" type="danger" size="small" :icon="Delete">删除</el-button>
      </el-form-item>
    </div>
    <el-form-item label-width="0px" style="border-left: 0px; border-bottom: 1px solid #111">
      <el-button @click="addAction" :icon="Plus" type="primary" class="ml-20">新增</el-button>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Plus, Delete } from "@element-plus/icons-vue";
import { v4 as uuidv4 } from "uuid";
import { onMounted } from "vue";

interface Props {
  modelValue: DomainItem[];
}

export interface DomainItem {
  price: number;
  count: number;
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => []
});

const emits = defineEmits(["update:modelValue"]);
const dataList = ref<DomainItem[]>(props.modelValue);
onMounted(() => {
  if (props.modelValue.length === 0) {
    addAction();
  }
});

watch(props, (val) => {
  dataList.value = val.modelValue || [];
});

function addAction() {
  dataList.value.push({ id: uuidv4(), price: undefined, count: undefined });
  emits("update:modelValue", dataList.value);
}

function removeAction(item: DomainItem) {
  dataList.value = dataList.value.filter((f) => f.id !== item.id);
  emits("update:modelValue", dataList.value);
}
</script>
<style lang="scss">
.dynamic-form-item > .el-form-item__content {
  padding: 0px;
}
.dynamic-item {
  display: flex;
  flex-direction: column;
  .el-form-item__label {
    display: inline-flex !important;
    justify-content: center !important;
    align-items: center !important;
  }
  .el-form-item__content {
    padding: 8px;
  }
}
</style>
