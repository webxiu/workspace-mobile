<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-06-23 09:55:54 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-06-23 09:55:54 
 */ -->
<template>
  <van-list :finished="true" finished-text="没有更多了" class="p-16 box-border">
    <van-cell
      v-for="(item, index) in dataList"
      :key="item.billNo"
      class="customer-cell"
    >
      <div class="flex just-between">
        <div class="ui-va-m">
          <span class="custom-index">{{ index + 1 }}</span>
          <span class="ml-8 color-333">【{{ item.deployKey }}】</span>
        </div>
        <van-button type="primary" size="mini" class="flex-shrink">
          {{ item.status }}
        </van-button>
      </div>
      <div class="flex just-between align-end mt-40" @click="onClickItem(item)">
        <div>
          <div>
            <van-icon name="comment-circle-o" />
            <span class="ml-8 color-333">业务单号：{{ item.fbillNumber }}</span>
          </div>
          <div>
            <van-icon name="underway-o" />
            <span class="ml-8 color-333"
              >发起时间：{{ item.processStartTime }}</span
            >
          </div>
        </div>
        <van-button type="primary" plain size="mini" style="border: none">
          详情<van-icon name="arrow" />
        </van-button>
      </div>
    </van-cell>
  </van-list>
</template>

<script lang="ts" setup>
import { ref, PropType } from "vue";
export interface TaskItemType {
  billNo: string;
  fbillNumber: string;
  formId: string;
  status: string;
  processState: string;
  deployKey: string;
  processCreateUserName: string;
  approvalResult: null;
  processStartTime: string;
  approverUserNames: string;
  completedTime: string;
  userCode: any;
  unApprovalCount: any;
  detailMasterResults: any;
  detailChildrenResults: any;
  detailChildrenColumns: any;
  billType: any;
}

defineProps({
  dataList: {
    type: Array as PropType<TaskItemType[]>,
    default: () => [],
  },
});

const emits = defineEmits(["onLookInfo"]);
const onClickItem = (item) => {
  emits("onLookInfo", item);
};
</script>

<style lang="scss" scoped>
.custom-index {
  background: gray;
  color: #fff;
  border-radius: 50%;
  display: inline-block;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  font-size: 24px;
  font-weight: 700;
}
.customer-cell {
  margin-top: 20px;
  border: 1px solid #dddee1;
}
:deep(.van-cell__value) {
  text-align: left;
}
</style>
