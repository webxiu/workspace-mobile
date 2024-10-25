<template>
  <div class="ui-h-100 flex">
    <HxSign :imgArr="imgArr" :handleImg="onHandleImg" />
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { SignStatus } from "../config";
import HxSign, { SignProp } from "@/components/HxSign/index.vue";
import {
  showConfirmDialog,
  showDialog,
  showToast,
  showLoadingToast,
} from "vant";
import {
  getSignature,
  getPreviewSignature,
  submitSignature,
} from "@/api/oaModule";

const route = useRoute();
const imgArr = ref<string[]>([]);
const loading = ref<boolean>(false);
const emits: any = defineEmits(["onSubmit"]);

onMounted(() => {
  onGetSignature();
});

// 获取签名图片
const onGetSignature = () => {
  const showLoading = showLoadingToast({
    message: "加载中...",
    forbidClick: true,
  });
  getSignature({ detailId: route.params.id })
    .then(({ data }) => (imgArr.value = [data.image1, data.image2]))
    .catch(() => showToast({ message: "获取签名失败", position: "top" }))
    .finally(() => {
      const timer = setTimeout(() => {
        showLoading.close();
        clearTimeout(timer);
      }, 1000);
    });
};

// 确认签名
const onHandleImg = (data: SignProp) => {
  const imgStr = data.image;
  loading.value = true;
  if (!imgStr) {
    showToast({ message: "请输入签名", position: "top" });
    return;
  }
  getPreviewSignature({ appId: route.params.id })
    .then((res) => {
      if (
        ![SignStatus.noSign, SignStatus.exception].includes(res.data[0]?.status)
      ) {
        showDialog({
          title: "重复提交提示:",
          message: "只有在考勤明细处于【待签名、异常反馈】状态，方可提交签名！",
          theme: "round-button",
          confirmButtonText: "确认",
        });
        loading.value = false;
        return;
      }

      showConfirmDialog({ title: "", message: "您确定要提交当前签名吗？" })
        .then(() => onSubmitSignature(imgStr))
        .finally(() => (loading.value = false));
    })
    .catch((err) => {
      loading.value = false;
      showToast({ message: "网络错误", position: "top" });
    });
};

// 提交签名
const onSubmitSignature = (imgStr) => {
  const [image1, image2] = imgStr.split(",");
  submitSignature({
    detailId: route.params.id,
    userCode: route.query.userCode,
    image1: image1 + ",",
    image2: image2,
  })
    .then((res) => {
      emits("onSubmit", 0, true);
      showDialog({
        title: "签名成功！",
        theme: "round-button",
        confirmButtonText: "确定",
        confirmButtonColor: "green",
      });
    })
    .finally(() => (loading.value = false));
};
</script>
