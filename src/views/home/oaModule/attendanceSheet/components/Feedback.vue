<template>
  <div class="pb-120">
    <van-nav-bar title="异常反馈" />
    <van-notice-bar class="fz-24 mt-12" :speed="30" left-icon="volume-o" :text="noticeText" />
    <van-form @submit="onHandleClick">
      <van-cell-group inset>
        <van-field
          type="textarea"
          v-model="content"
          label-align="right"
          autosize
          minHeight="500"
          name="content"
          label="反馈内容："
          placeholder="请输入反馈内容"
          show-word-limit
          maxlength="1000"
          :rules="[{ required: true, message: '反馈内容不能为空！' }]"
        />
      </van-cell-group>
      <div class="m-32">
        <van-button round plain block type="danger" native-type="submit" :disabled="loading" icon="success" color="red"> 提交反馈 </van-button>
      </div>
    </van-form>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue";
import { useRoute } from "vue-router";
import { showConfirmDialog, showLoadingToast, closeToast } from "vant";
import { SignStatus } from "../config";
import { showToastModel } from "@/utils/getStatusColor";
import { saveAttendanceException, saveAttendanceUserOpenID, getPreviewSignature, sendQywxUser } from "@/api/oaModule";

const content = ref("");
const route = useRoute();
const detailData = ref({});
const loading = ref<boolean>(false);
const configUser = reactive<{ wxOpenIds: string[]; userName: string }>({
  wxOpenIds: [],
  userName: ""
});

const detailId = route.params.id;
const { userCode, yearMonthTime } = route.query;
const noticeText = ref<string>("如您发现考勤明细有异常，可以提交反馈内容。");

const onHandleClick = async () => {
  try {
    const res = await saveAttendanceUserOpenID({ userCode });
    if (res.status !== 200) throw "部门文员信息获取失败！";
    if (res.data?.length === 0) {
      throw "当前部门未配置文员，请联系系统组！";
    }
    if (res.data) {
      configUser.wxOpenIds = res.data.map((item) => item.wxOpenid).filter(Boolean);
      configUser.userName = res.data[0].userName;
      getPreviewSubmit(); // 预提交
    }
  } catch (error: any) {
    showToastModel("fail", error?.toString());
  }
};

const getPreviewSubmit = async () => {
  try {
    const res = await getPreviewSignature({ appId: route.params.id });
    if (res.status !== 200) throw "签名状态获取失败！";
    if (res.data?.length === 0) {
      throw "系统中不存在该考勤明细！";
    }

    // 验证签名状态
    if (![SignStatus.noSign].includes(res.data[0]?.status)) {
      showToastModel("success", "只有在考勤明细处于【待签名】状态，方可提交反馈！");
      return;
    }
    showConfirmDialog({ title: "", message: "您确定要提交当前反馈吗？" })
      .then(() => {
        if (content.value && configUser.wxOpenIds.length > 0) {
          // onSubmit(content.value, configUser.wxOpenIds); // 发送微信通知, 服务停止(2023.11.10)
          onSubmitFeedback(content.value);
        } else {
          showToastModel("fail", "当前部门未配置文员，请联系系统组！");
        }
      })
      .finally(() => (loading.value = false));
  } catch (error: any) {
    showToastModel("fail", error.toString());
    loading.value = false;
  }
};

// 1.发送微信通知
const onSubmit = async (content: string, wxOpenIds: string[]) => {
  const wxMsg = `${yearMonthTime}考勤明细异常反馈\r\n反馈人：${configUser.userName}\r\n反馈内容：${content}`;
  sendQywxUser({ message: wxMsg }, wxOpenIds)
    .then((res) => {
      if (res.status !== 200) throw res.data;
      onSubmitFeedback(content);
      // showToastModel("success", "发送到企业微信通知成功！");
    })
    .catch((error) => {
      showToastModel("fail", "发送到企业微信通知失败！");
    });
};

// 2.保存反馈信息
const onSubmitFeedback = (message: string) => {
  showLoadingToast({ duration: 0, forbidClick: true, message: "请稍等..." });
  saveAttendanceException({ detailId, userCode, content: message })
    .then((res) => {
      if (res.status !== 200) throw res.data;
      showToastModel("success", "反馈成功，请等待处理！");
      content.value = "";
    })
    .catch((err) => {
      showToastModel("fail", "提交失败，请重新提交！");
    })
    .finally(() => {
      const timer = setTimeout(() => {
        closeToast();
        clearTimeout(timer);
      }, 2000);
    });
};

const initData = (data: Array<Record<string, any>>) => {
  detailData.value = data[0];
};
defineExpose({ initData });
</script>
<style lang="scss" scoped></style>
