import { App, ref } from "vue";
import { ButtonProps, DialogProps } from "vant";
import type { CSSProperties, Component, VNode } from "vue";

import MyDialog from "./index.vue";
import { withInstall } from "@/plugins/setupVant";

type EventType = "open" | "close" | "cancel" | "confirm" | "openAutoFocus" | "closeAutoFocus";

interface DialogOptions extends Partial<DialogProps> {
  show: boolean;
  /** 内容区组件的 `props`，可通过 `defineProps` 接收 */
  props?: any;
  /** 自定义内容渲染器 */
  contentRender: ({ options, index }: { options: DialogOptions; index: number }) => VNode | Component;
  /** `Dialog` 打开后的回调 */
  open?: ({ options, index }: { options: DialogOptions; index: number }) => void;
  close?: ({ options, index }: { options: DialogOptions; index: number }) => void;
  cancel?: ({ options, index }: { options: DialogOptions; index: number }) => void;
  confirm?: ({ options, index }: { options: DialogOptions; index: number }) => void;
}

const dialogStore = ref<Array<DialogOptions>>([]);

/**
 * 打开弹框
 * 全屏显示配置class类名为: full-dialog, 移除了内容边距
 */
const addDialog = (options: DialogOptions) => {
  const open = () => {
    dialogStore.value.push(Object.assign(options, { show: true }));
  };
  if (options?.lockScroll) {
    setTimeout(() => {
      open();
    }, 200);
  } else {
    open();
  }
  return {
    options: ref(options)
  };
};

/**
 * @description 更改弹框自身属性值
 * @param value 属性值
 * @param key 属性，默认`title`
 * @param index 弹框索引（默认`0`，代表只有一个弹框，对于嵌套弹框要改哪个弹框的属性值就把该弹框索引赋给`index`）
 */
const updateDialog = (value: any, key = "title", index = 0) => {
  dialogStore.value[index][key] = value;
};

const ReDialog = withInstall(MyDialog);
export type { DialogOptions, EventType };
export { dialogStore, ReDialog, addDialog, updateDialog };
