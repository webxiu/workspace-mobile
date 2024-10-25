<template>
  <div class="flex-col ui-w-100 ui-h-100">
    <van-nav-bar :title="isAuth ? '验证结果' : '上传二维码'" :left-text="isAuth ? '返回' : ''" :left-arrow="isAuth" @click-left="onReset" />
    <div class="upload-wrap">
      <div v-if="!isAuth" class="flex-col">
        <div class="flex-col flex-1 just-center align-center">
          <van-uploader v-model="fileList" accept="image/*" :multiple="false" :after-read="afterRead" :before-read="beforeRead" :max-count="maxCount" />
          <div style="text-align: center; color: #bbb; font-size: 16px; margin-top: 15px">点击拍照</div>
          <div style="text-align: center; color: #bbb; font-size: 16px">
            <van-button v-if="selectFile" type="primary" size="small" plain @click="reSubmit" class="mt-50">重新处理</van-button>
          </div>
        </div>
        <div class="tip-info">
          <div class="color-f00"><strong>如识别结果不佳, 请检查:</strong></div>
          <div style="text-indent: 5px">1.保持拍摄画面居中、显示最大、无倾斜</div>
          <div style="text-indent: 5px">2.尽可能包含二维码和校验数字</div>
          <div style="text-indent: 5px">3.避免出现曝光、破损、过暗、丝印模糊等情况</div>
        </div>
      </div>
      <ResultInfo v-else :dataList="resultList" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ResultInfo from "./ResultInfo.vue";
import { codeCompare, CompareResultItemType } from "@/api/common";
import { showToast, showLoadingToast, closeToast, showNotify } from "vant";

const maxCount = 1;
const isAuth = ref(false); // 是否校验完成
const fileList = ref<any[]>([]);
const selectFile = ref<File>();
const resultList = ref<CompareResultItemType[]>([]);

// 返回布尔值
const beforeRead = (file) => {
  if (!file.type.includes("image")) {
    showToast("请上传图片");
    return false;
  }
  return true;
};

const reSubmit = () => {
  afterRead(selectFile);
};
const afterRead = (file) => {
  const fd = new FormData();
  fd.append("files", file.file);
  showLoadingToast({ duration: 0, forbidClick: true, message: "解析中..." });
  codeCompare(fd)
    .then(({ data }) => {
      closeToast();
      showNotify({ type: "success", message: "处理完成", duration: 5000 });
      resultList.value = data.qrCodeVerifyDataVOS || [];
      isAuth.value = true;
      selectFile.value = undefined;
    })
    .catch((err) => {
      closeToast();
      selectFile.value = file;
      showNotify({ type: "danger", message: err.toString() || "处理失败", duration: 5000 });
    });
};

function onReset() {
  fileList.value = [];
  isAuth.value = false;
  selectFile.value = undefined;
}

defineExpose({ onReset });
</script>

<style scoped lang="scss">
.upload-wrap {
  display: flex;
  flex: 1;
  justify-content: center;
  overflow: hidden;
  padding: 16px;

  :deep(.van-uploader__upload) {
    width: 300px;
    height: 300px;
  }

  :deep(.van-uploader__upload-icon) {
    font-size: 140px;
  }

  .tip-info {
    font-size: 28px;
    padding-bottom: 30px;
  }
}
</style>
