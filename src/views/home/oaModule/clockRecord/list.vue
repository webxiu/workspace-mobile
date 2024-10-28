<template>
  <div class="wrap flex-col ui-h-100">
    <van-sticky>
      <div class="flex just-around align-center border-line-bottom">
        <van-field input-align="center" v-model="dateRange" readonly name="datePicker" placeholder="点击选择" @click="onOpen" class="fz-28" />
        <van-button size="small" @click="emits('switch')" class="no-wrap mr-20">切换</van-button>
      </div>
    </van-sticky>
    <van-pull-refresh v-model="loading" @refresh="onRefresh" class="flex-1 ui-ovy-a">
      <van-list finished-text="没有更多了" :finished="true" class="p-20 box-border" v-if="dataList.length > 0">
        <van-cell v-for="(item, index) in dataList" :key="item.date" class="border-line mb-16 border-10">
          <div class="ui-ovx-a">
            <div class="ui-ta-l">
              <van-tag size="small" type="success" class="mr-10">{{ item?.list.length }}</van-tag>
              <van-tag size="small" type="primary" class="mr-10">{{ item.date }}</van-tag>
              <van-tag size="small" type="success" plain>{{ item.staffName }} ({{ item.staffCode }}) {{ item.deptName }}</van-tag>
            </div>
            <div v-for="(record, index) in item.list" :key="record.id" class="flex color-333">
              <div v-for="(cell, index) in itemList" :key="index" class="flex color-333 mr-20">
                <span class="ellipsis">
                  <span class="ml-8 label-colon">
                    <span class="label-name">{{ cell.formatLabel?.(record) || cell.label }}</span>
                  </span>
                  <span>{{ cell.format?.(record) || record[cell.value] }}</span>
                </span>
              </div>
            </div>
          </div>
        </van-cell>
      </van-list>
      <van-empty v-else description="暂无数据" />
      <van-back-top />
    </van-pull-refresh>

    <van-popup v-model:show="showPicker" position="bottom">
      <van-calendar
        type="range"
        ref="calendarRef"
        :show-mark="false"
        :min-date="minDate"
        :max-date="maxDate"
        v-model:show="showPicker"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup lang="tsx">
import dayjs from "dayjs";
import { formatDate } from "@/utils/common";
import { getLoginInfo } from "@/utils/storage";
import { ref, onMounted, computed, reactive, nextTick } from "vue";
import { attendanceRecordAllList, AttendanceRecordMulItemType, fetchHrDocList, HrDocItemType } from "@/api/oaModule";

type ListItemType = {
  date: string;
  staffName: string;
  staffCode: string;
  deptName: string;
  list: AttendanceRecordMulItemType[];
};

const calendarRef = ref();
const loading = ref(false);
const showPicker = ref(false);
const dataList = ref<ListItemType[]>([]);
const userList = ref<HrDocItemType[]>([]);
const loginInfo = getLoginInfo();
const endDate = dayjs().format("YYYY-MM-DD");
const startDate = dayjs().startOf("month").format("YYYY-MM-DD");
const minDate = new Date(dayjs().subtract(5, "year").format("YYYY-MM-DD"));
const maxDate = new Date(dayjs().format("YYYY-MM-DD"));
const emits = defineEmits(["switch"]);

const formData = reactive({
  page: 1,
  limit: 500,
  staffName: loginInfo.userName,
  startDate: startDate,
  endDate: endDate
});

const itemList = reactive([
  {
    label: "打卡时间",
    value: "attTime",
    formatLabel: (item) => {
      const date = new Date(item.attTime);
      const hour = date.getHours();
      if (hour > 7 && hour < 11) return "上午";
      if (hour >= 11 && hour < 15) return "中午";
      if (hour >= 15 && hour < 19) return "下午";
      if (hour >= 19 && hour < 23) return "晚上";
      return "其他";
    },
    format: (item) => formatDate(item.attTime, "HH:mm:ss")
  },
  { label: "考勤机", value: "attMachineName" }
]);
const dateRange = computed(() => `${formData.startDate} ~ ${formData.endDate}`);

onMounted(() => {
  getOption();
  getData();
});

const getOption = () => {
  fetchHrDocList({ limit: 500, page: 1 }).then((res) => {
    userList.value = res.data?.records || [];
  });
};

const onRefresh = () => {
  formData.staffName = loginInfo.userName;
  formData.startDate = startDate;
  formData.endDate = endDate;
  getData();
};

const onOpen = () => {
  showPicker.value = true;
  nextTick(() => {
    const dateArr = [new Date(formData.startDate), new Date(formData.endDate)];
    calendarRef.value?.reset(dateArr);
  });
};

const onConfirm = (data) => {
  formData.startDate = dayjs(data[0]).format("YYYY-MM-DD");
  formData.endDate = dayjs(data[1]).format("YYYY-MM-DD");
  showPicker.value = false;
  getData();
};

// 获取列表
function getData() {
  loading.value = true;
  attendanceRecordAllList(formData)
    .then(({ data }) => {
      if (!data?.records) data.records = [];
      const cateList = data?.records.reduce((acc, user) => {
        const dateKey = dayjs(user.attTime).format("YYYY-MM-DD");
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(user);
        return acc;
      }, {});
      const formattedList = Object.keys(cateList).map((date) => {
        const list = cateList[date].reverse();
        const { staffName, staffCode, deptName } = list[0] || ({} as ListItemType);
        return {
          date: date,
          staffName,
          staffCode,
          deptName,
          list
        };
      });
      dataList.value = formattedList;
    })
    .finally(() => (loading.value = false));
}
</script>

<style lang="scss" scoped></style>
