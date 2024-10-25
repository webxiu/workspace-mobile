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
            :key="item.fbillno"
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
                :to="`/signBack?billNo=${item.fbillno}`"
              >
                <!-- 使用title插槽来自定义标题 -->
                <template #title>
                  <van-badge :content="index + 1" color="#5686ff"></van-badge>
                  【采购员：{{ item.userName }}】

                  <van-tag :type="calcBtnType(item.billState)">
                    {{ calcState(item.billState) }}
                  </van-tag>
                </template>
              </van-cell>

              <van-cell>
                <template #title>
                  <div style="color: #aaa">
                    <div style="text-align: justify">
                      <van-icon name="comment-circle-o" />
                      <span class="content-offset">{{
                        item.fbillno || "无"
                      }}</span>
                    </div>
                    <div>
                      <van-icon name="underway-o" />
                      <span class="content-offset">{{ item.fdate }}</span>
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
import { querySignList } from "@/api/supSign";
import { useRoute } from "vue-router";
import { closeToast, showLoadingToast } from "vant";

const route = useRoute();

const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);

let listInfo: { records: any[] } = reactive({ records: [] });

const onLoad = () => {
  setTimeout(() => {
    loading.value = false;
    finished.value = true;
  }, 500);
};

const calcState = (status) => {
  switch (status) {
    case 0:
      return "待提交";
    case 1:
      return "审核中";
    case 2:
      return "已驳回";
    case 3:
      return "已回签";
    default:
      return "待回签";
  }
};

const calcBtnType = (status) => {
  switch (status) {
    case 1:
      return "primary";
    case 2:
      return "danger";
    case 3:
      return "success";

    default:
      return "warning";
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
  showLoadingToast("加载中...");
  const supplierNo = localStorage.getItem("supplierNo");
  querySignList({ supCode: supplierNo })
    .then((res) => {
      listInfo.records = res.data || [];
    })
    .finally(() => closeToast());
};

watch(route, (newVal) => {
  if (newVal.path === "/purchaseList") {
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
      flex: 30%;
    }
  }
}
</style>
