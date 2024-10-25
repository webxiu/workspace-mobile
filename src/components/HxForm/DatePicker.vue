<template>
  <van-field v-model="startDate" readonly v-bind="$attrs" @click="!readonly && (showDate = true)" />
  <van-popup v-model:show="showDate" position="bottom">
    <van-date-picker v-model="startDateArr" @confirm="onConfirm" @cancel="showDate = false" />
  </van-popup>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = defineProps<{ modelValue?: string; readonly?: boolean }>();

const showDate = ref(false);
const startDate = ref("");
const emits = defineEmits(["update:modelValue"]);
const startDateArr = computed(() => startDate.value.split("-"));

watch(props, (val) => (startDate.value = val.modelValue || ""), { immediate: true });

const onConfirm = ({ selectedValues }) => {
  showDate.value = false;
  startDate.value = selectedValues.join("-");
  emits("update:modelValue", startDate.value);
};
</script>
