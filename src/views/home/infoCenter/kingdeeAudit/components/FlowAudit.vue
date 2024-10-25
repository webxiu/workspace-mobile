<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-06-23 09:55:47 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-06-23 09:55:47 
 */ -->
<template>
  <div class="flow-row">
    <i class="kd-icon icon-status" :style="{ background: statusObj[`${item.FSTATUS}`] }"></i>
    <div class="flow-info">
      <div class="flow-title">
        <div
          class="flow-activity"
          :style="{
            color: item.FSTATUSNAME ? statusObj['1'] : statusObj['4']
          }"
        >
          {{ item.FACTNAME || item.FSTATUSNAME }}
        </div>
        <div class="wrapper-info">
          <div
            class="flow-status"
            :style="{
              color: item.FSTATUS === 0 ? statusObj['5'] : statusObj['1']
            }"
          >
            {{ item.FRESULTNAME }}
          </div>
          <div
            class="flow-status"
            v-if="item.FDISPOSITION"
            :style="{
              color: statusObj[5],
              width: '180px',
              textAlign: 'right',
              paddingRight: '8px'
            }"
          >
            {{ item.FDISPOSITION }}
          </div>
        </div>
      </div>
      <div class="flow-users flex just-between align-center" v-if="!item.FSTATUSNAME">
        <div class="flow-user flex align-center">
          <div class="user-icon">{{ item.lastName }}</div>
          <div class="user-name ml-20">{{ item.FRECEIVERNAMES }}</div>
        </div>
        <div class="flow-date">{{ item.FCOMPLETEDTIME }}</div>
      </div>
      <div v-else class="fz-28 ui-w-100 flex-1">
        <span>流程实例编码：{{ item.FNUMBER }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from "vue";

export interface AuditNodeItemType {
  FRECEIVERNAMES: string;
  lastName: string;
  FCOMPLETEDTIME: string;
  FRESULTNAME: string;
  FRESULT: string;
  FACTNAME: string;
  FSTATUS: number;
  FDISPOSITION: string;
  FSTATUSNAME?: string;
  FNUMBER?: string;
}

const statusObj = {
  "0": "#F35959",
  "1": "#32AA70",
  "4": "#1d1d1d",
  "5": "#59595c"
};

defineProps({
  item: { type: Object as PropType<AuditNodeItemType>, default: () => [] }
});
</script>

<style lang="scss" scoped>
.flow-row {
  position: relative;
  padding: 0 0 64px 36px;

  &:not(:last-child):after {
    content: "";
    height: 100%;
    display: block;
    position: absolute;
    left: 7px;
    top: 0px;
    border-left: 2px dotted rgba(50, 170, 112, 0.7);
  }
  .kd-icon {
    position: absolute;
    top: -5px;
    left: -1px;
    width: 18px;
    height: 18px;
    border-radius: 18px;
    background: #32aa70;
    z-index: 1;
  }
  .flow-title {
    position: relative;
    top: -20px;
    left: 12px;
  }
  .flow-activity {
    line-height: 48px;
    font-size: 32px;
    color: rgba(29, 29, 29, 1);
    font-weight: 700;
  }

  .wrapper-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .flow-status {
    margin-top: 8px;
    font-size: 28px;
    font-weight: 400;
    line-height: 40px;
    color: #26b175;
  }
  .flow-users {
    margin-top: 20px;
    font-size: 28px;
    .flow-date {
      font-size: 28px;
    }
    .user-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      background-color: pink;
      width: 72px;
      height: 72px;
      border-radius: 50%;
    }
  }
}
</style>
