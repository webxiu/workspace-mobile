<template>
  <div class="my-send">
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
              <!-- <van-cell value="退卡" @click="() => returnMealCardAction(item)"> -->
              <van-cell>
                <!-- 使用title插槽来自定义标题 -->
                <template #title>
                  <van-badge :content="index + 1" color="#5686ff"></van-badge>
                  【 {{ item.year }}年 - {{ item.month }}月 】

                  <van-tag :type="colorSelector(item.billStateName)">
                    {{ item.billStateName }}
                  </van-tag>
                </template>
              </van-cell>

              <van-cell>
                <template #title>
                  <div style="color: #aaa">
                    <div style="text-align: justify">
                      <van-icon name="comment-circle-o" />
                      <span class="content-offset">{{
                        item.isDistribute
                      }}</span>
                    </div>
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

        <!-- 无数据时页面 -->
        <van-empty v-else description="暂无数据" />
      </van-pull-refresh>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { fetchMealCardList, revokeMealCard } from "@/api/oaModule";
import { colorSelector } from "@/utils/getStatusColor";
import { showConfirmDialog, showToast } from "vant";

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

const onRefresh = () => {
  setTimeout(() => {
    getList();
    refreshing.value = false;
  }, 500);
};

// 获取列表
const getList = () => {
  fetchMealCardList({ isDistribute: "已分发" }).then((res) => {
    listInfo.records = res.data;
    finished.value = true;
  });
};

const beforeClose = (action: string): Promise<boolean> =>
  new Promise((resolve) => {
    if (action === "cancel") {
      resolve(true);
    }
    setTimeout(() => {
      if (action === "confirm") {
        // revokeMealCard({ id: currentId.value })
        //   .then((res) => {
        //     if (res.data && res.status === 200) {
        //       showToast("撤销成功！");
        //       getList();
        //     }
        //   })
        //   .finally(() => resolve(true));
        showToast("退卡成功！");
        getList();
        resolve(true);
      }
    }, 1000);
  });

const returnMealCardAction = (item) => {
  currentId.value = item.id;
  showConfirmDialog({
    title: "温馨提示",
    message: "确认执行退卡操作吗？",
    beforeClose,
  }).catch(() => {});
};

onMounted(() => {
  getList();
});
</script>

<style scoped lang="scss">
.my-send {
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
      flex: 30%;
    }
  }
}
</style>
