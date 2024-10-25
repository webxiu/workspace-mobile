<script lang="ts" setup>
import { ref, onMounted } from "vue";
import MyApply from "./List.vue";
import { fetchLineList } from "@/api/oaModule";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import { computed } from "vue";

const selectedTab = ref(0);
const selectedMenuValue = ref("");
const swipeRef = ref();
const line = ref("");
const childRef: any = ref(null);
const lineColumns = ref<any>([]);
const isReset = ref(false);
const endTime = ref(dayjs().format("YYYY-MM-DD"));
const model = ref("");

const tabs = [MyApply];

const onSwipeChange = (index: number) => {
  selectedTab.value = index;
  swipeRef.value?.swipeTo(index);
};

const onSearch = () => {
  childRef.value &&
    (childRef.value[0] as any).getList({
      name: model.value,
      prodline: line.value,
      isReset: isReset.value,
      date: endTime.value
    });
};

const onSearchInput = (val) => {
  model.value = val;
  resetPage();
  onSearch();
};

const getParams = () => ({
  name: model.value,
  prodline: line.value,
  date: endTime.value
});
const route = useRoute();

const getTodayThree = (days) => {
  let nowDate = new Date();
  let nowTime = nowDate.getTime(); //当前时间戳
  let futureTime = Math.abs(nowTime) + days * 24 * 60 * 60 * 1000; //days天后的时间戳
  let futureDate = new Date(futureTime);
  let year = futureDate.getFullYear() + "";
  let month = futureDate.getMonth() + 1 + "";
  if (+month < 10) month = "0" + month;
  let date = futureDate.getDate() + "";
  if (+date < 10) date = "0" + date;
  return year + "-" + month + "-" + date;
};

onMounted(() => {
  const { isLink } = route.query;

  if (isLink) {
    endTime.value = getTodayThree(1);
    childRef.value &&
      (childRef.value[0] as any).getList({
        name: model.value,
        prodline: line.value,
        date: endTime.value
      });
  }
  fetchLineList({}).then((res) => {
    const dataArr = res.data.map((item) => ({
      text: item.FNAME,
      value: item.FNAME
    }));

    dataArr.unshift({ text: "全部产线", value: "" });

    lineColumns.value = dataArr;
  });
});

const resetPage = () => {
  isReset.value = true;
};

const leftClick = () => onSearch();

const clickPre = () => {
  endTime.value = dayjs(endTime.value).add(-1, "day").format("YYYY-MM-DD");
  resetPage();
  onSearch();
};

const clickNext = () => {
  endTime.value = dayjs(endTime.value).add(1, "day").format("YYYY-MM-DD");
  resetPage();
  onSearch();
};
const showPicker = ref(false);
const popDateInitVal = computed(() => {
  return endTime.value.split("-");
});

const onConfirm = ({ selectedValues }) => {
  endTime.value = selectedValues.join("-");
  showPicker.value = false;
  resetPage();
  onSearch();
};

const changeMenu = () => {
  resetPage();
  onSearch();
};
</script>

<template>
  <div class="leave">
    <van-sticky>
      <div class="filter-area">
        <div class="pre" @click="clickPre">上一天</div>
        <div>
          <van-field input-align="center" v-model="endTime" readonly name="datePicker" placeholder="点击选择时间" @click="showPicker = true" />
          <van-popup v-model:show="showPicker" position="bottom">
            <van-date-picker @confirm="onConfirm" v-model="popDateInitVal" @cancel="showPicker = false" />
          </van-popup>
        </div>
        <div class="next" @click="clickNext">下一天</div>
      </div>
      <div style="display: flex">
        <van-search
          class="search"
          v-model="model"
          shape="round"
          background="#fff"
          placeholder="请输入型号"
          @search="onSearchInput"
          @click-left-icon="leftClick"
          :clearable="false"
        />
        <van-dropdown-menu style="flex: 1">
          <van-dropdown-item v-model="line" :options="lineColumns" @change="changeMenu" />
        </van-dropdown-menu>
      </div>
    </van-sticky>

    <!-- 滑动区域 -->
    <van-swipe ref="swipeRef" @change="onSwipeChange" :loop="false" :show-indicators="false">
      <van-swipe-item v-for="(_, index) in tabs" :key="index">
        <component ref="childRef" :is="tabs[index]" :dropKey="selectedMenuValue" :selectedTab="selectedTab" :getParams="getParams" />
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<style lang="scss" scoped>
.leave {
  height: 100%;

  :deep(.van-dropdown-menu__bar) {
    box-shadow: none !important;
  }

  .filter-area {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    background-color: #fff;

    .search {
      flex: 1;
    }

    .pre,
    .next {
      font-size: 25px;
      // background-color: red;
      color: #6389fa;
      // background-color: #bda29a;
      height: 100%;
    }
    .date-range {
      margin: 0 15px;
      font-size: 27px;
    }
  }
  :deep(.van-badge) {
    background-color: #1989fa;
  }

  :deep(.van-tabs__wrap) {
    touch-action: manipulation;
  }
  :deep(.van-tabs__content) {
    width: 750px;
    height: 100%;
    background: #f60;
  }
  .add-action {
    width: 90px;
    border-radius: 50%;
    box-shadow: 2px 3px 6px grey;
    background-color: #5686ff;
    bottom: 480px;
    right: 70px;
    height: 90px;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    z-index: 100;
  }
}
</style>
