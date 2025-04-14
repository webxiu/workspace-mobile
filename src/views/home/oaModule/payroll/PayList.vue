<template>
  <div class="list-content">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-if="listInfo.payrollList?.length">
        <div v-for="(item, index) in listInfo.payrollList" :key="item.name" style="border-radius: 6px; border: 1px solid #dddee1; margin: 0 3px 5px">
          <div class="list-item" style="margin: 2px">
            <van-cell value="详情" is-link @click="() => clickToDetail(item)">
              <!-- 使用 title 插槽来自定义标题 -->
              <template #title>
                <div style="display: flex; align-items: center; width: 200px">
                  <div>
                    <van-badge :content="index + 1" color="#5686ff"></van-badge>
                    【{{ dayjs(item.yearMonth).format("YYYY年M月") }}】
                  </div>

                  <div>
                    <van-tag :type="getPayRollListStatusByStr(item.status).colorStr">
                      {{ getPayRollListStatusByStr(item.status).statusText }}
                    </van-tag>
                  </div>
                </div>
              </template>
            </van-cell>

            <van-cell>
              <template #title>
                <div style="color: #aaa">
                  <div style="text-align: justify">
                    <van-icon name="gold-coin-o"></van-icon>
                    <span class="content-offset">
                      实发工资：<span class="sfgz">{{ item.shiFaGongZi }}</span>
                    </span>
                  </div>
                  <div>
                    <van-icon name="flag-o" />
                    <span class="content-offset"> 签名状态：{{ calcStatusText(item.status) }} </span>
                  </div>
                  <div>
                    <van-icon name="underway-o" />
                    <span class="content-offset"> 签名时间：{{ item.createDate || "--" }} </span>
                  </div>
                </div>
              </template>
            </van-cell>
          </div>
        </div>
      </van-list>

      <!-- 无数据时页面 -->
      <van-empty v-else description="暂无工资条" />
    </van-pull-refresh>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchEnumList, getPayRollList } from "@/api/oaModule";
import dayjs from "dayjs";

const props = defineProps(["dropKey"]);
const router = useRouter();
const route = useRoute();
const statusOpts = ref<any[]>([]);

const refreshing = ref(false);
let listInfo = reactive({
  payrollList: [] as any[]
});

// 下拉刷新操作
const onRefresh = () => {
  setTimeout(() => {
    getList();
    refreshing.value = false;
  }, 1000);
};

const clickToDetail = (item) => {
  const { Gzmbb, GzmbNo, id, yearMonth } = item;
  router.push({
    path: `/oa/payroll/${id}`,
    query: { gzmbNo: GzmbNo, yearMonth }
  });
};

// 获取列表
const getList = () => {
  if (props.dropKey) {
    getPayRollList({ gzDate: props.dropKey, gzStatus: "" }).then((res) => {
      if (res.data && res.status === 200) {
        listInfo.payrollList = res.data;
      }
    });
  }
};

// 获取工资单状态汉字以及标签颜色
const getPayRollListStatusByStr = (str) => {
  let statusText;
  let colorStr;
  switch (str) {
    case "1":
      statusText = "待分发";
      colorStr = "primary";
      break;
    case "2":
      statusText = "分发失败";
      colorStr = "danger";

      break;
    case "3":
      statusText = "待签名";
      colorStr = "primary";

      break;
    case "4":
      statusText = "异常反馈";
      colorStr = "warning";

      break;
    case "5":
      statusText = "已签名";
      colorStr = "success";

      break;
    case "6":
      statusText = "已归档";
      colorStr = "success";

      break;
    default:
      break;
  }

  return { statusText, colorStr };
};

// 当下拉年份改变时就要重新加载列表
watch(props, () => getList());

// 路由改变就要重新加载列表
watch(route, (newVal) => {
  if (newVal.path === "/oa/payroll") {
    getList();
  }
});

const getOpts = () => {
  fetchEnumList({ optioncode: "PayStubsStatus" }).then((res) => {
    if (res.data) {
      const result = res.data.find((item) => item.optionCode === "PayStubsStatus")?.optionList || [];
      statusOpts.value = result;
    }
  });
};

const calcStatusText = (status) => {
  return statusOpts.value.find((el) => el.optionValue == status)?.optionName;
};

// 第一次加载列表
onMounted(() => {
  getOpts();
  getList();
});
</script>

<style scoped lang="scss">
.my-pay {
  margin-top: 4px;
  padding: 6px;

  .list-item {
    .sfgz {
      color: #000;
    }

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
</style>
