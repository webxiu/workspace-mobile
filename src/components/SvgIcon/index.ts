/*
 * @Author: lixiuhai
 * @Date: 2023-06-23 10:05:39
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-07-09 11:34:23
 */

import YuSvgIcon from "./src/index.vue";

export const SvgIcon = Object.assign(YuSvgIcon, {
  install(app) {
    app.component(YuSvgIcon.name, YuSvgIcon);
  }
});

export default SvgIcon;
