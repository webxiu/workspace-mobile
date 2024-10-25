<!-- 订单明细 -->
<template>
  <section class="order-detail" name="pull-refresh">
    <div class="van-tabs__content">
      <div>
        <van-card
          v-if="orderInfo.imageFilename"
          :title="
            orderInfo.brandName +
            ' ' +
            orderInfo.classifyName +
            ' ' +
            orderInfo.commodityName
          "
          :thumb="`${vpath}${orderInfo.imageFilename}`"
        >
          <template #price>
            <div class="van-card__price">
              <div>
                <div class="van-card__price">订单金额：</div>
                <span class="van-card__price-currency">¥</span>
                <span class="van-card__price-integer">{{
                  orderInfo.amount
                }}</span>
              </div>
            </div>
          </template>

          <template #tags>
            <van-tag plain type="danger">{{ orderInfo.spec }}</van-tag>
          </template>
        </van-card>
        <van-cell-group>
          <van-cell :title="'订单编号：' + (orderInfo.billNo || '')" />
        </van-cell-group>
        <van-cell-group>
          <van-cell :title="'订单数量：' + (orderInfo.quantity || '')" />
        </van-cell-group>
        <van-cell-group>
          <van-cell :title="'订单状态：' + (orderInfo.stateName || '')" />
        </van-cell-group>
        <van-cell-group>
          <van-cell :title="'下单时间：' + (orderInfo.createDate || '')" />
        </van-cell-group>
        <van-cell-group>
          <van-cell
            :title="
              '交货方式：' + (orderInfo.deliveryMothed == 0 ? '自提' : '快递')
            "
          />
        </van-cell-group>
        <van-cell-group>
          <van-cell :title="'快递公司：' + (orderInfo.expressCompany ?? '-')" />
        </van-cell-group>
        <van-cell-group>
          <van-cell :title="'快递单号：' + (orderInfo.expressNumber ?? '-')" />
        </van-cell-group>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { queryOrderDetailInfo } from "@/api/oaModule";
import { useAppStore } from "@/store/modules/app";

const vpath = import.meta.env.VITE_IMAGEURL_PREFIX;

const route = useRoute();

const orderInfo: any = ref({});

const getOrderDetailInfo = () => {
  queryOrderDetailInfo({ id: Number(route.query.id) }).then((res) => {
    if (res.data) {
      orderInfo.value = res.data;
    }
  });
};

onMounted(() => {
  getOrderDetailInfo();
  useAppStore().setNavTitle("订单详情");
});
</script>

<style scoped lang="scss">
.order-detail {
  margin: 10px 6px 6px;
  padding: 4px;
  :deep(.van-nav-bar__title) {
    color: #ff0008;
  }
  .van-card__price {
    color: red;
  }
}
</style>
