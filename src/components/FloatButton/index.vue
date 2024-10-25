<template>
  <div
    class="float-button"
    :style="domStyle"
    ref="floatBtnRef"
    @click.stop="onClick"
    @touchstart="onTouchstart"
    @touchmove="onTouchmove"
    @touchend="onTouchend"
    v-show="show"
  >
    <van-icon :name="icon" :size="size" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useMove } from "@/hooks/useUtils";

interface Props {
  /** 按钮唯一标识(必传) */
  btnKey: string;
  /** 是否显示 */
  show?: boolean;
  /** 按钮图标 */
  icon?: string;
  /** 按钮大小 */
  size?: number;
}
const props = withDefaults(defineProps<Props>(), {
  show: true,
  icon: "plus",
  size: 30
});

const floatBtnRef = ref();
const emits = defineEmits(["click"]);
const { onTouchstart, onTouchmove, onTouchend, domStyle } = useMove(floatBtnRef, `floatBtn_${props.btnKey}`, { left: 320, top: 421 });
const onClick = () => emits("click");
</script>

<style lang="scss" scoped>
.float-button {
  padding: 18px;
  color: #fff;
  z-index: 1000;
  display: flex;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  background-color: #5686ff;
  box-shadow: 2px 3px 6px #bbb;
}
</style>
