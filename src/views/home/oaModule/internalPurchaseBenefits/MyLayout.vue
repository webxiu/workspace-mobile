<template>
  <div class="manage">
    <slot></slot>
    <div class="bar-group">
      <van-tabbar
        v-model="shopStore.curentShopBottomTab"
        active-color="#1989fa"
        @change="bottomChangeBar"
      >
        <van-tabbar-item icon="goods-collect-o">商品</van-tabbar-item>
        <van-tabbar-item icon="orders-o">订单</van-tabbar-item>
        <van-tabbar-item icon="user-o">我的</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { queryShoppingList } from "@/api/oaModule";
import { useAppStore } from "@/store/modules/app";
import { useShopStore } from "@/store/modules/shop";

const appStore = useAppStore();
const router = useRouter();
const shopStore = useShopStore();

const shopListInfo: { list: any[] } = reactive({ list: [] });

const bottomChangeBar = (v) => {
  shopStore.setCurentShopBottomTab(v);
  if (v === 2) {
    router.push("/oa/internalPurchaseBenefits/user");
  }

  if (v === 1) {
    router.push("/oa/internalPurchaseBenefits/orderList");
  }

  if (v === 0) {
    router.push("/oa/internalPurchaseBenefits");
  }
};

const fetchShoppingList = () => {
  queryShoppingList().then((res) => {
    if (res.data && res.data.length) {
      shopListInfo.list = res.data;
    }
  });
};

onMounted(() => {
  appStore.setNavTitle("商品列表");
  // fetchShoppingList();
});
</script>

<style lang="scss" scoped>
.manage {
  :deep(.van-nav-bar__title) {
    color: red !important;
    font-weight: 800;
  }
  :deep(.van-hairline--bottom:after) {
    border-bottom: 7px solid red;
  }

  .wrap-swip {
    padding-bottom: 100px;
    // margin-bottom: 180px;

    .data-list {
      :deep(.van-cell__value) {
        text-align: left;
      }
    }
  }
}
</style>
