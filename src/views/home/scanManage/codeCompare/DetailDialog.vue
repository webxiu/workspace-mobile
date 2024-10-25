<template>
  <van-popup v-model:show="showBottom" position="bottom" :style="{ height: '75%' }">
    <div class="flex-col ui-h-100">
      <ResultInfo :dataList="infoList" />
      <div class="flex" style="padding: 20px 20px 30px">
        <van-button size="small" class="flex-1" icon="close" type="danger" plain hairline @click="showBottom = false"> 关闭 </van-button>
        <van-button size="small" type="primary" class="ml-10" icon="photo-o" plain hairline @click="onLook"> 预览原图 </van-button>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ResultInfo from "./ResultInfo.vue";
import { showImagePreview, showToast, showLoadingToast, closeToast } from "vant";
import { codeCompareInfo, CodeCompareItemType, CompareResultItemType } from "@/api/common";

const showBottom = ref(false);
const originImg = ref("");
const infoList = ref<CompareResultItemType[]>([]);
const baseApi = import.meta.env.VITE_BASE_API;

function onLook() {
  if (originImg.value) {
    return showImagePreview([baseApi + originImg.value]);
  }
  showToast({ message: "查看失败", icon: "close" });
}
function onDetail(item: CodeCompareItemType) {
  infoList.value = [];
  showBottom.value = true;
  originImg.value = item.filePath;
  showLoadingToast({ message: "加载中...", forbidClick: true, zIndex: 3000 });
  codeCompareInfo({ id: item.id })
    .then(({ data }) => (infoList.value = data))
    .finally(() => closeToast());
}

defineExpose({ onDetail });
</script>
