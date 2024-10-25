<template>
  <div class="box-water">
    <div class="search-date">
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <div
          class="pre"
          @click="clickTop('left')"
          style="color: #1989fa; font-size: 16px; padding-left: 16px"
        >
          上月
        </div>
        <div style="flex: 1">
          <van-search
            v-model="searchDate"
            placeholder="点击选择"
            :clearable="false"
            shape="round"
            readonly
          />
        </div>
        <div
          class="pre"
          @click="clickTop('right')"
          style="color: #1989fa; font-size: 16px; padding-right: 16px"
        >
          下月
        </div>
      </div>

      <!-- <van-popup v-model:show="showPicker" position="bottom">
        <van-date-picker
          v-model="currentDate"
          :formatter="formatter"
          title="选择年月"
          @confirm="onConfirm"
          @cancel="showPicker = false"
          :columns-type="columnsType"
        />
      </van-popup> -->
    </div>

    <div class="tab-page">
      <van-tabs v-model:active="active">
        <van-tab title="抄表"><ZoomSelect :searchDate="searchDate" /></van-tab>
        <van-tab title="数据"
          ><ViewList
            ref="listRef"
            drop-key="key"
            :selected-tab="1"
            :searchDate="searchDate"
            :get-params="getParams"
        /></van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { DatePickerColumnType } from "vant";
import { ref } from "vue";
import ViewList from "./list.vue";
import ZoomSelect from "./zoomSelect.vue";

const dateValue = dayjs().format("YYYY-MM");
const searchDate = ref(dateValue);
const showPicker = ref(false);
const active = ref(0);
const listRef = ref();

const [year, month] = dateValue.split("-");
const currentDate = ref([year, month]);
const columnsType: DatePickerColumnType[] = ["year", "month"];

const clickTop = (type) => {
  if (type === "left") {
    searchDate.value = dayjs(searchDate.value)
      .add(-1, "month")
      .format("YYYY-MM");
  } else if (type === "right") {
    searchDate.value = dayjs(searchDate.value)
      .add(1, "month")
      .format("YYYY-MM");
  }
};

const getParams = () => {
  return { searchDate: searchDate };
};
</script>
