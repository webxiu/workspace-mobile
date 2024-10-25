<template>
  <div class="report">
    <div id="fullpage">
      <Page1 />
      <Page2 :index="afterParam.newIndex" />
      <Page3 :index="afterParam.newIndex" />
      <Page4 :index="afterParam.newIndex" />
    </div>
    <div class="change-page">
      <span @click="onSwitchPage('down')">上一页</span>
      / <span @click="onSwitchPage('up')">下一页</span>
    </div>
    <div class="page-number">
      <span>{{ afterParam.newIndex + 1 }}/{{ afterParam.pageNum }}</span>
    </div>
    <!-- 弹出框 -->
    <div class="page-type">
      <van-icon name="ellipsis" @click="showRight = true" />
    </div>
    <van-popup
      v-model:show="showRight"
      position="top"
      class="popup-model"
      @close="onClose"
    >
      <van-form class="bg-color" ref="formRef">
        <van-cell-group inset class="bg-color">
          <van-field name="loop" label="循环滚动" class="bg-color">
            <template #input>
              <van-switch v-model="formData.loop" size="small" />
            </template>
          </van-field>
          <van-field name="autoScroll" label="自动播放" class="bg-color">
            <template #input>
              <van-switch v-model="formData.autoScroll" size="small" />
            </template>
          </van-field>
          <van-field name="delay" label="动画时长" class="bg-color">
            <template #input>
              <van-stepper
                v-model="formData.delay"
                min="0.5"
                max="3"
                step="0.1"
                theme="round"
                button-size="18"
                disable-input
              />
            </template>
          </van-field>
          <van-field
            name="animation"
            label="过渡动画"
            style="background: transparent"
          >
            <template #input>
              <van-radio-group
                v-model="formData.animation"
                direction="horizontal"
                icon-size="18"
              >
                <van-radio name="scroll">滚动</van-radio>
                <van-radio name="gradient">渐变</van-radio>
                <van-radio name="rotate">旋转</van-radio>
              </van-radio-group>
            </template>
          </van-field>
        </van-cell-group>
      </van-form>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import "animate.css";
import { ref, onMounted, reactive } from "vue";
import FullPage, { FullPageOption, AfterParamType } from "./lib/fullpage/index";
import Page1 from "./Page1.vue";
import Page2 from "./Page2.vue";
import Page3 from "./Page3.vue";
import Page4 from "./Page4.vue";

const formRef = ref();
const showRight = ref<boolean>(false);
const fullpage = ref<FullPage>();
const afterParam = ref<AfterParamType>({ index: 0, newIndex: 0, pageNum: 0 });
const formData = reactive({
  delay: 1.2,
  loop: true,
  autoScroll: false,
  animation: "scroll",
});

const animateObj = {
  scroll: {
    up: { entry: "animate__fadeInUp", leave: "animate__fadeOutUp" },
    down: { entry: "animate__fadeInDown", leave: "animate__fadeOutDown" },
  },
  gradient: {
    up: { entry: "animate__fadeIn", leave: "animate__fadeOut" },
    down: { entry: "animate__fadeIn", leave: "animate__fadeOut" },
  },
  rotate: {
    up: {
      entry: "animate__rotateInDownRight",
      leave: "animate__rotateOutUpLeft",
    },
    down: { entry: "animate__rollIn", leave: "animate__rollOut" },
  },
};

const options: FullPageOption = {
  delay: 1.2,
  loop: true,
  pressTime: 800,
  autoScroll: false,
  animation_first: "animate__zoomInDown",
  animation_up: animateObj.scroll.up,
  animation_down: animateObj.scroll.down,
  bgColor: ["#3c6cc3", "#4BBFC3", "#4BAF50", "#409EFF"],
  create: ({ pageNum }) => {
    afterParam.value.pageNum = pageNum;
  },
  before: ({ index }) => {},
  after: (param) => (afterParam.value = param),
};

onMounted(() => {
  fullpage.value = new FullPage("#fullpage", options);
});

function onSwitchPage(direction) {
  fullpage.value?.onSwitchPage(afterParam.value.newIndex, direction);
}

function onClose() {
  const values = formRef.value.getValues();
  options.loop = values.loop;
  options.delay = values.delay;
  options.autoScroll = values.autoScroll;
  options.animation_up = animateObj[values.animation].up;
  options.animation_down = animateObj[values.animation].down;
  fullpage.value?.onUpdateOption(options);
}
</script>

<style scoped lang="scss">
.report {
  color: #fff;
  background: #7b7b7b;
}

.change-page {
  font-size: 24px;
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 999;
}

.page-number {
  font-size: 24px;
  position: fixed;
  bottom: 5px;
  right: 5px;
  z-index: 999;
  color: #a5a5a5;
}

.page-type {
  font-size: 40px;
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 999;
}

:deep(.popup-model) {
  height: 30%;
  color: #bbb;
  background: rgb(47 47 47 / 76%);
  .bg-color {
    background-color: transparent;
  }
  .van-field__label {
    color: #fff;
  }
  .van-radio__label {
    color: #fff;
  }
  .van-stepper__input {
    color: #fff;
  }
  .van-switch {
    background: rgb(120 120 128 / 50%);
  }
  .van-switch--on {
    background: var(--van-switch-on-background);
  }
}
</style>
