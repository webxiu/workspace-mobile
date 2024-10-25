<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import MyApply from "./MyApply.vue";
import MySend from "./MySend.vue";

const tabs = [MyApply, MySend];
const filterOptions = [
  { text: "全部", value: "" },
  { text: "待登记", value: 0 },
  { text: "已登记", value: 1 },
];

const router = useRouter();

const selectedTab = ref(0);
const badgeNum = ref(0);
const selectedMenuValue = ref(0);
const swipeRef = ref();

const setBadgeNum = (num) => (badgeNum.value = num);

const onTabChange = (index: number) => {
  selectedTab.value = index;
  swipeRef.value?.swipeTo(index);
};

const onSwipeChange = (index: number) => {
  selectedTab.value = index;
  swipeRef.value?.swipeTo(index);
};

const handleToAdd = () => router.push("/oa/leaveApply/add");
</script>

<template>
  <div class="leave">
    <van-sticky>
      <div>
        <!-- tab导航 -->
        <van-tabs
          v-model:active="selectedTab"
          title-active-color="#1989fa"
          swipeable
          sticky
          @change="onTabChange"
        >
          <van-tab :key="0" title="出车登记" />
          <van-tab :key="1" title="返程登记" />
        </van-tabs>
      </div>
    </van-sticky>

    <!-- 滑动区域 -->
    <!-- <van-swipe
      ref="swipeRef"
      @change="onSwipeChange"
      :loop="false"
      :show-indicators="false"
    > -->
    <!-- <van-swipe-item v-for="(_, index) in tabs"> -->
    <!-- <component
          :is="tabs[index]"
          :dropKey="selectedMenuValue"
          @setBadgeNum="setBadgeNum"
        /> -->
    <!-- </van-swipe-item> -->
    <!-- </van-swipe> -->
    <MyApply v-if="selectedTab === 0" />
    <MySend v-if="selectedTab === 1" />
  </div>
</template>

<style lang="scss" scoped>
.leave {
  height: 100%;
  // position: relative;
  :deep(.van-badge) {
    background-color: #1989fa;
  }

  :deep(.van-tabs__wrap) {
    touch-action: manipulation;
  }
  :deep(.van-tabs__content) {
    width: 750px;
    height: 100%;
    background: #f60;
  }
  .add-action {
    width: 90px;
    border-radius: 50%;
    box-shadow: 2px 3px 6px grey;
    background-color: #5686ff;
    // bottom: 170px;
    bottom: 480px;
    right: 70px;
    height: 90px;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    z-index: 100;
  }
}
</style>
