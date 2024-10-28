<template>
  <van-dialog
    v-for="(options, index) in dialogStore"
    :key="index"
    v-bind="options"
    v-model:show="options.show"
    @open="onOpen(options, index)"
    @close="onClose(options, index)"
    @cancel="onCancel(options, index)"
    @confirm="onConfirm(options, index)"
  >
    <component v-bind="options?.props" :is="options.contentRender({ options, index })" @close="() => onClose(options, index)" />
  </van-dialog>
</template>
<script setup lang="ts">
import { dialogStore, type DialogOptions, type EventType } from "./index";
defineOptions({ name: "ReDialog" });

// 事件回调
function eventsCallBack(event: EventType, options: DialogOptions, index: number) {
  if (typeof options[event] === "function") {
    dialogStore.value.splice(index, 1);
    return options[event]({ options, index });
  }
}

function onClose(options: DialogOptions, index: number) {
  eventsCallBack("close", options, index);
}
function onCancel(options: DialogOptions, index: number) {
  eventsCallBack("cancel", options, index);
}
function onConfirm(options: DialogOptions, index: number) {
  eventsCallBack("confirm", options, index);
}
function onOpen(options: DialogOptions, index: number) {
  eventsCallBack("open", options, index);
}
</script>
