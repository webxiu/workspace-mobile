import { defineStore } from "pinia";
import { store } from "@/store";

export const useShopStore = defineStore({
  id: "shop",
  state: () => ({ curentShopBottomTab: 0 }),
  getters: {
    getCurentShopBottomTab(): number {
      return this.curentShopBottomTab;
    },
  },
  actions: {
    setCurentShopBottomTab(tab: number): void {
      this.curentShopBottomTab = tab;
    },
  },
});

// Need to be used outside the setup
export function useShopStoreWithOut() {
  return useShopStore(store);
}
