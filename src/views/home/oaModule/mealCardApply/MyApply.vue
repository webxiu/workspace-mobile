<template>
  <div class="my-apply">
    <div class="list-content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <div class="outer">
          <van-list
            v-if="listInfo.records.length"
            v-model:loading="loading"
            :finished="finished"
            :offset="10"
            :immediate-check="false"
            finish-text="没有更多了"
            @load="onLoad"
          >
            <div v-for="(item, index) in listInfo.records" :key="item.userName" style="border-radius: 6px; border: 1px solid #dddee1; margin: 0 3px 5px">
              <div class="list-item" style="margin: 2px">
                <van-cell :value="item.isDistribute === '待审核' ? '撤销' : ''" @click="() => revokeMealCardAction(item)">
                  <!-- 使用title插槽来自定义标题 -->
                  <template #title>
                    <van-badge :content="index + 1" color="#5686ff"></van-badge>
                    【 {{ item.year }}年 - {{ item.month }}月 】

                    <van-tag :color="caclColor(item.isDistribute)">
                      {{ item.isDistribute }}
                    </van-tag>
                  </template>
                </van-cell>

                <van-cell>
                  <template #title>
                    <div style="color: #aaa">
                      <!-- <div style="text-align: justify">
                      <van-icon name="comment-circle-o" />
                      <span class="content-offset">{{
                        item.isDistribute || "无"
                      }}</span>
                    </div> -->
                      <div>
                        <van-icon name="underway-o" />
                        <span class="content-offset">{{ item.applyDate }}</span>
                      </div>
                    </div>
                  </template>
                </van-cell>
              </div>
            </div>
          </van-list>
          <van-empty v-else description="暂无数据" />
        </div>

        <!-- 无数据时页面 -->
      </van-pull-refresh>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from "vue";
import { fetchMealCardList, revokeMealCard, backMealCard } from "@/api/oaModule";
import { colorSelector } from "@/utils/getStatusColor";
import { useRoute } from "vue-router";
import { closeToast, showConfirmDialog, showLoadingToast, showToast } from "vant";

defineProps(["dropKey", "selectedTab"]);
const route = useRoute();

const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const currentId = ref("");

let listInfo: { records: any[] } = reactive({ records: [] });

const onLoad = () => {
  setTimeout(() => {
    loading.value = false;
    finished.value = true;
  }, 500);
};

const beforeClose = (action: string): Promise<boolean> =>
  new Promise((resolve) => {
    if (action === "cancel") {
      resolve(true);
    }
    setTimeout(() => {
      if (action === "confirm") {
        revokeMealCard({ id: currentId.value })
          .then((res) => {
            if (res.data && res.status === 200) {
              showToast("撤销成功！");
              getList();
            }
          })
          .finally(() => resolve(true));
      }
    }, 1000);
  });

const revokeMealCardAction = (item) => {
  currentId.value = item.id;

  if (item.isDistribute === "待审核") {
    showConfirmDialog({
      title: "温馨提示",
      message: "确认撤销此申请记录吗？",
      beforeClose
    }).catch(console.log);
  }
};

const onRefresh = () => {
  setTimeout(() => {
    getList();
    refreshing.value = false;
  }, 500);
};

// 获取列表
const getList = () => {
  showLoadingToast({
    message: "加载中",
    loadingType: "spinner",
    forbidClick: true
  });
  fetchMealCardList({ isDistribute: "" })
    .then((res) => {
      listInfo.records = res.data;
      finished.value = true;
    })
    .catch(console.log)
    .finally(() => closeToast());
};

const caclColor = (statusText) => {
  if (statusText === "未分发") return "orange";
  if (statusText === "已分发") return "#07c160";
};

watch(route, (newVal) => {
  if (newVal.path === "/oa/mealCardApply") {
    getList();
  }
});

onMounted(() => {
  getList();
});

defineExpose({ getList });
</script>

<style scoped lang="scss">
.my-apply {
  .list-content {
    margin-top: 4px;
    padding: 6px;

    .outer {
      height: calc(100vh - 100px);
    }

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
      flex: 30%;
    }
  }
}
</style>
