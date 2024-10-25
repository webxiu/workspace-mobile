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
          <div v-for="(item, index) in listInfo.records" :key="item.id" style="border-radius: 6px; border: 1px solid #dddee1; margin: 0 3px 5px">
            <div class="list-item" style="margin: 2px">
              <van-cell value="详情" is-link @click.stop="() => clickDetail(item)">
                <!-- 使用title插槽来自定义标题 -->
                <template #title>
                  <van-badge :content="index + 1" color="#5686ff"></van-badge>
                  【{{ item.staffName }} - {{ item.overtimeType }}】

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
                      <span class="content-offset">{{ item.remark || "无" }}</span>
                    </div>
                    <div>
                      <van-icon name="underway-o" />
                      <span class="content-offset">{{ item.startDate }} {{ item.startTime }} 至 {{ item.endDate }} {{ item.endTime }}</span>
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
import { getOvertimeList } from "@/api/oaModule";
import { colorSelector } from "@/utils/getStatusColor";
import { useRoute, useRouter } from "vue-router";
// import router from "@/router";

interface ItemInfoType {
  overtimeType: string;
  staffName: string;
  remark: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  userName: string;
  billStateName: string;
  id: number;
}

const props = defineProps(["dropKey"]);
const route = useRoute();
const router = useRouter();
const emit = defineEmits(["setBadgeNum"]);

const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);

let listInfo: { records: ItemInfoType[] } = reactive({ records: [] });

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
  router.push(`/oa/overTime/${item.id}`);
};

// 获取列表
const getList = () => {
  getOvertimeList({ billState: props.dropKey + "" }).then((res) => {
    listInfo.records = res.data;
    emit("setBadgeNum", res.data.length || 0);
    finished.value = true;
  });
};

watch(props, () => {
  getList();
});

watch(route, (newVal) => {
  if (newVal.path === "/oa/overTime") {
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
