<template>
  <div class="my-apply">
    <div class="list-content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <div class="container-box" v-if="listInfo.records.length">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            :offset="10"
            :immediate-check="false"
            finish-text="没有更多了"
            @load="onLoad"
          >
            <div
              v-for="(item, index) in listInfo.records"
              :key="item.id"
              style="
                border-radius: 6px;
                border: 1px solid #dddee1;
                margin: 0 3px 5px;
              "
            >
              <div class="list-item" style="margin: 2px">
                <van-cell>
                  <!-- 使用title插槽来自定义标题 -->
                  <template #title>
                    <van-badge :content="index + 1" color="#5686ff"></van-badge>
                    <span style="margin-left: 6px"
                      >{{
                        dayjs(item.year + "-" + item.month).format("YYYY年M月")
                      }}水电记录</span
                    >
                  </template>
                </van-cell>

                <van-cell>
                  <template #title>
                    <div style="color: #aaa">
                      <div>
                        <van-icon name="newspaper-o" />
                        <span class="content-offset"
                          >宿舍：{{
                            item.buildingName +
                            " " +
                            item.buildingGroup +
                            "-" +
                            item.dormitoryCode
                          }}</span
                        >
                      </div>
                      <div style="display: flex">
                        <div v-if="item.water">
                          <van-icon name="underway-o" />
                          <span class="content-offset"
                            >水表读数：<span style="color: black">{{
                              item.water
                            }}</span></span
                          >
                        </div>

                        <div v-if="item.electric" style="margin-left: 25px">
                          <span class="content-offset"
                            >电表读数：<span style="color: black">{{
                              item.electric
                            }}</span></span
                          >
                        </div>
                      </div>

                      <div style="display: flex">
                        <div v-if="item.createUserName">
                          <van-icon name="friends-o" />
                          <span class="content-offset"
                            >抄表人：{{ item.createUserName }}</span
                          >
                        </div>

                        <div v-if="item.createDate" style="margin-left: 64px">
                          <van-icon name="clock-o" />
                          <span class="content-offset"
                            >抄表时间：{{ item.createDate }}</span
                          >
                        </div>
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
import { getAllWaterAndElectricList } from "@/api/oaModule";
import { closeToast, showLoadingToast } from "vant";
import dayjs from "dayjs";

const props = defineProps([
  "dropKey",
  "selectedTab",
  "getParams",
  "searchDate",
]);

const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const limit = ref(10);
const currentPage = ref(1);

let listInfo: { records: any[] } = reactive({ records: [] });

const onLoad = () => {
  const [year, month] = props.searchDate.split("-");

  setTimeout(() => {
    getDataList({ year: +year, month: +month });
  }, 500);
};

const getDataList = (v) => {
  getAllWaterAndElectricList({
    limit: limit.value,
    page: currentPage.value,
    ...v,
  }).then((res) => {
    const { records } = res.data;

    if (currentPage.value === 1) {
      listInfo.records = records;
    } else {
      listInfo.records = [...listInfo.records, ...records];
    }
    loading.value = false;

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
    showLoadingToast({
      message: "加载中",
      loadingType: "spinner",
      forbidClick: true,
    });
    getAllWaterAndElectricList({
      limit: limit.value,
      page: currentPage.value,
      ...v,
    })
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
    forbidClick: true,
  });
  const [year, month] = props.searchDate.split("-");

  getAllWaterAndElectricList({
    limit: limit.value,
    page: currentPage.value,
    year: +year,
    month: +month,
  })
    .then((res) => {
      listInfo.records = res.data.records;
    })
    .catch(() => {})
    .finally(() => closeToast());
};

const onRefresh = () => {
  const [year, month] = props.searchDate.split("-");

  // 重新初始化这些属性
  refreshing.value = false;
  listInfo.records = [];
  currentPage.value = 1;
  loading.value = false;
  finished.value = false;
  getList({ year: +year, month: +month });
  setTimeout(() => {
    refreshing.value = false;
  }, 500);
};

watch(
  () => props.searchDate,
  (newVal) => {
    const [year, month] = newVal.split("-");
    getList({ year: +year, month: +month });
  },
  { immediate: true }
);

defineExpose({ getList });
</script>

<style scoped lang="scss">
.my-apply {
  overflow-y: auto;
  height: calc(100vh - 205px);
  .list-content {
    margin-top: 4px;
    padding: 6px 12px;
    height: 100%;
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
