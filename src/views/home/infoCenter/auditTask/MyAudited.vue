<template>
  <div class="my-audit">
    <div class="list-content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <div class="container-box" v-if="resultList.length">
          <van-list :offset="10" :immediate-check="false" finish-text="没有更多了" v-model:loading="loading" :finished="finished" @load="onLoad">
            <div
              v-for="(item, index) in resultList"
              :key="item.userName"
              style="border-radius: 6px; border: 1px solid #dddee1; margin: 0 6px 5px"
              @click="gotoDetail('detail', item)"
            >
              <div class="list-item" style="margin: 2px">
                <van-cell value="详情" is-link>
                  <!-- 使用title插槽来自定义标题 -->
                  <template #title>
                    <van-badge :content="index + 1" color="#5686ff"></van-badge>
                    【{{ item.flowName }}】

                    <van-tag :color="item.statusColor">
                      {{ item.processStatus }}
                    </van-tag>
                  </template>
                </van-cell>

                <van-cell>
                  <template #title>
                    <div class="flex just-between ui-w-100">
                      <div style="color: #aaa" class="ellipsis">
                        <div class="flex just-start">
                          <van-icon name="orders-o" />
                          <span class="content-offset ellipsis">业务单号：{{ item.billNo || "无" }}</span>
                        </div>
                        <div class="flex just-start">
                          <van-icon name="orders-o" />
                          <span class="content-offset ellipsis">审批意见：{{ item.handleComment || "无" }}</span>
                        </div>
                        <div>
                          <van-icon name="underway-o" />
                          <span class="content-offset">审批时间：{{ item.endTime }}</span>
                        </div>
                      </div>
                      <div style="padding: 20px 0 0" class="no-wrap" @click.stop="gotoDetail('view', item)">
                        <van-tag type="primary" size="large">查看列表</van-tag>
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { closeToast, showLoadingToast } from "vant";
import { getAuditTask2 } from "@/api/infoCenter";

const router = useRouter();
const resultList: any = ref([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const limit = ref(10);
const currentPage = ref(1);

const emits = defineEmits(["fetchData"]);
const props = defineProps(["queryParams"]);

const onLoad = () => {
  getDataList();
};

const getDataList = () => {
  const params = props.queryParams;
  getAuditTask2({
    ...params,
    limit: limit.value,
    page: currentPage.value
  }).then((res) => {
    const records = res.data?.records || [];

    if (currentPage.value === 1) {
      resultList.value = records;
    } else {
      resultList.value = [...resultList.value, ...records];
    }
    loading.value = false;

    currentPage.value++;
    if (records.length < limit.value) {
      finished.value = true;
    }
  });
};

// 获取列表
const getList = (v?: any) => {
  if (v) {
    showLoadingToast({
      message: "加载中",
      loadingType: "spinner",
      forbidClick: true
    });
    getAuditTask2({ ...v })
      .then((res) => {
        resultList.value = res.data?.records || [];
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
  getAuditTask2({ limit: limit.value, page: currentPage.value })
    .then((res) => {
      resultList.value = res.data?.records || [];
    })
    .catch(() => {})
    .finally(() => closeToast());
};

const onRefresh = () => {
  // 重新初始化这些属性
  refreshing.value = false;
  resultList.value = [];
  currentPage.value = 1;
  loading.value = false;
  finished.value = false;
  const params = props.queryParams;

  setTimeout(() => {
    getList(params);
    refreshing.value = false;
  }, 500);
};

const initData = (res) => {
  resultList.value = res.data?.records || [];
};

/**
 * 跳转详情
 * @param type 查看方式  detail: 可编辑操作 view: 只查看
 * @param param1 擦数
 */
const gotoDetail = (type, { billNo, billId, processDefId, processInstId, projectId }) => {
  router.push({
    path: "/infoCenter/auditTask/detail",
    query: { billNo, billId, processDefId, processInstId, projectId, tab: 2, type }
  });
};

onMounted(() => {
  // getList();
});
defineExpose({ initData, getList });
</script>

<style lang="scss" scoped>
.my-audit {
  margin: 10px;
  .list-content {
    margin-top: 4px;

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
      flex-wrap: wrap;
      align-items: center;
      flex: 70%;
      width: 100%;
    }
  }
}
</style>
