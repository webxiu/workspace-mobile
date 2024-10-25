<template>
  <div class="cropper-container">
    <img ref="imageRef" :src="imageUrl" alt="图片加载失败" @load="onLoad" @error="onError" class="flex-1" />
    <div class="cropper-footer">
      <van-button type="primary" icon="passed" @click="getCroppedImage">确定</van-button>
      <van-button type="warning" icon="close" @click="emits('cancel')" style="margin-left: 20%">取消</van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { showNotice } from "@/utils/common";
import { onBeforeUnmount, ref } from "vue";

defineProps<{ imageUrl: string }>();
const emits = defineEmits<{
  (e: "cancel"): void;
  (e: "submit", blob: Blob | null): void;
}>();
const cropper = ref<Cropper>();
const imageRef = ref<HTMLImageElement>();

onBeforeUnmount(onError);

function onLoad() {
  if (imageRef.value) {
    cropper.value = new Cropper(imageRef.value, {
      viewMode: 1,
      zoomable: true,
      scalable: true
      // aspectRatio: 1,
      // crop: (event) => console.log(event.detail)
    });
  }
}

function onError() {
  cropper.value?.destroy();
}

const getCroppedImage = () => {
  const cropCanvas = cropper.value?.getCroppedCanvas();
  if (!cropCanvas) return showNotice("danger", "图片裁剪失败");
  cropCanvas?.toBlob((blob) => {
    emits("submit", blob);
  }, "image/jpeg");
};
</script>

<style lang="scss" scoped>
.cropper-container {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
  flex-direction: column;

  .cropper-footer {
    position: absolute;
    left: 0;
    bottom: 4%;
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>
