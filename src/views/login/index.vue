<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-06-23 09:52:10 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-06-23 09:52:10 
 */ -->
<template>
  <login-layout v-if="!route.query?.code">
    <template #body>
      <van-form label-width="0" @submit="onSubmit">
        <van-cell-group inset>
          <van-field v-model="formState.userNo" :rules="rules.userNo" name="userNo" label="" placeholder="用户名" maxlength="11" clearable />
          <van-field v-model="formState.password" type="password" name="password" label="" placeholder="密码" clearable class="mt-20" :rules="rules.password" />
          <van-field hidden readonly />
        </van-cell-group>
        <div class="form-btn">
          <van-button round block type="primary" native-type="submit" class="btn-item">登录</van-button>
        </div>
      </van-form>
      <div class="version-txt">
        {{ "V" + version }}
      </div>
    </template>

    <template #foot>
      <div class="mb-20 mt-100">
        <van-divider class="line">心怀成爱&nbsp;&nbsp;力奉精益</van-divider>
      </div>
    </template>
  </login-layout>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import md5 from "md5";
import { autoLogin, login } from "@/api/user";
import { useRouter, useRoute } from "vue-router";
import { regExp } from "@/utils/regExp";
import { orgDomain } from "@/permission";
import { FieldRule, showFailToast } from "vant";
import { LoginLayout } from "./components/Layout";
import { useUserStore } from "@/store/modules/user";
import { LoginType } from "@/api/user";
import { version } from "../../../package.json";
import { getUrlParameters } from "@/utils/common";
import { getCookie, removeCookie } from "@/utils/storage";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const formState = reactive<LoginType>({
  userNo: "",
  password: ""
});

onMounted(() => watchLogin(route.query || {}));

/** 企业微信自动登录跳转 */
function checkWechatLogin() {
  const { state, code } = route.query as any;
  // 微信消息列表中跳转过来的路由地址携带在state中
  if (code && state && state.indexOf("/") === 0) {
    const JumpPath = state.split("?")[0];
    const qywxQuery = getUrlParameters(state!);
    router.replace({ path: JumpPath, query: { ...qywxQuery, isFromQywx: true } });
  } else {
    router.replace("/workspace");
  }
}

/** 企业微信自动登录 */
function watchLogin(query) {
  const { state, code } = query;
  if (!code) return;
  const cookie = getCookie();
  if (cookie) return checkWechatLogin();

  autoLogin({ orgDomain, state, code })
    .then(() => {
      userStore
        .setUserInfo()
        .then(() => checkWechatLogin())
        .catch((err) => showFailToast("用户信息获取失败!" + err));
    })
    .catch(console.log);
}

const checkUserName = (value, rule) => {
  if (!value) return "请填写登录账号！";
  if (!regExp.enNumber.test(value)) return "登录账号格式不正确！";
  return true;
};

const rules: { [key: string]: FieldRule[] } = {
  userNo: [
    { required: true, message: "请填写用户名", trigger: "onBlur" },
    { validator: checkUserName, trigger: "onBlur" }
  ],
  password: [{ required: true, message: "密码不能为空", trigger: "onBlur" }]
};

// 用户密码登录
const onSubmit = (values: LoginType) => {
  const password = md5(values.password).substr(8, 16).toUpperCase();
  const params = { ...values, password, orgDomain };
  login(params)
    .then(() => {
      userStore.setUserInfo().then(() => router.push("/workspace"));
    })
    .catch(console.log);
};
</script>

<style lang="scss">
@import "./index.scss";

.line {
  color: var(--main-color);
  font-size: 28px;
}

.version-txt {
  text-align: center;
  color: #b93146;
  margin-top: 60px;
  font-style: italic;
  font-size: 28px;
}
</style>
