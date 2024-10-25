/*
 * @Author: lixiuhai
 * @Date: 2023-06-23 09:59:19
 * @Last Modified by:   lixiuhai
 * @Last Modified time: 2023-06-23 09:59:19
 */

import Login from "./src/login.vue";

export const LoginLayout = Object.assign(Login, {
  install(app) {
    app.component(Login.name, Login);
  },
});
