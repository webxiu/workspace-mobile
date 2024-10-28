import { LoginUserInfoType, UserAuthItemType, logout, queryKKViewUrl, queryUserAuthList, queryUserInfo } from "@/api/user";
import { closeToast, showLoadingToast } from "vant";
import { getLoginInfo, getWeChatCode, removeCookie, removeLoginInfo, setKKViewUrl, setLoginInfo } from "@/utils/storage";

import { defineStore } from "pinia";
import router from "@/router";
import { store } from "@/store";

export type { LoginUserInfoType };

interface AppState {
  userInfo: LoginUserInfoType;
  userAuthMenu: UserAuthItemType[];
}
export const useUserStore = defineStore({
  id: "user",
  state: (): AppState => {
    const userInfo = getLoginInfo();
    return { userInfo, userAuthMenu: [] };
  },
  getters: {
    getUserInfo(): LoginUserInfoType {
      return getLoginInfo();
    }
  },
  actions: {
    /** 获取用户信息及登录权限, 储存在本地 */
    setUserInfo(showLoading = true) {
      if (showLoading) showLoadingToast({ message: "正在登录...", duration: 5000 });
      return new Promise<LoginUserInfoType>(async (resolve, reject) => {
        try {
          const { data: viewUrl } = await queryKKViewUrl();
          const { data: userInfo } = await queryUserInfo({});
          const authList = await this.getUserAuthList(userInfo.id);
          const loginInfo = { ...userInfo, userNo: userInfo.userCode, authList };
          setKKViewUrl(viewUrl);
          setLoginInfo(loginInfo);
          resolve(loginInfo);
        } catch (error) {
          reject(error);
        }
        closeToast();
      });
    },
    /** 获取用户权限 */
    getUserAuthList(userId: number) {
      showLoadingToast({ message: "菜单加载中...", duration: 5000 });
      return new Promise<UserAuthItemType[]>((resolve, reject) => {
        queryUserAuthList({ userId })
          .then(({ data }) => {
            this.userAuthMenu = data;
            resolve(data);
          })
          .catch(reject)
          .finally(() => closeToast());
      });
    },
    /** 退出登录 */
    logout() {
      removeCookie();
      removeLoginInfo();
      const { code = "", state = "" } = getWeChatCode();
      router.replace({ path: "/login", query: { code, state } });
    }
  }
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
