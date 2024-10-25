<template>
  <div class="my-create-task">
    <div class="list-content">
      <van-list
        v-if="resultList.length"
        :offset="10"
        :immediate-check="false"
        finish-text="没有更多了"
      >
        <div
          v-for="(item, index) in resultList"
          :key="item.userName"
          style="
            border-radius: 6px;
            border: 1px solid #dddee1;
            margin: 0 6px 5px;
          "
        >
          <div class="list-item" style="margin: 2px">
            <van-cell>
              <!-- 使用title插槽来自定义标题 -->
              <template #title>
                <div class="title-head">
                  <div class="head-left">
                    <van-badge :content="index + 1" color="#5686ff"></van-badge>
                    【{{ item.projectName }}】
                  </div>

                  <div class="head-right">
                    <van-tag type="primary" style="margin-left: 10px">
                      {{ item.stateName }}
                    </van-tag>

                    <van-tag
                      :color="getColorByPriority(item.priority)"
                      style="margin-left: 10px"
                      >{{ item.priority }}</van-tag
                    >
                  </div>
                </div>
              </template>
              <template #label>
                <div style="color: #1989fa">
                  <van-icon name="coupon-o" />
                  <span class="content-offset"
                    >项目编号：{{ item.projectNo }}</span
                  >
                </div>
              </template>
            </van-cell>

            <van-cell>
              <template #title>
                <div style="color: #aaa">
                  <div style="text-align: justify">
                    <van-icon name="notes-o" />
                    <span class="content-offset"
                      >任务编号：{{ item.taskNo }}</span
                    >
                  </div>
                  <div style="text-align: justify">
                    <van-icon name="todo-list-o" />
                    <span class="content-offset"
                      >任务名称：{{ item.taskName }}</span
                    >
                  </div>
                  <div>
                    <van-icon name="flag-o" />
                    <span class="content-offset"
                      >完成目标：{{ item.completeTarget }}</span
                    >
                  </div>
                  <div>
                    <van-icon name="underway-o" />
                    <span class="content-offset"
                      >计划完成时间：{{ item.planCompleteDate }}</span
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { getColorByPriority } from "@/utils/common";

const resultList: any = ref([]);

const initData = (res) => {
  resultList.value = res.data;
};

defineExpose({ initData });
</script>

<style lang="scss" scoped>
.my-create-task {
  margin: 10px 0 10px;
  // height: calc(100vh - 90px);
  .list-content {
    .list-item {
      .title-head {
        display: flex;
        justify-content: space-between;
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
  }
}
</style>
