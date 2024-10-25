<template>
  <div ref="maskRef" class="drawer-dialog" :style="{ transition: transition }">
    <van-sticky>
      <van-nav-bar v-bind="navConfig" @click-left="back" />
    </van-sticky>
    <div v-if="showSlot">
      <slot />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { NavBarProps } from "vant";
import { useUtils } from "./useUtils";

interface Props {
  delay?: number;
  title?: string;
  destroyOnClose?: boolean;
  navBarProps?: Partial<NavBarProps>;
}

const props = withDefaults(defineProps<Props>(), {
  delay: 500,
  title: "标题",
  leftText: "返回",
  destroyOnClose: false,
  navBarProps: () => ({ leftArrow: true })
});
const emits = defineEmits(["open", "close", "back"]);
const maskRef = ref();
const showSlot = ref(true);
const navConfig = computed(() => ({ title: props.title, leftText: props.leftText, ...props.navBarProps }));
const transition = computed(() => `all ${props.delay / 1000}s ease-in-out`);

onMounted(() => {
  useUtils(maskRef.value, ({ el, deltaX, duration, direction }) => {
    // 如果向右滑动时间小于300ms，直接关闭
    if (duration < 300 && deltaX > 0 && direction === "right") {
      close(); // 隐藏抽屉
    } else if (deltaX > window.innerWidth / 3 && direction === "right") {
      close(); // 隐藏抽屉
    } else {
      el.style.left = "0"; // 回到左侧
    }
  });
});

const open = () => {
  showSlot.value = true;
  maskRef.value.style.opacity = 1;
  maskRef.value.style.left = "0";
  emits("open");
};

const close = () => {
  maskRef.value.style.opacity = 0;
  maskRef.value.style.transition = transition.value;
  maskRef.value.style.left = "100%";
  const timer = setTimeout(() => {
    if (props.destroyOnClose) showSlot.value = false;
    clearTimeout(timer);
  }, props.delay);

  emits("close");
};
const back = () => {
  close();
  emits("back");
};

defineExpose({ open, close, back });
</script>

<style lang="scss" scoped>
.drawer-dialog {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 100%;
  z-index: 2000;
  background: #fff;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
</style>
