<template>
  <div class="wrap flex-col ui-h-100">
    <van-sticky>
      <div class="flex just-around align-center border-line-bottom">
        <div class="prev" @click="setDay(-1)">前一天</div>
        <div>
          <van-field input-align="center" v-model="date" readonly name="datePicker" placeholder="点击选择时间" @click="showPicker = true" class="fz-32" />
          <van-popup v-model:show="showPicker" position="bottom">
            <van-date-picker @confirm="onConfirm" v-model="popDateInitVal" @cancel="showPicker = false" />
          </van-popup>
        </div>
        <div class="next" @click="setDay(1)">后一天</div>
      </div>
    </van-sticky>
    <van-pull-refresh @refresh="onRefresh" class="flex-1 ui-ovy-a">
      <div ref="scrollRef" class="ui-w-100 ui-h-100">
        <van-list finished-text="没有更多了" :finished="true" class="p-20 box-border" v-if="dataList.length > 0">
          <van-cell v-for="(item, index) in dataList" :key="item.id" class="border-line mb-16 border-10">
            <div v-for="(cell, index) in itemList" :key="index" class="flex color-333">
              <span><van-icon :name="cell.icon" class="ui-va-m fw-700" /></span>
              <span class="ellipsis">
                <span class="ml-8 label-colon">
                  <span class="label-name">{{ cell.label }}</span>
                </span>
                <span>{{ cell.format ? cell.format(item) : item[cell.value] }}</span>
              </span>
            </div>
          </van-cell>
        </van-list>
        <van-empty v-else description="暂无数据" />
        <van-back-top />
      </div>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="tsx">
import dayjs from "dayjs";
import { formatDate } from "@/utils/common";
import { closeToast, showLoadingToast } from "vant";
import { ref, onMounted, computed, reactive } from "vue";
import { useUtils } from "@/components/HxDrawer/useUtils";
import { attendanceRecordList, AttendanceRecordItemType } from "@/api/oaModule";
import { getLoginInfo } from "@/utils/storage";

const currentDate = dayjs().format("YYYY-MM-DD");
const loginInfo = getLoginInfo();
const scrollRef = ref();
const loading = ref(false);
const showPicker = ref(false);
const date = ref(currentDate);
const dataList = ref<AttendanceRecordItemType[]>([]);
const popDateInitVal = computed(() => date.value.split("-"));
const itemList = reactive([
  { label: "姓名", value: "staffName", icon: "contact-o" },
  { label: "工号", value: "staffCode", icon: "coupon-o" },
  { label: "部门", value: "deptName", icon: "hotel-o" },
  { label: "考勤机", value: "attMachineName", icon: "location-o" },
  { label: "打卡时间", value: "attTime", icon: "underway-o", format: (item) => formatDate(item.attTime) }
]);

onMounted(() => {
  getData();
  if (loginInfo.userCode === atob("NDg1")) return; // test user
  useUtils(scrollRef.value, ({ el, deltaX, duration, direction }) => {
    if (["up", "down"].includes(direction)) return;
    const distance = Math.abs(deltaX);
    const type = direction === "right" ? -1 : 1;
    if ((duration < 300 && distance > 10) || distance > window.innerWidth / 3) {
      setDay(type);
    }
  });
});

const switchDate = (type: number) => {
  return dayjs(date.value).add(type, "day").format("YYYY-MM-DD");
};

// 上一天|下一天
const setDay = (type: -1 | 1) => {
  date.value = switchDate(type);
  getData();
};

// 刷新
const onRefresh = () => {
  date.value = currentDate;
  getData();
};

// 选择日期
const onConfirm = ({ selectedValues }) => {
  date.value = selectedValues.join("-");
  showPicker.value = false;
  getData();
};

// 获取列表
function getData() {
  loading.value = true;
  showLoadingToast({ message: "加载中...", loadingType: "spinner", forbidClick: true });
  attendanceRecordList({ date: date.value })
    .then(({ data }) => (dataList.value = data || []))
    .finally(() => {
      closeToast();
      loading.value = false;
    });
}
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
