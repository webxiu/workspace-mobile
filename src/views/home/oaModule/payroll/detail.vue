<template>
  <div class="ui-h-100 flex-col">
    <MyDetail
      v-show="activeSelected === 0"
      :detail-info="detailInfo"
      :templatesList="templatesList"
      :userName="userName"
      :wxOpenIds="wxOpenIds"
      @refreshAction="refreshAction"
      @setBottomCurrent="setBottomCurrent"
      class="detail-page flex-1 ui-ovy-a"
    />
    <MySign
      v-if="activeSelected === 1"
      :detail-info="detailInfo"
      :userName="userName"
      :wxOpenIds="wxOpenIds"
      @refreshAction="refreshAction"
      @setBottomCurrent="setBottomCurrent"
      class="detail-page flex-1 ui-ovy-a"
    />
    <MyFeedBack
      v-show="activeSelected === 2"
      :detail-info="detailInfo"
      :userName="userName"
      :wxOpenIds="wxOpenIds"
      @refreshAction="refreshAction"
      @setBottomCurrent="setBottomCurrent"
      class="detail-page flex-1 ui-ovy-a"
    />
    <van-tabbar v-model="activeSelected" :border="false" :fixed="false">
      <!-- 第一项为占位项 -->
      <!-- <van-tabbar-item style="display: none" /> -->
      <van-tabbar-item icon="label-o" v-show="calcSign">工资详情</van-tabbar-item>
      <van-tabbar-item icon="edit" v-show="calcSign">签名</van-tabbar-item>
      <van-tabbar-item icon="smile-comment-o" v-show="calcFeedBack">异常反馈</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";

import { getPayRollDetail, getTemplatePayRoll, queryClerkInfo } from "@/api/oaModule";
import MyDetail from "./MyDetail.vue";
import MyFeedBack from "./MyFeedBack.vue";
import MySign from "./MySign.vue";
import { useAppStore } from "@/store/modules/app";
import { useUserStore } from "@/store/modules/user";
import { showNotify } from "vant";

export interface DetailInfoType {
  holidayType: string;
  remark: string;
  createUserName: string;
  createDate: string;
  signatureFilePath?: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  days: string;
  hours: string;
  userName: string;
  billNo: string;
  billState: number;
  statusValue: string;
  id?: string | number;
}

const tabsPage = [
  { name: MyDetail, idx: 0 },
  { name: MySign, idx: 1 },
  { name: MyFeedBack, idx: 2 }
];

defineProps({ id: String });
const route = useRoute();
const appStore = useAppStore();
const userStore = useUserStore();

const detailInfo = ref<any>({
  userName: "",
  billNo: "",
  holidayType: "",
  remark: "",
  createUserName: "",
  createDate: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  days: "",
  hours: "",
  billState: 0,
  statusValue: ""
});
const activeSelected = ref(0);
const wxOpenIds = ref("");
const userName = ref("");
const templatesList = ref([]);

const calcSign = computed(() => {
  if (detailInfo.value.statusValue) {
    return [3, 4, 5, 6].includes(detailInfo.value.statusValue);
  }
});

const calcFeedBack = computed(() => {
  if (detailInfo.value.statusValue) {
    return [3, 4].includes(detailInfo.value.statusValue);
  }
});

const setBottomCurrent = (tabString) => (activeSelected.value = Number(tabString));

const getDetailInfo = async () => {
  let templates = await fetchGzTemplate();
  templatesList.value = templates;
  if (templates.length) {
    const { gzmbb, payslipId, gzmbNo, needGetId, yearMonth, salt } = route.query;
    const reqData: any = { gzmbNo };
    // if (payslipId != "-1") reqData.payslipId = payslipId;
    // if (needGetId && needGetId === "true") reqData.needGetId = needGetId;
    if (yearMonth) reqData.yearMonth = yearMonth;
    if (salt) reqData.salt = salt;
    getPayRollDetail(reqData).then((res: any) => {
      if (res.data) {
        detailInfo.value = res.data;
      }
    });
  }
};

const fetchGzTemplate = async () => {
  let templateArr;
  await getTemplatePayRoll({
    // isApp: true,
    templateNo: route.query.gzmbNo,
    templateType: "appShow"
  }).then((res) => {
    if (res.data && res.data.length) {
      templateArr = res.data;
    }
  });

  return templateArr;
};

const refreshAction = () => {
  getDetailInfo();
};

// 获取文员信息
const fetchClerkInfo = () => {
  queryClerkInfo({ userCode: userStore.userInfo.userCode }).then((res) => {
    if (res.data?.length > 0) {
      wxOpenIds.value = res.data.map((item) => item.wxOpenid);
      userName.value = res.data[0].userName;
    }
    // else {
    //   showNotify({
    //     type: "danger",
    //     message: "当前部门未配置文员，请联系系统组！",
    //   });
    // }
  });
};

onMounted(() => {
  getDetailInfo();
  fetchClerkInfo();
  appStore.setNavTitle("工资单详情");
});
</script>

<style lang="scss" scoped></style>
