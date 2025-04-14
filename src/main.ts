/*
 * @Author: lixiuhai
 * @Date: 2023-06-21 17:33:47
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-07-08 11:07:40
 */

import "vant/lib/index.css";
import "@/styles/index.scss";
import "@/permission";
import "~/types/global.d";
import "vant-sku/dist/index.css";
import "./assets/fonts/iconfont.js";

import App from "@/App.vue";
import VanSku from "vant-sku";
import { createApp } from "vue";
import drag from "v-drag";
import { registerStore } from "@/store";
import router from "@/router";
import { setupVant } from "@/plugins/setupVant";
import { useSvgIcon } from "@/icons";
import VueTianditu from "vue-tianditu";
import "vue-tianditu/lib/style.css";
// import fastclick from "fastclick";

const app = createApp(App);

// 使用sku组件
app.use(VanSku);

app.use(VueTianditu, {
  v: "4.0", //目前只支持4.0版本
  tk: "ab60b60d17ce8389969a65c6e00a0303"
});
// 拖动
app.use(drag);
// fastclick.FastClick.attach(document.body);

const initApp = async () => {
  setupVant(app);
  app.use(router);
  useSvgIcon(app);
  registerStore(app);
  app.mount("#app");
};
initApp();
