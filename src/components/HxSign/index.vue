<template>
  <div class="sign-wrap flex-1 flex-col">
    <van-nav-bar :title="fullImgStr ? '签名预览' : '请在虚线区域內签名'" />
    <div class="flex flex-1 ui-ov-h" ref="signRef">
      <div v-if="!fullImgStr" id="signature" />
      <van-image v-else :src="fullImgStr" alt="图片加载失败" class="sign-img" />
    </div>
    <div class="button-list" v-if="!fullImgStr">
      <van-button icon="revoke" class="flex-1" @click="onRevoke" />
      <van-button icon="replay" class="flex-1" @click="onRecover" style="margin-left: var(--van-padding-base)" />
      <van-button icon="close" class="flex-1" @click="onClear" style="margin-left: var(--van-padding-base)" />
      <Model @change="changeSet" ref="modelRef" />
      <van-button type="primary" class="flex-3" @click="onSubmit"> 确认提交 </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from "vue";
import { SignName } from "./signName";
import { showToast } from "vant";
import Model from "./Model.vue";

/**
 * 手写签名组件签名
 */

export interface SignProp {
  image: string;
  canvas: HTMLCanvasElement;
}

interface Props {
  handleImg: (data: SignProp) => void;
  fullImgStr?: string;
}

const props = withDefaults(defineProps<Props>(), {
  handleImg: () => {},
  imgArr: () => []
});

const signInstance = ref<SignName>();
const signRef = ref<HTMLElement>();
const modelRef = ref();

// 传了数组并且有值不为空
const hasImage = computed(() => {
  return props.fullImgStr;
});

watch(hasImage, () => nextTick(createSign), { immediate: true });

// 创建签名画布
function createSign() {
  if (signRef.value && document.querySelector("#signature")) {
    const { width, height } = signRef.value.getBoundingClientRect();
    signInstance.value = new SignName("#signature", {
      width: width,
      height: height - 10,
      lineWidth: 3,
      lineStyle: "#000",
      fillStyle: "#fff",
      lineCap: "round"
    });
  }
}

// 撤销
function onRevoke() {
  signInstance.value?.onRestore("revoke");
}

function onRecover() {
  signInstance.value?.onRestore("recover");
}

function changeSet(values) {
  signInstance.value?.updateOption(values);
  signInstance.value?.onRestore();
}

function onClear() {
  signInstance.value?.onClear();
  modelRef.value?.onReset();
}

// 提交
function onSubmit() {
  const instance = signInstance.value;
  const isSign = instance?.signStatus();
  const image = instance?.onExport();
  if (isSign && instance) {
    props.handleImg({ image: image ?? "", canvas: instance.canvas });
  } else {
    showToast({ message: "数据为空", position: "top" });
  }
}
</script>

<style scoped lang="scss">
#signature {
  border: 5px dotted #ccc;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 10px;
  width: 100%;
}
.sign-wrap {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  background-color: #fff;
}

.button-list {
  display: flex;
  width: 100%;
  justify-content: space-around;
  padding: 10px 0 30px 0px;
}
.sign-img {
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
  border: 2px solid var(--van-gray-5);
}
</style>
