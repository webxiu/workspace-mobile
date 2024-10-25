<template>
  <div class="my-apply">
    <!-- 下拉菜单 -->
    <van-dropdown-menu>
      <van-dropdown-item
        v-model="selectedMenuValue"
        :options="filterOptions"
        @change="changeMenu"
      />
    </van-dropdown-menu>
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
                :value="item.goOutVehicleVO?.state === 3 ? '去登记' : '详情'"
                is-link
                @click.stop="() => clickDetail(item)"
              >
                <!-- 使用title插槽来自定义标题 -->
                <template #title>
                  <van-badge :content="index + 1" color="#5686ff"></van-badge>
                  【{{ item.applyName }} -
                  {{ item.goOutVehicleVO?.plateNumber }}】

                  <van-tag
                    :type="signUpColorCalc(item.goOutVehicleVO?.state, 'tag')"
                  >
                    {{ signUpColorCalc(item.goOutVehicleVO?.state, "text") }}
                  </van-tag>
                </template>
              </van-cell>

              <van-cell>
                <template #title>
                  <div style="color: #aaa">
                    <div style="text-align: justify">
                      <van-icon name="comment-circle-o" />
                      <span class="content-offset">{{
                        item.destination || "无"
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
import { fetchStartSignUpList } from "@/api/outApply";
import {
  DropdownItemOption,
  TagType,
  closeToast,
  showLoadingToast,
} from "vant";

const signUpColorCalc = (state, showType) => {
  switch (state) {
    case 3:
      return (showType === "tag" ? "warning" : "待登记") as TagType;
    case 4:
      return (showType === "tag" ? "success" : "已登记") as TagType;
    default:
      break;
  }
};

const changeMenu = (val) => {
  selectedMenuValue.value = val;
  getList();
};

const filterOptions = [
  { text: "全部", value: null },
  { text: "待登记", value: 3 },
  { text: "已登记", value: 4 },
] as DropdownItemOption[];
const selectedMenuValue = ref(3);

const props = defineProps(["dropKey"]);
const route = useRoute();
const router = useRouter();
const emit = defineEmits(["setBadgeNum"]);

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

const onRefresh = () => {
  setTimeout(() => {
    getList();
    refreshing.value = false;
  }, 500);
};

const clickDetail = (item) => {
  router.push(
    `/oa/carSignUp/submit?id=${item.id}&type=go&goOutStatus=${item.goOutVehicleVO?.state}`
  );
};

// 获取列表
const getList = () => {
  showLoadingToast("加载中");
  fetchStartSignUpList({ goOutStatus: selectedMenuValue.value }).then((res) => {
    if (res.data) {
      listInfo.records = res.data;
      emit("setBadgeNum", res.data.length || 0);
      finished.value = true;
      closeToast();
    }
  });
};

watch(props, () => {
  getList();
});

watch(route, (newVal) => {
  if (newVal.path === "/oa/carSignUp") {
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
      flex: 65%;
    }
  }
}
</style>
