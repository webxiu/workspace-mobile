<template>
  <div class="order-list-page">
    <my-layout>
      <van-pull-refresh
        v-model="refreshing"
        @refresh="onRefresh"
        v-if="list.length"
      >
        <van-list v-model:loading="loading" :finished="finished" @load="onLoad">
          <div class="card-item" v-for="(item, index) in list" :key="index">
            <van-card
              :num="item.quantity"
              :tag="item.stateName"
              :desc="item.commodityName"
              :thumb="`${vpath}${item.imageFilename}`"
            >
              <template #price>
                <span style="color: red; font-size: 16px"
                  >￥{{ item.amount.toFixed(2) }}</span
                >
              </template>
              <template #title>
                <span style="font-size: 14px; font-weight: 700">{{
                  item.billNo
                }}</span>
              </template>
              <template #tags>
                <!-- <van-tag plain type="primary">标签</van-tag>
              <van-tag plain type="primary">标签</van-tag> -->
                <div style="color: #969799">规格：/</div>
                <!-- <div style="color: #969799">库存：{{ item.totalStock }}</div> -->
              </template>
              <template #footer>
                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    margin-top: 20px;
                    align-items: center;
                  "
                >
                  <div style="color: #969799; font-size: 13px">
                    {{ item.createDate }}
                  </div>
                  <div>
                    <van-button
                      size="mini"
                      type="primary"
                      style="margin-right: 8px"
                      @click="navigateToDetail(item.id)"
                      >查看详情</van-button
                    >
                    <van-button
                      size="mini"
                      type="danger"
                      @click="cancelAction(item.id)"
                      >取消订单</van-button
                    >
                  </div>
                </div>
              </template>
            </van-card>
          </div>
        </van-list>
      </van-pull-refresh>
      <!-- 无数据时页面 -->
      <van-empty v-else description="暂无订单记录" />
    </my-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  closeToast,
  showConfirmDialog,
  showLoadingToast,
  showNotify,
} from "vant";
import { cancelOrderListItem, queryOrderList } from "@/api/oaModule";
import { useAppStore } from "@/store/modules/app";
import MyLayout from "./MyLayout.vue";

const vpath = import.meta.env.VITE_IMAGEURL_PREFIX;

const router = useRouter();
const list: any = ref([]);
const loading = ref(false);
const finished = ref(true);
const refreshing = ref(false);

const onRefresh = () => {
  //   // 清空列表数据
  //   finished.value = true;

  //   // 重新加载数据
  //   // 将 loading 设置为 true，表示处于加载状态
  //   loading.value = false;
  //   onLoad();
  setTimeout(() => {
    fetchOrderList();
    refreshing.value = false;
  }, 500);
};

const navigateToDetail = (id) => {
  router.push({
    path: "/oa/internalPurchaseBenefits/orderDetail",
    query: { id },
  });
};

const cancelAction = (id) => {
  showConfirmDialog({
    title: "德龙电器温馨提示",
    message: "您确定要取消订单吗？",
  })
    .then(() => {
      // on confirm
      onDeleteOrder(id);
    })
    .catch(() => {
      // on cancel
    });
};

const onDeleteOrder = (id) => {
  showLoadingToast({ message: "处理中", forbidClick: true, duration: 3000 });
  // 取消订单
  cancelOrderListItem({ id }).then((res) => {
    if (res.data) {
      //成功
      showNotify({ message: "操作成功", type: "success" });
      fetchOrderList();
      closeToast();
    }
  });
};

const fetchOrderList = () => {
  queryOrderList().then((res) => {
    if (res.data && res.data.length) {
      list.value = res.data;
    }
  });
};

onMounted(() => {
  fetchOrderList();
  useAppStore().setNavTitle("订单列表");
});

const onLoad = () => {
  setTimeout(() => {
    // if (refreshing.value) {
    //   list.value = [];
    //   refreshing.value = false;
    // }

    // for (let i = 0; i < 10; i++) {
    //   list.value.push(list.value.length + 1);
    // }
    loading.value = false;

    // if (list.value.length >= 40) {
    //   finished.value = true;
    // }
    finished.value = true;
  }, 500);
};
</script>

<style scoped lang="scss">
/* 详情页面样式 */
.order-list-page {
  // padding-bottom: 100px;
  // margin-bottom: 100px;
  // background-color: hotpink;
  padding-bottom: 90px;
  // height: 50vh;

  :deep(.van-card) {
    border-radius: 10px;
    background-color: #fafafa;
  }

  .card-item {
    margin: 15px 0;
  }
}
</style>
