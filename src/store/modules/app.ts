import { defineStore } from "pinia";
import { store } from "@/store";

interface AppState {
  navTitle: string;
}
export const useAppStore = defineStore({
  id: "app",
  state: (): AppState => ({
    navTitle: ""
  }),
  getters: {
    getNavTitle(state): string {
      return state.navTitle;
    }
  },
  actions: {
    setNavTitle(state: string): void {
      this.navTitle = state;
    }
  }
});

// Need to be used outside the setup
export function useAppStoreWithOut() {
  return useAppStore(store);
}
