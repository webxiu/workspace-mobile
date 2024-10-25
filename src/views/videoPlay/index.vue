<template>
  <div class="flex-col ui-h-100">
    <video
      ref="videoRef"
      controls
      autoplay
      loop
      style="width: 100%; min-height: 300px; flex: 1; object-fit: contain"
      src="http://192.168.2.202/upload/fiew2.mp4"
      poster="http://192.168.2.202/upload/poster.png"
    ></video>
    <div>
      <div>视频播放</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
const videoRef = ref();
onMounted(() => {
  // showToast({ message: "已经为您静音播放", duration: 3000 });
  videoRef.value.muted = true;
  videoRef.value.play();
});
</script>

<style scoped></style>
