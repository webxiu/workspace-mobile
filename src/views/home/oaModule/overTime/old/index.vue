<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import MyApply from "./MyApply.vue";
import MySend from "./MySend.vue";

const tabs = [MyApply, MySend];
const filterOptions = [
  { text: "全部", value: "" },
  { text: "待提交", value: 0 },
  { text: "审核中", value: 1 },
  { text: "已审核", value: 2 },
  { text: "重新审核", value: 3 },
];

const router = useRouter();

const selectedTab = ref(0);
const badgeNum = ref(0);
const selectedMenuValue = ref("");
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

const handleToAdd = () => router.push("/oa/overTime/add");
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
          <van-tab
            :key="0"
            title="我申请的"
            :badge="badgeNum"
            :show-zero-badge="false"
          />
          <van-tab :key="1" title="抄送我的" />
        </van-tabs>

        <!-- 下拉菜单 -->
        <van-dropdown-menu>
          <van-dropdown-item
            v-model="selectedMenuValue"
            :options="filterOptions"
          />
        </van-dropdown-menu>
      </div>
    </van-sticky>

    <!-- 滑动区域 -->
    <van-swipe
      ref="swipeRef"
      @change="onSwipeChange"
      :loop="false"
      :show-indicators="false"
    >
      <van-swipe-item v-for="(_, index) in tabs" :key="index">
        <component
          :is="tabs[index]"
          :dropKey="selectedMenuValue"
          @setBadgeNum="setBadgeNum"
        />
      </van-swipe-item>
    </van-swipe>

    <!--新增加班单按钮-->
    <div class="add-action" @click="handleToAdd" v-if="!selectedTab">
      <van-icon name="plus" size="22" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.leave {
  :deep(.van-tabs__wrap) {
    touch-action: manipulation;
  }
  :deep(.van-tabs__content) {
    width: 750px;
    height: 100%;
    background: #f60;
  }
  .add-action {
    width: 120px;
    border-radius: 50%;
    box-shadow: 2px 3px 6px grey;
    background-color: #5686ff;
    bottom: 30px;
    right: 70px;
    height: 120px;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }
}
</style>
