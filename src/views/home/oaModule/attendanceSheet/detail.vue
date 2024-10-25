<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-06-23 09:56:32 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-06-23 09:56:32 
 */ -->
<template>
  <div class="attendance-detail">
    <van-swipe
      class="ui-h-100"
      ref="swipeRef"
      :loop="false"
      :immediate="false"
      :touchable="false"
      :show-indicators="false"
    >
      <van-swipe-item v-for="(_, idx) in tabs" :key="idx">
        <component :is="tabs[idx]" ref="childRef" @onSubmit="onChange" />
      </van-swipe-item>
    </van-swipe>
    <van-tabbar
      v-model="active"
      inactive-color="#646566"
      active-color="#00f"
      @change="onChange"
    >
      <van-tabbar-item icon="label-o">考勤详情</van-tabbar-item>
      <van-tabbar-item icon="edit">签名</van-tabbar-item>
      <van-tabbar-item icon="smile-comment-o" v-if="isSign">
        异常反馈
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script lang="ts" setup>
import { ref, VNodeRef, onMounted } from "vue";
import Attendance from "./components/Attendance.vue";
import Signature from "./components/Signature.vue";
import Feedback from "./components/Feedback.vue";
import { getPreviewSignature, getAttendanceDetail } from "@/api/oaModule";
import { showToast } from "vant";

import { useRoute } from "vue-router";
import { SignStatus } from "./config";

const route = useRoute();
const appId = route.params.id;
const isSign = ref<boolean>(true);
const tabs = [Attendance, Signature, Feedback];
const swipeRef = ref<VNodeRef>("");
const active = ref<number>(0);
const childRef = ref();

onMounted(() => {
  getDetailData();
  getSignStatus();
});

// 获取签名状态
const getSignStatus = () => {
  getPreviewSignature({ appId }).then((res) => {
    const statusList = [
      SignStatus.signed,
      SignStatus.dossier,
      SignStatus.exception,
    ];
    if (statusList.includes(res.data[0]?.status)) {
      isSign.value = false;
    }
  });
};

// 获取详情信息
const getDetailData = async () => {
  try {
    const result = await getAttendanceDetail({ appId });
    const data = result.data;
    if (!data?.length) throw new Error("获取数据失败");
    childRef.value?.forEach((child) => {
      if (child?.initData) child.initData(data);
    });
  } catch (error) {
    showToast({ message: "获取详情失败", position: "top" });
  }
};

/**
 * 切换菜单
 * @param index 切换的当前索引
 * @param isReloadDetail 是否重新加载详情信息
 */
const onChange = (index: number, isReloadDetail?: boolean) => {
  active.value = index;
  swipeRef.value?.swipeTo(index);
  if (isReloadDetail) getDetailData();
};
</script>

<style lang="scss" scoped>
.attendance-detail {
  height: calc(100% - 100px);
}
:deep(.van-tabbar-item--active) {
  font-weight: 700;
}
</style>
