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
          <div
            v-for="(item, index) in listInfo.records"
            :key="item.userName"
            style="
              border-radius: 6px;
              border: 1px solid #dddee1;
              margin: 0 3px 5px;
            "
          >
            <div class="list-item" style="margin: 2px">
              <van-cell
                value="详情"
                is-link
                @click.stop="() => clickDetail(item)"
              >
                <!-- 使用title插槽来自定义标题 -->
                <template #title>
                  <van-badge :content="index + 1" color="#5686ff"></van-badge>
                  【{{ item.applyName }} - {{ item.billNo }}】

                  <van-tag :type="calcTagColor(item.billState)">
                    {{ BILLSTATE[item.billState] }}
                  </van-tag>
                </template>
              </van-cell>

              <van-cell>
                <template #title>
                  <div style="color: #aaa">
                    <div style="text-align: justify">
                      <van-icon name="guide-o" />
                      <span class="content-offset">{{
                        item.destination || "无"
                      }}</span>
                    </div>
                    <div style="text-align: justify">
                      <van-icon name="comment-circle-o" />
                      <span class="content-offset">{{
                        item.gooutReason || "无"
                      }}</span>
                    </div>
                    <div>
                      <van-icon name="underway-o" />
                      <span class="content-offset"
                        >{{ item.planOutDate }} 至 {{ item.planBackDate }}</span
                      >
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
import { useRoute, useRouter } from "vue-router";
import { fetchGoOutList } from "@/api/outApply";
import { closeToast, showLoadingToast } from "vant";

const BILLSTATE = {
  0: "待提交",
  1: "审核中",
  2: "已审核",
  3: "重新审核",
};

const route = useRoute();
const router = useRouter();
const emit = defineEmits(["setBadgeNum"]);

const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);

let listInfo: { records: any[] } = reactive({ records: [] });

const calcTagColor = (state) => {
  const colorMap = {
    0: "primary",
    1: "warning",
    2: "success",
    3: "danger",
  };
  return colorMap[state];
};

const onLoad = () => {
  setTimeout(() => {
    loading.value = false;
    finished.value = true;
  }, 500);
};

const onRefresh = () => {
  setTimeout(() => {
    getList();
    refreshing.value = false;
  }, 500);
};

const clickDetail = (item) => {
  router.push(`/oa/outApply/detail?id=${item.id}`);
};

// 获取列表
const getList = () => {
  showLoadingToast("加载中");
  fetchGoOutList({ isOwner: true, page: 1, limit: 10000 }).then((res) => {
    if (res.data) {
      listInfo.records = res.data?.records ?? [];
      emit("setBadgeNum", res.data?.records?.length || 0);
      finished.value = true;
      closeToast();
    }
  });
};

watch(route, (newVal) => {
  if (newVal.path === "/oa/outApply") {
    getList();
  }
});

onMounted(() => {
  getList();
});
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
      flex: 70%;
    }
  }
}
</style>
