<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-06-23 09:57:37 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-06-23 09:57:37 
 */ -->
<template>
  <div class="ui-h-100 flex-col">
    <van-sticky>
      <van-search
        v-model="queryParams.searchKey"
        shape="round"
        @search="onSearch"
        placeholder="请输入搜索关键词"
      />
      <van-dropdown-menu>
        <van-dropdown-item
          v-model="queryParams.searchType"
          :options="option1"
        />
        <van-dropdown-item v-model="queryParams.orderBy" :options="option2" />
      </van-dropdown-menu>
    </van-sticky>

    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      class="flex-1 ui-ovy-a"
    >
      <van-list
        v-model:loading="isLoading"
        :finished="true"
        finished-text="没有更多了"
        @load="onLoad"
        class="p-16 box-border"
        v-if="dataList.length > 0"
      >
        <van-cell
          v-for="(item, index) in dataList"
          :key="item.id"
          class="customer-cell"
        >
          <div class="flex just-between">
            <div class="ui-va-m">
              <span class="custom-index">{{ index + 1 }}</span>
              <span class="ml-8 color-333">【{{ item.customer }}】</span>
            </div>
            <van-button type="primary" size="mini" class="flex-shrink">
              {{ item.stateName }}
            </van-button>
          </div>
          <div
            class="flex just-between align-end mt-40"
            @click="onJumpDetail(item)"
          >
            <div>
              <div>
                <van-icon name="comment-circle-o" />
                <span class="ml-8 color-333">标题：{{ item.title }}</span>
              </div>
              <div>
                <van-icon name="underway-o" />
                <span class="ml-8 color-333">{{ item.marketSubmitDate }}</span>
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
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAxios } from "@/hooks/useAxios";
import { getCustomerComplaint } from "@/api/oaModule";

interface ResultListType {
  id: number;
  orderNo: string;
  title: string;
  customer: string;
  state: number;
  stateName: string;
  marketStateName: string;
  createDate: string;
  marketSubmitDate: string;
  marketSubmitUserName: string;
}
const router = useRouter();
const dataList = ref<ResultListType[]>([]);
const queryParams = reactive({
  searchType: "",
  searchKey: "",
  orderBy: "",
});

const option1 = [
  { text: "全部", value: "" },
  { text: "待处理", value: "s0" },
  { text: "已处理", value: "s1" },
];
const option2 = [
  { text: "默认排序", value: "" },
  { text: "提交时间升序", value: "sx0" },
  { text: "提交时间降序", value: "sx1" },
  { text: "审核时间升序", value: "sx2" },
  { text: "审核时间降序", value: "sx3" },
];

const onSearch = (value: string) => {
  queryParams.searchKey = value;
};

const onRefresh = () => getData(true);

const onLoad = (data) => {
  if (data) dataList.value = data.data;
};

const { isLoading, getData } = useAxios<
  ResultListType[],
  typeof getCustomerComplaint
>({
  initValue: [],
  api: getCustomerComplaint,
  params: queryParams,
  callback: onLoad,
});

const onJumpDetail = (item: ResultListType) => {
  router.push(`/oa/customerComplaints/${item.id}`);
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
