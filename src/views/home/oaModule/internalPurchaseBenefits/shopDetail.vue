<template>
  <div class="shop-detail" ref="boxRef">
    <section class="commodityDetail">
      <van-swipe class="my-swipe" :show-indicators="false" :loop="false" :touchable="false" ref="swiperObject" indicator-color="white">
        <van-swipe-item>
          <div class="detail-form">
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
              <van-swipe class="my-swipe1" autoplay="20000" indicator-color="red" loop>
                <van-swipe-item v-for="(image, index) in commodityDetail.commoditiesImages" :key="index">
                  <van-image height="300px" :src="`/api${image.filePath}/${image.fileName}`" />
                </van-swipe-item>
              </van-swipe>

              <van-cell-group>
                <van-cell title="商品编号：" :value="commodityDetail.billNo" />
              </van-cell-group>
              <van-cell-group>
                <van-cell title="商品名称：" :value="commodityDetail.commodityName" />
              </van-cell-group>
              <van-cell-group>
                <van-cell title="商品型号：" :value="commodityDetail.model" />
              </van-cell-group>
              <van-cell-group>
                <van-cell title="原价：" value="">
                  <template #extra>
                    <div class="van-card__origin-price">
                      ¥
                      {{ commodityDetail.commoditiesSpecs?.length ? commodityDetail.commoditiesSpecs[0]?.officialPrice : "" }}
                    </div>
                  </template>
                </van-cell>
              </van-cell-group>
              <van-cell-group>
                <van-cell
                  title="折扣价："
                  :value="'￥' + (commodityDetail.commoditiesSpecs?.length ? commodityDetail.commoditiesSpecs[0]?.discountPrice : '')"
                />
              </van-cell-group>
              <van-cell-group>
                <van-cell title="商品描述：">
                  <template #label>
                    <pre style="font-family: inherit; white-space: pre-wrap">{{ commodityDetail.commodityDescription }}</pre>
                  </template>
                </van-cell>
              </van-cell-group>

              <van-form style="margin-left: 20px; font-size: 14px; padding-top: 10px">
                <div>
                  <van-sku
                    v-model="show"
                    :sku="sku"
                    :goods="goods"
                    :goods-id="goods_id"
                    :quota="0"
                    :initial-sku="initialSku"
                    reset-stepper-on-hide
                    reset-selected-sku-on-hide
                    disable-stepper-input
                    :get-container="boxRef"
                    :show-add-cart-btn="false"
                    :quota-used="0"
                    @buy-clicked="saveSkuInfo"
                  >
                    <template #sku-actions-top="props">
                      <div>
                        <div class="van-cell van-cell--center">
                          <div class="van-cell__title">
                            <span>交货方式</span>
                          </div>
                          <van-radio-group v-model="radio" direction="horizontal" @change="changeRadio">
                            <van-radio name="0" checked-color="#ee0a24">自提</van-radio>
                            <van-radio name="1" checked-color="#ee0a24">快递</van-radio>
                          </van-radio-group>
                        </div>

                        <div v-show="addressDivShow" :class="'van-address-item' + ' ' + (addressDivShow ? '' : 'van-address-item--disabled')">
                          <div class="van-cell van-cell--borderless">
                            <div class="van-cell__value van-cell__value--alone van-address-item__value">
                              <div role="radio" tabindex="0" aria-checked="true" class="van-radio">
                                <span class="van-radio__label">
                                  <div class="van-address-item__name">
                                    {{ chosenAddress.name ?? "" }}
                                    {{ chosenAddress.tel ?? "" }}
                                  </div>
                                  <div class="van-address-item__address">
                                    {{ chosenAddress.address ?? "" }}
                                  </div>
                                </span>
                              </div>
                            </div>
                            <i
                              :class="'van-icon van-icon-arrow van-cell__right-icon1' + ' ' + (addressDivShow ? '' : 'van-cell__disabled')"
                              v-on:click="() => router.push('/oa/internalPurchaseBenefits/addressList')"
                              ><!----></i
                            >
                          </div>
                        </div>
                      </div>
                    </template>
                  </van-sku>
                </div>

                <van-dialog v-model="addressShow" title="选择地址" show-cancel-button>
                  <van-address-list
                    v-model="chosenAddressId"
                    :list="addressList"
                    default-tag-text="默认"
                    add-button-text="确定"
                    @add="() => {}"
                    @edit="() => {}"
                  />
                </van-dialog>
              </van-form>
            </van-pull-refresh>
          </div>
        </van-swipe-item>
      </van-swipe>
    </section>
    <div class="van-goods-action">
      <van-sticky :offset-bottom="5" position="bottom">
        <div style="width: 100vw; display: flex; justify-content: center">
          <van-button round block type="danger" native-type="submit" chosenAddress style="background-color: #ff0008; width: 80%" @click="show = true"
            >购买</van-button
          >
        </div>
      </van-sticky>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { closeToast, showLoadingToast, showNotify } from "vant";
import { queryShoppingList, saveOrderListItem, getDefaultAddressListByUserId } from "@/api/oaModule";
import { queryUserInfo } from "@/api/user";
import { useAppStore } from "@/store/modules/app";
import { useShopStore } from "@/store/modules/shop";
import { throttle } from "@/utils/common";

const virtualPath = `${import.meta.env.VITE_IMAGEURL_PREFIX}`;

const route = useRoute();
const router = useRouter();
const boxRef = ref(null);
const shopStore = useShopStore();

const commodityDetail = ref({}) as any;
const addressShow = ref(false);
const addressDivShow = ref(false);
const radio = ref("0");
const show = ref(false); // sku弹出层是否显示
const isLoading = ref(false);
const chosenAddress: any = ref({});
const chosenAddressId = ref("");
const addressList = ref([]);
const sku: any = reactive({
  tree: [
    {
      k: "规格",
      v: [],
      k_s: "s1"
    }
  ],
  // 所有 sku 的组合列表，如下是：白色1、白色2、天蓝色1、天蓝色2
  list: [],
  price: "", // 默认价格
  stock_num: 0, // 商品总库存
  none_sku: false // 是否无规格商品
});
const goods: any = reactive({ picture: "" });
const initialSku: any = ref({});
const images: any = ref([]);

const goods_id = "1";

const onRefresh = () => {
  isLoading.value = true;
  fetchDetailInfo();
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
};

const initSku = (res) => {
  sku.price = res.commoditiesSpecs[0]?.discountPrice;
  sku.stock_num = res.totalStock;
  //组装规格
  sku.tree[0].k = "规格";
  sku.tree[0].k_s = "s1";
  sku.tree[0].v = [];

  res.commoditiesSpecs?.forEach((item, idx) => {
    sku.tree[0].v.push({
      id: item.id,
      name: item.spec,
      imgUrl: "/api" + res.commoditiesImages[0]?.filePath + "/" + res.commoditiesImages[0]?.fileName
    });
    sku.list.push({
      id: item.id, // skuId
      s1: item.id, // 规格类目 k_s 为 s1 的对应规格值 id
      price: item.discountPrice * 100, // 价格（单位分）
      stock_num: item.stock // 当前 sku 组合对应的库存
    });
  });

  if (res.commoditiesImages && res.commoditiesImages.length) {
    goods.picture =  "/api" + res.commoditiesImages[0]?.filePath + "/" + res.commoditiesImages[0]?.fileName
    res.commoditiesImages?.forEach((img) => {
      images.value.push("/api" + img.commoditiesImages[0]?.filePath + "/" + img.commoditiesImages[0]?.fileName);
    });
  }
};

const saveSkuInfo = throttle((v) => {
  showLoadingToast({ message: "处理中", forbidClick: true, duration: 50000 });
  // 构造请求参数
  const params = {
    commoditiesspecId: v.selectedSkuComb?.id,
    commodityId: Number(route.params.id),
    deliveryMothed: radio.value,
    quantity: v.selectedNum,
    useraddressId: chosenAddress.value.id
  };

  saveOrderListItem(params).then((res) => {
    if (res.data) {
      showNotify({ type: "success", message: "操作成功" });
      router.push("/oa/internalPurchaseBenefits/orderList");
      shopStore.setCurentShopBottomTab(1);
      closeToast();
    }
  });
}, 1000);

const changeRadio = (v) => {
  radio.value = v;
  //自提
  if (v === "0") {
    addressDivShow.value = false;
  } else {
    addressDivShow.value = true;
  }
};

const fetchDetailInfo = () => {
  queryShoppingList({ id: route.params.id }).then((res) => {
    if (res.data && res.data.length) {
      commodityDetail.value = res.data[0];
      // init sku
      initSku(res.data[0]);
    }
  });
};

const fetchUserInfoAndAddress = () => {
  queryUserInfo({}).then((res) => {
    if (res.data && res.data.id) {
      getDefaultAddressListByUserId({ userId: res.data.id }).then((addressRes) => {
        if (addressRes && addressRes.data.length) {
          const data = addressRes.data.filter((item) => item.isDefault)[0];
          chosenAddress.value = {
            id: data.id,
            name: data.addressee,
            tel: data.addresseePhone,
            address: data.fullAddress,
            isDefault: data.isDefault ? true : false
          };
        }
      });
    }
  });
};
onMounted(() => {
  fetchDetailInfo();
  fetchUserInfoAndAddress();
  useAppStore().setNavTitle("商品详情");
});
</script>

<style scoped lang="scss">
.my-swipe1 {
  :deep(.van-image__img) {
    width: 100vw;
  }
}
</style>
