<template>
  <HxSign :fullImgStr="fullImgStr" :handleImg="onHandleImg" />
</template>

<script setup lang="ts">
import { onMounted, ref, PropType } from "vue";
import { useRoute } from "vue-router";
import { showConfirmDialog, showLoadingToast, showNotify, showToast } from "vant";
import HxSign from "@/components/HxSign/index.vue";
import { savePayRollsign, queryPayRollsign } from "@/api/oaModule";
import { useUserStore } from "@/store/modules/user";
import { getRouteLink } from "@/config/common";
import { DetailInfoType } from "./detail.vue";

const props = defineProps({
  detailInfo: { type: Object as PropType<DetailInfoType>, required: true }
});
const baseApi = import.meta.env.VITE_BASE_API;
const route = useRoute();
const appStore = useUserStore();
const fullImgStr = ref<string>(""); // 回显图片地址

// 确认签名
const onHandleImg = ({ image }) => {
  if (!image || !image.length) {
    showToast({ message: "请输入签名!", position: "top" });
    return;
  }

  const beforeClose = (action: string): Promise<boolean> =>
    new Promise((resolve) => {
      if (action === "cancel") {
        resolve(true);
      } else {
        // 拦截确认操作
        const [image1, image2] = image.split(",");
        const showLoading = showLoadingToast({
          message: "正在处理",
          forbidClick: true,
          duration: 0
        });
        savePayRollsign({
          payslipId: route.query?.payslipId || props.detailInfo?.Id,
          gzmbb: route.query.gzmbb,
          userCode: appStore.userInfo.userCode,
          image1,
          image2,
          mbNo: route.query.gzmbNo
        })
          .then((res) => {
            if (res.data && res.status === 200) {
              // 操作成功处理
              showLoading.close();

              showNotify({ type: "success", message: "操作成功" });
              if (getRouteLink()) return;
              querySign();
            } else {
              showNotify({
                type: "danger",
                message: "提交失败，请联系系统组开发人员"
              });
            }
          })
          .finally(() => {
            resolve(true);
          });
      }
    });

  showConfirmDialog({
    title: "提示",
    message: "您确认进行签名提交？",
    beforeClose
  }).catch(() => {});
};

const querySign = () => {
  const { payslipId, gzmbNo } = route.query;
  const showLoading = showLoadingToast({
    message: "加载中...",
    forbidClick: true
  });
  queryPayRollsign({
    payslipId: gzmbNo + "" + (payslipId || props.detailInfo?.Id)
  })
    .then(({ data }) => {
      if (data) {
        fullImgStr.value = baseApi + data.signatureFilePath;
      }
    })
    .finally(() => {
      const timer = setTimeout(() => {
        showLoading.close();
        clearTimeout(timer);
      }, 1000);
    });
};

onMounted(() => querySign());
</script>
