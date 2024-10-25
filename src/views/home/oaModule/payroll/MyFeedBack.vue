<template>
  <div class="feed-back">
    <van-nav-bar title="异常反馈"></van-nav-bar>

    <van-notice-bar
      color="#1989fa"
      background="#ecf9ff"
      style="font-size: 12px; margin-top: 6px"
      :speed="30"
      left-icon="volume-o"
      text="如您发现工资项有异常，可以提交反馈内容。"
    ></van-notice-bar>

    <van-cell-group style="margin-top: 40px">
      <van-field
        ref="fieldRef"
        class="mustinput"
        label-align="right"
        :autosize="true"
        minHeight="500"
        v-model="feedBackValue"
        rows="2"
        label="反馈内容："
        required
        type="textarea"
        maxlength="1000"
        placeholder="请输入反馈内容"
        show-word-limit
        :rules="[{ required: true, message: '请输入反馈内容' }]"
      />
    </van-cell-group>

    <div class="submitbtns">
      <van-row>
        <van-col span="24" align="center" style="padding: 10px">
          <van-button :loading="loading" icon="success" color="#1989fa" v-on:click="submitFeedBack" block round plain> 提交反馈 </van-button>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { showNotify } from "vant";

import { sendQywxUser, submitPayRollFeed } from "@/api/oaModule";
import { useUserStore } from "@/store/modules/user";
import { showToastModel } from "@/utils/getStatusColor";
import { getRouteLink } from "@/config/common";

const feedBackValue = ref("");
const fieldRef = ref(null);
const loading = ref(false);

const appStore = useUserStore();
const route = useRoute();
const props = defineProps(["userName", "wxOpenIds", "detailInfo"]);
const emit = defineEmits(["refreshAction", "setBottomCurrent"]);

const submitFeedBack = () => {
  (fieldRef.value as any).validate();
  if (!feedBackValue.value) return;

  // 移除企业微信消息推送逻辑
  onSubmitFeedback();

  // if (props.userName && props.wxOpenIds?.length) {
  //   const wxMsg = props.detailInfo.YearMonth + "工资异常反馈\r\n反馈人：" + props.userName + "\r\n反馈内容：" + feedBackValue.value;
  //   loading.value = true;
  //   onSubmitFeedback();

  //   /*
  //   // 企业微信消息发送服务已停止(2023.11.10)
  //     sendQywxUser({ message: wxMsg }, props.wxOpenIds)
  //       .then((res) => {
  //         if (res.status !== 200) throw res.data;
  //         onSubmitFeedback();
  //       })
  //       .catch((error) => {
  //         console.log("send_qywx_error:", error);
  //         showToastModel("fail", "发送到企业微信通知失败！");
  //       })
  //       .finally(() => (loading.value = false));
  //   */
  // } else {
  //   showNotify({
  //     type: "danger",
  //     message: "当前部门未配置文员，请联系系统组！"
  //   });
  // }
};

// 提交反馈信息
const onSubmitFeedback = () => {
  submitPayRollFeed({
    payslipId: route.query.payslipId || props.detailInfo?.Id,
    gzmbb: route.query.gzmbb,
    userCode: appStore.userInfo.userCode,
    content: feedBackValue.value,
    mbNo: route.query.gzmbNo
  })
    .then((res) => {
      if (res.status == 200 || res.data) {
        // 成功的操作
        showNotify({ type: "success", message: "提交成功" });
        if (getRouteLink()) return;
        setTimeout(() => {
          emit("setBottomCurrent", 0);
          emit("refreshAction");
        });
      }
    })
    .finally(() => (loading.value = false));
};
</script>

<style scoped lang="scss">
.feed-back {
  margin-bottom: 150px;
  .submitbtns {
    margin-top: 30px 0;
  }
}
</style>
