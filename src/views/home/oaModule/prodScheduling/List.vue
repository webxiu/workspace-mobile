<template>
  <div class="my-apply">
    <div class="list-content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-if="listInfo.records.length"
          v-model:loading="loading"
          :finished="finished"
          :offset="10"
          :immediate-check="false"
          finish-text="没有更多了"
          @load="onLoad"
        >
          <div v-for="(item, index) in listInfo.records" :key="item.FBILLNO" style="border-radius: 6px; border: 1px solid #dddee1; margin: 0 3px 5px">
            <div class="list-item" style="margin: 2px">
              <van-cell>
                <template #title>
                  <van-badge :content="index + 1" color="#5686ff"></van-badge>
                  <span style="margin-left: 6px">型号：{{ item.FNAME }}</span>
                </template>
              </van-cell>

              <van-cell>
                <template #title>
                  <div style="color: #aaa">
                    <div>
                      <van-icon name="info-o" />

                      <span class="content-offset">工单号：{{ item.FBILLNO }}</span>
                    </div>
                    <div>
                      <van-icon name="underway-o" />
                      <span class="content-offset">日期：{{ item.PlanDate.substr(0, 10) }}</span>
                    </div>
                    <div>
                      <van-icon name="cluster-o" />
                      <span class="content-offset">产线：{{ item.Prodline }}</span>
                    </div>

                    <div>
                      <van-icon name="comment-circle-o" />
                      <span class="content-offset">数量：{{ item.FPlanQty }}</span>
                    </div>
                  </div>
                </template>
              </van-cell>
            </div>
          </div>
        </van-list>

        <!-- 无数据时页面 -->
        <van-empty v-else description="暂无数据" />
      </van-pull-refresh>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from "vue";
import { fetchLineList, fetchProdScheduleList, ProdScheduleItemType } from "@/api/oaModule";
import { useRoute } from "vue-router";
import { closeToast, showLoadingToast } from "vant";

const props = defineProps(["dropKey", "selectedTab", "getParams"]);
const route = useRoute();

const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const limit = ref(10);
const currentPage = ref(1);

let listInfo: { records: ProdScheduleItemType[] } = reactive({ records: [] });

const getDataList = () => {
  const params = props.getParams();
  fetchProdScheduleList({
    ...params,
    limit: limit.value,
    page: currentPage.value
  }).then((res) => {
    const { records } = res.data;

    if (currentPage.value === 1) {
      listInfo.records = records;
    } else {
      listInfo.records = [...listInfo.records, ...records];
    }
    loading.value = false;

    // listInfo.records = [...listInfo.records, ...records];

    currentPage.value++;
    if (records.length < limit.value) {
      finished.value = true;
      return;
    }
  });
};
const onLoad = () => {
  setTimeout(() => {
    getDataList();
  }, 500);
};

// 获取列表
const getList = (v?: any) => {
  if (v) {
    showLoadingToast({
      message: "加载中",
      loadingType: "spinner",
      forbidClick: true
    });
    if (v.isReset) {
      onRefresh();
      currentPage.value = 1;
    }
    fetchProdScheduleList({ ...v, limit: limit.value, page: currentPage.value })
      .then((res: any) => {
        listInfo.records = res.data.records;
        finished.value = false;
      })
      .catch(() => {})
      .finally(() => closeToast());
    return;
  }
  showLoadingToast({
    message: "加载中",
    loadingType: "spinner",
    forbidClick: true
  });
  fetchProdScheduleList({ page: currentPage.value, limit: limit.value })
    .then((res: any) => {
      listInfo.records = res.data.records;
      // finished.value = true;
    })
    .catch(() => {})
    .finally(() => closeToast());
};

const onRefresh = () => {
  // 重新初始化这些属性
  refreshing.value = false;
  listInfo.records = [];
  currentPage.value = 1;
  loading.value = false;
  finished.value = false;
  const params = props.getParams();
  setTimeout(() => {
    getList({ ...params });
    refreshing.value = false;
  }, 500);
};

onMounted(() => {
  const params = props.getParams();
  const { isLink } = route.query;

  !isLink && getList({ ...params });
});

defineExpose({ getList });
</script>

<style scoped lang="scss">
.my-apply {
  .list-content {
    margin-top: 4px;
    padding: 6px;

    .list-item {
      .content-offset {
        margin-left: 12px;
      }

      :deep(.van-tag--primary) {
        padding: 2px 4px;
      }

      :deep(.van-cell__value),
      :deep(.van-icon-arrow:before) {
        color: #5686ff;
      }
    }

    .custom-title {
      margin-right: 4px;
      vertical-align: middle;
    }

    .search-icon {
      font-size: 16px;
      line-height: inherit;
    }

    :deep(.van-badge--top-right) {
      transform: none;
    }

    :deep(.van-cell__title) {
      display: flex;
      align-items: center;
      flex: 80%;
    }
  }
}
</style>
