<script lang="ts" setup>
import { onMounted, ref, reactive } from "vue";
import MyApply from "./List.vue";
import { DatePickerColumnType, showToast } from "vant";
import { fetchDeptTreeData } from "@/api/oaModule";

const tabs = [MyApply];

const pageParams = reactive({ limit: 10, page: 1 });

const selectedTab = ref(0);
const showApplyBtn = ref(false);
const selectedMenuValue = ref("");
const deptIdList = ref<any>([]);
const swipeRef = ref();
const staffId = ref("");
const showDept = ref(false);
const deptName = ref("");
const cascaderValue = ref("");
const options = ref([]);
const staffName = ref("");
const state = ref("在职");
const showLeft = ref(false);
// const showLeft = ref(true);
const startTime = ref("");
const endTime = ref("");
const showApplyBtn1 = ref(false);
// const currentDate = ref(["2021", "01"]);
// const currentDate1 = ref(["2021", "01"]);
const columnsType: DatePickerColumnType[] = ["year", "month", "day"];
const currentDate = new Date().toLocaleDateString().split("/");
const currentDate1 = new Date().toLocaleDateString().split("/");
const childRef = ref(null);

const fieldNames = {
  text: "name",
  value: "id",
  children: "children"
};

const onSwipeChange = (index: number) => {
  selectedTab.value = index;
  swipeRef.value?.swipeTo(index);
};

const confirmApplyAction = ({ selectedValues }) => {
  showApplyBtn.value = false;
  startTime.value = selectedValues.join("-");
};

const confirmApplyAction1 = ({ selectedValues }) => {
  showApplyBtn1.value = false;
  endTime.value = selectedValues.join("-");
};

const filterOpts = (type, options) => {
  // if (type === "year") {
  //   return options.filter(
  //     (option) => Number(option.value) >= +currentDateArr[0]
  //   );
  // }
  // if (type === "month") {
  //   return options.filter(
  //     (option) => Number(option.value) >= +currentDateArr[1]
  //   );
  // }
  return options;
};

const onSearch = (val) => {
  childRef.value &&
    (childRef.value[0] as any).getList({
      ...pageParams,
      staffId: staffId.value,
      state: state.value,
      deptIdList: deptIdList.value,
      staffName: staffName.value
    });
};
const onClickSearchBtn = () => {
  childRef.value &&
    (childRef.value[0] as any).getList({
      ...pageParams,
      staffId: staffId.value,
      state: state.value,
      deptIdList: deptIdList.value,
      staffName: staffName.value
    });
};

const onSubmit = (v) => {
  showLeft.value = false;
  childRef.value &&
    (childRef.value[0] as any).getList({
      ...pageParams,
      ...v,
      deptIdList: deptIdList.value,
      staffId: staffId.value
    });
};

const onReset = () => {
  startTime.value = "";
  endTime.value = "";
  // staffId.value = "";
  showLeft.value = false;
  deptIdList.value = [];
  deptName.value = "";
  cascaderValue.value = "";

  childRef.value &&
    (childRef.value[0] as any).getList({
      ...pageParams,
      staffId: staffId.value
    });
};

const getDeptData = () => {
  fetchDeptTreeData({}).then((res) => {
    options.value = res.data[0]?.children || [];
  });
};

onMounted(() => {
  getDeptData();
});

// 全部选项选择完毕后，会触发 finish 事件
const onFinish = ({ selectedOptions }) => {
  showDept.value = false;
  //   deptName.value = selectedOptions.map((option) => option.name).join("/");
  deptName.value = selectedOptions.map((option) => option.name)[selectedOptions.length - 1];
  const lastDeptId = selectedOptions.map((item) => item.id)[selectedOptions.length - 1];
  deptIdList.value = [lastDeptId];
};

const getParams = () => ({
  deptIdList: deptIdList.value,
  staffName: staffName.value,
  state: state.value,
  ...pageParams,
  staffId: staffId.value
});
</script>

<template>
  <div class="leave">
    <van-sticky>
      <div class="filter-area">
        <!-- tab导航 -->
        <van-search v-model="staffId" show-action shape="round" placeholder="请输入工号" @search="onSearch">
          <template #action>
            <div @click="onClickSearchBtn" style="color: #1989fa">搜索</div>
          </template>
          <template #label>
            <span @click.stop.prevent="showLeft = true">筛选</span>
          </template>
        </van-search>
      </div>
    </van-sticky>

    <!-- 滑动区域 -->
    <van-swipe ref="swipeRef" @change="onSwipeChange" :loop="false" :show-indicators="false">
      <van-swipe-item v-for="(_, index) in tabs" :key="index">
        <component ref="childRef" :is="tabs[index]" :dropKey="selectedMenuValue" :selectedTab="selectedTab" :getParams="getParams" />
      </van-swipe-item>
    </van-swipe>
  </div>
  <!-- 顶部弹出 -->
  <van-popup v-model:show="showLeft" position="top">
    <div style="padding: 10px">
      <van-form @submit="onSubmit" label-align="top" @reset="onReset">
        <van-field v-model="deptName" readonly label="部门" placeholder="请选择部门" @click="showDept = true" />
        <van-popup v-model:show="showDept" round position="bottom">
          <van-cascader v-model="cascaderValue" title="所有部门" :options="options" :field-names="fieldNames" @close="showDept = false" @finish="onFinish" />
        </van-popup>
        <van-field v-model="staffName" name="staffName" label="姓名" placeholder="姓名" />
        <van-field name="state" label="在职状态">
          <template #input>
            <van-radio-group v-model="state" direction="horizontal">
              <van-radio name="在职">在职</van-radio>
              <van-radio name="离职">离职</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <div style="margin: 16px; display: flex; justify-content: space-between">
          <van-button round block native-type="reset" size="small" style="width: 40%"> 清&nbsp;&nbsp;&nbsp;&nbsp;空 </van-button>
          <van-button round block type="primary" native-type="submit" size="small" style="width: 40%"> 查&nbsp;&nbsp;&nbsp;&nbsp;询 </van-button>
        </div>
      </van-form>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.leave {
  height: 100%;

  .filter-area {
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
