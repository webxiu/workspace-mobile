<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import MyApply from "./MyApply.vue";
import MyRecord from "./MyRecord.vue";
import { DatePickerColumnType, showConfirmDialog, showToast } from "vant";
import { applyMealCard, verifyMealCard } from "@/api/oaModule";
import { useAppStore } from "@/store/modules/app";
import dayjs from "dayjs";

const tabs = [MyApply];
const appStore = useAppStore();

const selectedTab = ref(0);
const showApplyBtn = ref(false);
const selectedMenuValue = ref("");
const swipeRef = ref();
const columnsType: DatePickerColumnType[] = ["year", "month"];
const currentDateArr = new Date().toLocaleDateString().split("/");
const currentDate = ref(currentDateArr.slice(0, 2));
const disabledBtn = ref(false);

const childRef = ref(null);
const isCurMonth = ref(false);

const onTabChange = (index: number) => {
  selectedTab.value = index;
  swipeRef.value?.swipeTo(index);
};

const onSwipeChange = (index: number) => {
  selectedTab.value = index;
  swipeRef.value?.swipeTo(index);
};

const beforeClose = (action: string): Promise<boolean> =>
  new Promise((resolve) => {
    if (action === "cancel") {
      resolve(true);
    }
    setTimeout(() => {
      if (action === "confirm") {
        // const monthStr = currentDate.value[1] + "";
        // monthStr.replaceAll('0','');
        applyMealCard({
          year: isCurMonth ? currentDate.value[0] : "",
          month: isCurMonth ? +currentDate.value[1] + "" : "",
          nowMonth: isCurMonth.value
        })
          .then((res) => {
            if (res.data && res.status) {
              showToast("申领成功！");

              childRef.value && (childRef.value[0] as any).getList();
            }
          })
          .catch(console.log)
          .finally(() => resolve(true));
      }
    }, 1000);
  });

// 直接点击申请弹窗确认
const handleClickApplayRoundBtn = () => {
  disabledBtn.value = true;
  // selectedTab.value = 1;
  // showConfirmDialog({
  //   title: "是否确认申领餐卡",
  //   // message:
  //   // "所申领的日期为：" + selectedValues[0] + "年" + selectedValues[1] + "月",
  //   beforeClose,
  // }).catch(() => {});
  verifyMealCard({})
    .then((res: any) => {
      if (res.status === 200 && res.data.flag) {
        // showConfirmDialog({
        //   title: "是否确认申领餐卡",
        //   // message:
        //   // "所申领的日期为：" + selectedValues[0] + "年" + selectedValues[1] + "月",
        //   beforeClose,
        // }).catch(() => {});
        isCurMonth.value = res.data?.nowMonth;

        if (res.data.nowMonth) {
          showApplyBtn.value = true;
          return;
        }
        confirmApplyAction({ selectedValues: currentDateArr });
      }
    })
    .catch(console.log)
    .finally(() => (disabledBtn.value = false));
};

const confirmApplyAction = ({ selectedValues }) => {
  const [year, month] = dayjs().add(1, "month").format("YYYY-MM").split("-");
  const calcYear = isCurMonth.value ? selectedValues[0] : year;
  const passFlagYear = showApplyBtn.value ? selectedValues[0] : calcYear;

  const calcMonth = isCurMonth.value ? selectedValues[1] : +month;
  const passFlagMonth = showApplyBtn.value ? selectedValues[1] : calcMonth;
  showApplyBtn.value = false;
  showConfirmDialog({
    title: "是否确认申领餐卡",
    message:
      "所申领的日期为：" +
      passFlagYear +
      "年" +
      passFlagMonth +
      "月\n" +
      (isCurMonth.value && selectedValues[1] == +currentDateArr[1] ? "注意：余额会在下月月底进行清零" : ""),
    beforeClose
  }).catch(() => {});
};

const filterOpts = (type, options) => {
  if (type === "year") {
    return options.filter((option) => {
      if (+currentDateArr[1] === 12) {
        return Number(option.value) >= +currentDateArr[0] && Number(option.value) <= +currentDateArr[0] + 1;
      }
      return Number(option.value) === +currentDateArr[0];
    });
  }
  if (type === "month") {
    return options.filter((option) => {
      if (+currentDateArr[1] === 12) {
        return Number(option.value) === 12 || Number(option.value) === 1;
      }
      return Number(option.value) >= +currentDateArr[1] && Number(option.value) <= +currentDateArr[1] + 1;
    });
  }
  return options;
};
</script>

<template>
  <div class="leave">
    <van-sticky>
      <div>
        <!-- tab导航 -->
        <van-tabs v-model:active="selectedTab" line-width="70" line-height="3" title-active-color="#1989fa" swipeable sticky @change="onTabChange">
          <van-tab :key="0" title="申 领 记 录" />
          <!-- <van-tab :key="1" title="发放记录" /> -->
        </van-tabs>
      </div>
    </van-sticky>

    <!-- 滑动区域 -->
    <van-swipe ref="swipeRef" @change="onSwipeChange" :loop="false" :show-indicators="false">
      <van-swipe-item v-for="(_, index) in tabs" :key="index">
        <component ref="childRef" :is="tabs[index]" :dropKey="selectedMenuValue" :selectedTab="selectedTab" />
      </van-swipe-item>
    </van-swipe>

    <!--新增加班单按钮-->

    <!-- @click.stop="handleClickApplayRoundBtn" @click.stop="showApplyBtn = true" -->
    <div class="add-action" v-show="!selectedTab">
      <van-button round type="primary" :disabled="disabledBtn" @click.stop="handleClickApplayRoundBtn">申领</van-button>
    </div>
  </div>
  <van-popup v-model:show="showApplyBtn" position="bottom">
    <van-date-picker
      v-model="currentDate"
      title="选择申领日期"
      @cancel="showApplyBtn = false"
      @confirm="confirmApplyAction"
      cancel-button-text="关闭"
      :columns-type="columnsType"
      :filter="filterOpts"
    />
  </van-popup>
</template>

<style lang="scss" scoped>
.leave {
  height: 100%;
  // position: relative;
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
    // bottom: 170px;
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
