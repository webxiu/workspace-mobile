/*
 * @Author: lixiuhai
 * @Date: 2023-06-23 10:03:48
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-07-08 11:03:22
 */
// import * as VantComponents from "vant";
// import { Button, Cell, Icon } from "vant";
// import { ConfigProvider } from "vant";
// import { isObject } from "@/utils/validate";

import { App, Component } from "vue";

import Vant from "vant";

// withInstall 函数
export function withInstall<T>(component: T) {
  (component as any).install = (app: App) => {
    app.component((component as any).name, component as Component);
  };
  return component as T;
}

// const plugins = []
// const components = []

export function setupVant(app) {
  // for ( const [key, component] of Object.entries( VantComponents ) ) {
  //   if ( isObject( component ) && component.name && component.install ) {
  //     // app.component( key, component )
  //     app.use(component);
  //   }
  // }
  app.use(Vant);
}
