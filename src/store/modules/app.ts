import { getAppInfo, setAppInfo } from "@/utils/storage";

import { LoginAppInfoType } from "@/api/types";
import { defineStore } from "pinia";
import { store } from "@/store";

interface AppState {
  navTitle: string;
  appConfig: LoginAppInfoType;
}
export const useAppStore = defineStore({
  id: "app",
  state: (): AppState => ({
    navTitle: "",
    appConfig: getAppInfo()
  }),
  getters: {
    getNavTitle(state): string {
      return state.navTitle;
    },
    getAppConfig(state): LoginAppInfoType {
      return state.appConfig;
    }
  },
  actions: {
    setNavTitle(state: string): void {
      this.navTitle = state;
    },
    // 设置应用配置(动态公司名称,logo，官网地址等)
    setAppConfig(appConfig: LoginAppInfoType) {
      this.appConfig = appConfig;
      setAppInfo(appConfig);
    }
  }
});

// Need to be used outside the setup
export function useAppStoreWithOut() {
  return useAppStore(store);
}
