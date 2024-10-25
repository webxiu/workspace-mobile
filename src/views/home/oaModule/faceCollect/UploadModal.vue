<template>
  <div class="flex-col ui-w-100 ui-h-100">
    <slot name="header" />
    <CropImage v-show="showCrop" :imageUrl="imageSrc" @submit="onCrop" @cancel="onCancel" />
    <div class="upload-wrap" :class="previewSrc ? 'crop-bg' : ''" v-show="!showCrop">
      <div class="flex-col flex-1">
        <div v-if="!previewSrc" class="flex-col flex-1 just-center align-center">
          <van-uploader v-model="fileList" accept="image/*" :multiple="false" :after-read="afterRead" :before-read="beforeRead" :max-count="maxCount" />
          <div class="ui-ta-c" style="color: #666; font-size: 20px; margin-top: 15px">点击拍照</div>
        </div>

        <div v-else class="flex-col flex-1 just-center align-center">
          <img :src="previewSrc" alt="" class="responsive-image" />
          <div class="mt-50 ui-w-100 flex just-around align-center">
            <van-button type="primary" icon="like-o" @click="onSubmit">提交</van-button>
            <van-button type="success" icon="shrink" @click="onReCrop">裁剪</van-button>
            <van-button type="default" icon="replay" @click="onReCamera">重拍</van-button>
          </div>
        </div>

        <div class="tip-info" v-if="!showCrop && !previewSrc">
          <div class="color-f00"><strong>拍照要求:</strong></div>
          <div style="text-indent: 5px">1.避免出现曝光、过暗、模糊等情况</div>
          <div style="text-indent: 5px">2.对焦清晰、距离适中, 脸部居中无倾斜</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { showNotice } from "@/utils/common";
import CropImage from "@/components/HxCropImage/index.vue";
import { submitFaceCollect, FaceCollectItemType } from "@/api/oaModule";
import { showLoadingToast, closeToast, showConfirmDialog } from "vant";

const props = defineProps<{ userInfo?: FaceCollectItemType }>();
const maxCount = 1;
const showCrop = ref(false);
const fileList = ref<any[]>([]);
const imageSrc = ref<string>("");
const previewSrc = ref<string>("");
const fileBlob = ref<Blob>();
const emits = defineEmits<{ (e: "finish", data: FaceCollectItemType): void }>();

/** 文件校验 */
const beforeRead = (file) => {
  if (!file.type.includes("image")) {
    showNotice("danger", "文件错误, 请上传图片");
    return false;
  }
  return true;
};

/** 选择照片 */
const afterRead = (file) => {
  const fd = new FormData();
  fd.append("files", file.file);
  const _file = file.file;

  if (_file && _file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const blob = new Blob([arrayBuffer], { type: file.type });
      showCrop.value = true;
      fileBlob.value = blob; // 裁剪图片返回Blob, 保持一致使用Blob
      imageSrc.value = URL.createObjectURL(blob);
    };
    reader.readAsArrayBuffer(_file);
  } else {
    imageSrc.value = "";
  }
};

/** 返回&关闭 */
function onReset() {
  fileList.value = [];
  showCrop.value = false;
  imageSrc.value = "";
  previewSrc.value = "";
}

/** 取消裁剪 */
function onCancel() {
  showCrop.value = false;
  if (!previewSrc.value) {
    previewSrc.value = imageSrc.value;
  }
}

/** 裁剪 */
function onCrop(blob) {
  if (blob) {
    showCrop.value = false;
    fileBlob.value = blob;
    previewSrc.value = URL.createObjectURL(blob);
  }
}

/** 重新裁剪 */
function onReCrop() {
  if (fileBlob.value) {
    showCrop.value = true;
  }
}
/** 重拍 */
function onReCamera() {
  if (fileBlob.value) {
    showCrop.value = false;
    imageSrc.value = "";
    previewSrc.value = "";
    fileList.value = [];
  }
}

function checkFile(file) {
  const imgInfo = {
    limit: 2,
    width: 1920,
    height: 1080
  };
  return new Promise<boolean>((resolve) => {
    // 1.检查文件大小
    const fileSizeInMB = file.size / 1024 / 1024;
    if (fileSizeInMB > imgInfo.limit) {
      showNotice("danger", `图片大小:${fileSizeInMB}MB, 不能超过${imgInfo.limit}MB`);
      return resolve(false);
    }

    // 2.检查文件分辨率
    const img = new Image();
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      if (width > imgInfo.width || height > imgInfo.height) {
        showNotice("danger", `图片分辨率为: ${width}x${height}, 不能超过${imgInfo.width}x${imgInfo.height}`);
        resolve(false);
      } else {
        resolve(true);
      }
    };
    img.onerror = () => resolve(false);
    img.src = URL.createObjectURL(file);
  });
}

/** 提交 */
async function onSubmit() {
  const blob = fileBlob.value;
  if (!props.userInfo?.id) return showNotice("danger", "用户不存在");
  if (!blob) return showNotice("danger", "图片获取失败");
  const file = new File([blob], "face.jpg", { type: blob.type });
  // const res = await checkFile(file);
  // if (!res) return;

  const fd = new FormData();
  fd.append("file", file);
  fd.append("id", props.userInfo.id + "");

  showConfirmDialog({ title: "确认提交吗" })
    .then(() => {
      showLoadingToast({ duration: 0, forbidClick: true, message: "处理中..." });
      submitFaceCollect(fd)
        .then(({ data }) => {
          closeToast();
          showNotice("success", "提交成功");
          emits("finish", props.userInfo as FaceCollectItemType);
        })
        .catch((err) => {
          closeToast();
          showNotice("danger", err.toString() || "提交失败");
        });
    })
    .catch(console.log);
}

defineExpose({ onReset });
</script>

<style scoped lang="scss">
.upload-wrap {
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: center;
  overflow: hidden;
  padding: 16px 40px;
  &.crop-bg {
    background: url("@/assets/images/crop_img_bg.png") no-repeat center/cover #2f2f2f;
  }

  :deep(.van-uploader__upload) {
    width: 260px;
    height: 260px;
    background: #e4e4e4;
    border-radius: 20px;
  }

  :deep(.van-uploader__upload-icon) {
    font-size: 140px;
    color: #757575;
  }

  .tip-info {
    font-size: 32px;
    padding-bottom: 50px;
  }
  .responsive-image {
    width: 100%;
    height: 50%;
    object-fit: contain;
    border-radius: 4px;
  }
}
</style>
