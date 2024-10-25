<template>
  <van-form ref="formRef" @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model="formData.userNo"
        label="工号"
        name="userNo"
        label-align="top"
        placeholder="请填写工号"
        style="margin: 15px 0"
        :rules="[{ required: true, message: '工号不能为空' }]"
      />
      <van-field
        v-model="formData.password"
        label="密码"
        name="password"
        type="password"
        label-align="top"
        placeholder="请填写密码"
        style="margin-bottom: 10px"
        :rules="[{ required: true, message: '密码不能为空' }]"
      />
    </van-cell-group>
    <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit" :loading="loading">确&nbsp;&nbsp;定</van-button>
    </div>
  </van-form>
</template>
<!-- 用户登录验证弹窗 -->
<script setup lang="ts">
import md5 from "md5";
import { showToast } from "vant";
import { login } from "@/api/user";
import { ref, reactive } from "vue";
import { getLoginInfo } from "@/utils/storage";

const emits = defineEmits(["submit"]);
const loginInfo = getLoginInfo();
const formRef = ref(false);
const loading = ref(false);
const formData = reactive({ userNo: loginInfo.userCode, password: "" });

const onSubmit = () => {
  return new Promise<void>((resolve, reject) => {
    const password = md5(formData.password).substr(8, 16).toUpperCase();
    const param = { ...formData, password };
    loading.value = true;
    login(param)
      .then((res) => {
        if (res.status === 200) {
          showToast("验证成功");
          loading.value = false;
          emits("submit", param);
        } else {
          showToast("验证失败");
          emits("submit", false);
        }
      })
      .catch(() => {
        showToast("验证失败");
        loading.value = false;
        emits("submit", false);
      });
  });
};

function getRef() {
  return formRef.value;
}

defineExpose({ getRef, onSubmit });
</script>
