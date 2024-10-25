<template>
  <div class="ts-sugges">
    <van-form @submit="onSubmit" ref="formRef">
      <van-cell-group inset>
        <van-field name="cryptonym" label="是否匿名" required>
          <template #input>
            <van-radio-group v-model="cryptonym" direction="horizontal">
              <van-radio name="匿名">匿名</van-radio>
              <van-radio name="实名">实名</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
          v-model="name"
          name="name"
          label="联系人"
          placeholder="请填写联系人姓名"
          v-if="cryptonym === '实名'"
          required
          :rules="[
            { required: true, message: '联系人姓名不能为空' },
            {
              pattern: /^[\u4E00-\u9FA5]{2,4}$/,
              message: '请正确填写联系人姓名'
            }
          ]"
        ></van-field>
        <van-field
          v-if="cryptonym === '实名'"
          v-model="phone"
          name="phone"
          label="手机号"
          placeholder="填写本人手机号"
          required
          :rules="[
            { required: true, message: '本人手机号必填' },
            {
              pattern: /^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/,
              message: '手机号无效'
            }
          ]"
        />
        <van-field
          v-if="cryptonym === '实名'"
          v-model="sms"
          name="code"
          center
          required
          label="短信验证码"
          placeholder="填写验证码"
          :rules="[
            { required: true, message: '短信验证码必填' },
            { pattern: /^\d{6}$/, message: '请正确填写验证码' }
          ]"
        >
          <template #button>
            <van-button size="small" type="primary" @click="sendSms" :disabled="isSmsSend">{{ sendBtnText }}</van-button>
          </template>
        </van-field>
        <van-field
          v-model="purchaseUser"
          name="fname"
          label="投诉人员"
          required
          placeholder="填写投诉人员姓名"
          :rules="[
            { required: true, message: '投诉人员姓名必填' },
            {
              pattern: /^[\u4E00-\u9FA5]{2,4}$/,
              message: '请正确填写投诉人员姓名'
            }
          ]"
        />
        <van-field
          v-model="message"
          name="content"
          rows="2"
          autosize
          required
          label="内容"
          type="textarea"
          maxlength="100"
          placeholder="请填写投诉内容"
          :rules="[{ required: true, message: '投诉内容必填' }]"
          show-word-limit
        />
      </van-cell-group>
      <div style="margin: 16px auto; width: 90%">
        <van-button round block type="primary" native-type="submit" :loading="fetchLoading"> 提&nbsp;&nbsp;&nbsp;交 </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { showNotify } from "vant";

import { getSupplierComplaintsPhoneCode, addSupplierComplaints } from "@/api/oaModule";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const formRef = ref(null);
const fetchLoading = ref(false);
const purchaseUser = ref("");
const isSmsSend = ref(false); //是否发送验证码
const sendBtnText = ref("发送验证码");
const name = ref("");
const timer = ref<any>(null);
const counter = ref(60);
const phone = ref("");
const cryptonym = ref("匿名");
const message = ref("");
const sms = ref("");

const reset = () => {
  // 重置按钮可用
  isSmsSend.value = false;
  // 重置文本内容
  sendBtnText.value = "发送验证码";
  if (timer.value) {
    // 存在计时器对象，则清除
    clearInterval(timer.value);
    // 重置秒数，防止下次混乱
    counter.value = 60;
    // 计时器对象重置为空
    timer.value = null;
  }
};

const onSubmit = (values) => {
  fetchLoading.value = true;

  const { billNo = "" } = route.query;

  addSupplierComplaints({ ...values, fbillno: billNo })
    .then((res) => {
      if (res.data && res.status === 200) {
        showNotify({ type: "success", message: "提交成功" });

        // 清空表单
        purchaseUser.value = "";
        name.value = "";
        phone.value = "";
        cryptonym.value = "匿名";
        message.value = "";
        sms.value = "";
        reset();
      }
    })
    .catch(console.log)
    .finally(() => (fetchLoading.value = false));
};

const countDown = () => {
  timer.value = setInterval(() => {
    // 替换文本，用es6里面的``这个来创建字符串模板，让秒实时改变
    sendBtnText.value = `(${counter.value}秒)后重新发送`;
    counter.value--;
    if (counter.value < 0) {
      // 当计时小于零时，取消该计时器
      clearInterval(timer.value);
      reset();
    }
  }, 1000);
};

const sendSms = () => {
  (formRef.value as any)
    .validate("phone")
    .then(() => {
      isSmsSend.value = true;
      countDown();
      getSupplierComplaintsPhoneCode({ phone: phone.value }).then((res) => {});
    })
    .catch(console.log);
};
</script>

<style scoped lang="scss">
.ts-sugges {
  height: 100vh;
  padding-top: 36px;
}
</style>
