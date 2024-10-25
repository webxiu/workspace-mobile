<template>
  <div class="my-apply">
    <div class="list-content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <div class="container-box" v-if="listInfo.records.length">
          <van-list v-model:loading="loading" :finished="finished" :offset="10" :immediate-check="false" finish-text="没有更多了" @load="onLoad">
            <div v-for="(item, index) in listInfo.records" :key="item.id" style="border-radius: 6px; border: 1px solid #dddee1; margin: 0 3px 5px">
              <div class="list-item" style="margin: 2px">
                <van-cell value="详情" is-link :to="`/oa/hrDoc/detail?id=${item.id}`">
                  <!-- 使用title插槽来自定义标题 -->
                  <template #title>
                    <van-badge :content="index + 1" color="#5686ff"></van-badge>
                    <span style="margin-left: 6px">姓名：{{ item.staffName }}</span>
                  </template>
                </van-cell>

                <van-cell>
                  <template #title>
                    <div style="color: #aaa">
                      <div>
                        <van-icon name="contact" />
                        <span class="content-offset">部门：{{ item.deptName }}</span>
                      </div>
                      <div>
                        <van-icon name="credit-pay" />
                        <span class="content-offset">工号：{{ item.staffId }}</span>
                      </div>

                      <div>
                        <van-icon name="underway-o" />
                        <span class="content-offset">入职日期：{{ item.startDate }}</span>
                      </div>
                    </div>
                  </template>
                </van-cell>
              </div>
            </div>
          </van-list>
        </div>

        <!-- 无数据时页面 -->
        <van-empty v-else description="暂无数据" />
      </van-pull-refresh>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from "vue";
import { fetchHrDocList, fetchDeptTreeData } from "@/api/oaModule";
import { useRoute } from "vue-router";
import { closeToast, showLoadingToast } from "vant";

const props = defineProps(["dropKey", "selectedTab", "getParams"]);
const route = useRoute();

const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const limit = ref(10);
const currentPage = ref(1);

let listInfo: { records: any[] } = reactive({ records: [] });

const onLoad = () => {
  setTimeout(() => {
    getDataList();
  }, 500);
};

const getDataList = () => {
  const params = props.getParams();
  fetchHrDocList({
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

// 获取列表
const getList = (v?: any) => {
  if (v) {
    showLoadingToast({ message: "加载中", loadingType: "spinner", forbidClick: true });
    fetchHrDocList({ ...v })
      .then((res) => {
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
  fetchHrDocList({ limit: limit.value, page: currentPage.value })
    .then((res) => {
      listInfo.records = res.data.records;
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
    getList(params);
    refreshing.value = false;
  }, 500);
};

// watch(route, (newVal) => {
//   if (newVal.path === "/oa/mealCardApply") {
//     getList();
//   }
// });

onMounted(() => {
  getList();
});

defineExpose({ getList });
</script>

<style scoped lang="scss">
.my-apply {
  overflow-y: auto;
  height: calc(100vh - 115px);
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
      flex: 50%;
    }
  }
}
</style>
