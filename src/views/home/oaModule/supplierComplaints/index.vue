<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-06-23 09:58:35 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-06-23 09:58:35 
 */ -->
<template>
  <div class="ui-h-100">
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      class="ui-h-100 ui-ovy-a"
    >
      <van-list
        v-model:loading="isLoading"
        :finished="true"
        finished-text="没有更多了"
        class="p-16 box-border"
        v-if="dataList.length > 0"
      >
        <van-cell
          v-for="(item, index) in dataList"
          :key="item.id"
          class="customer-cell"
        >
          <div class="ui-va-m">
            <span class="custom-index">{{ index + 1 }}</span>
            <span class="ml-8 color-333">
              【被投诉采购员 - {{ item.fname }}】
            </span>
          </div>
          <div
            class="flex just-between align-end mt-40"
            @click="onJumpDetail(item)"
          >
            <div>
              <div>
                <van-icon name="comment-circle-o" />
                <span class="ml-8 color-333">{{ item.cryptonym }}</span>
              </div>
              <div>
                <van-icon name="underway-o" />
                <span class="ml-8 color-333">{{ item.creattime }}</span>
              </div>
            </div>
            <van-button type="primary" plain size="mini" style="border: none">
              详情<van-icon name="arrow" />
            </van-button>
          </div>
        </van-cell>
      </van-list>
      <van-empty v-else description="暂无数据" />
    </van-pull-refresh>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getSupplierComplaints } from "@/api/oaModule";
import { showToast } from "vant";
import { useAppStore } from "@/store/modules/app";

interface SupplierItemType {
  id: number;
  fname: string;
  cryptonym: string;
  content: string;
  name: string;
  phone: string;
  fbillno: string;
  creattime: string;
}
const router = useRouter();
const appStore = useAppStore();
const isLoading = ref<boolean>(false);
const dataList = ref<SupplierItemType[]>([]);

onMounted(() => {
  getData();
  appStore.setNavTitle("供应商投诉");
});

const onRefresh = () => getData(true);

const getData = async (isRefresh = false) => {
  try {
    isLoading.value = true;
    const res = await getSupplierComplaints({});
    if (!res.data?.length) throw "暂无数据";
    if (isRefresh) showToast({ message: "数据获取成功", position: "top" });
    dataList.value = res.data;
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    showToast({
      message: error?.toString() || "数据获取失败",
      position: "top",
    });
  }
};

const onJumpDetail = (item: SupplierItemType) => {
  router.push(`/oa/supplierComplaints/${item.id}`);
};
</script>

<style lang="scss" scoped>
.custom-index {
  background: gray;
  color: #fff;
  border-radius: 50%;
  display: inline-block;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  font-size: 24px;
  font-weight: 700;
}
.customer-cell {
  margin-top: 20px;
  border: 1px solid #dddee1;
}
:deep(.van-cell__value) {
  text-align: left;
}
</style>
