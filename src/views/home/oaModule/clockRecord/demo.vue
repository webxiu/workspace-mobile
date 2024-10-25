<template>
  <HxLoadList :api="fetchProdScheduleList" empty-text="开发中..." :show-toast-loading="false" :formData="formData" :onParams="onParams">
    <template #header>
      <div class="flex just-around align-center border-line-bottom">
        <div class="prev" @click="setDay(-1)">前一天</div>
        <div>
          <van-field
            input-align="center"
            v-model="formData.date"
            readonly
            name="datePicker"
            placeholder="点击选择时间"
            @click="showPicker = true"
            class="fz-32"
          />
          <van-popup v-model:show="showPicker" position="bottom">
            <van-date-picker @confirm="onConfirm" v-model="popDateInitVal" @cancel="showPicker = false" />
          </van-popup>
        </div>
        <div class="next" @click="setDay(1)">后一天</div>
      </div>
    </template>
    <template #list="{ item }">
      <div v-for="(cell, index) in itemList" :key="index" class="flex color-333">
        <span><van-icon :name="cell.icon" class="ui-va-m fw-700" /></span>
        <span class="ellipsis">
          <span class="ml-8 label-colon">
            <span class="label-name">{{ cell.label }}</span>
          </span>
          <span>{{ cell.format ? cell.format(item) : item[cell.value] }}</span>
        </span>
      </div>
    </template>
  </HxLoadList>
</template>

<script setup lang="tsx">
import dayjs from "dayjs";
import { formatDate } from "@/utils/common";
import { ref, computed, reactive } from "vue";
import { fetchProdScheduleList } from "@/api/oaModule";
import HxLoadList from "@/components/HxLoadList/index.vue";

/**
 * ==================== 下拉刷新组件使用示例 ====================
 */

const showPicker = ref(false);
const currentDate = dayjs().format("YYYY-MM-DD");
const formData = reactive({ page: 1, limit: 20, date: currentDate });
const popDateInitVal = computed(() => formData.date.split("-"));
const itemList = reactive([
  { label: "姓名", value: "FBILLNO", icon: "contact-o" },
  { label: "姓名", value: "Prodline", icon: "contact-o" },
  { label: "工号", value: "FNAME", icon: "coupon-o" },
  { label: "部门", value: "FPlanQty", icon: "hotel-o" },
  { label: "打卡时间", value: "PlanDate", icon: "underway-o", format: (item) => formatDate(item.attTime) }
]);

const switchDate = (type: number) => {
  return dayjs(formData.date).add(type, "day").format("YYYY-MM-DD");
};

// 上一天|下一天
const setDay = (type: -1 | 1) => {
  formData.date = switchDate(type);
};

// 选择日期
const onConfirm = ({ selectedValues }) => {
  formData.date = selectedValues.join("-");
  showPicker.value = false;
};

// 刷新
const onParams = () => {
  return { ...formData, date: currentDate };
};
</script>

<style lang="scss" scoped>
.wrap {
  .label-name {
    width: 120px;
    display: inline-block;
  }
  .prev,
  .next {
    font-size: 32px;
    color: #6389fa;
    height: 100%;
  }
}
</style>
