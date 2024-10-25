<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-06-23 10:05:23 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-06-23 10:05:23 
 */ -->
<template>
  <van-sticky v-if="isShow || showNav">
    <van-nav-bar
      :title="appStore.navTitle"
      left-text="返回"
      right-text="首页"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
  </van-sticky>
</template>

<script lang="ts" setup>
import { unref, ref, watch, toRaw } from "vue";
import { useRouter, useRoute } from "vue-router";
import { routeCateList } from "@/router";
import { useAppStore } from "@/store/modules/app";

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const showNav = ref<boolean>(false);

defineProps({
  // 引入组件显示,优先级大于showNav, 不能控制隐藏
  isShow: { type: Boolean, value: false },
});

/** 获取路由meta中配置showNav: true的路由地址 */
const getNavList = (routers: RouteConfigRawType[]) => {
  const navList: string[] = [];
  const navFn = (list: RouteConfigRawType[]) => {
    list.forEach((item) => {
      if (item.children) {
        navFn(item.children);
      } else if (item.meta?.showNav) {
        navList.push(item.path.split(":")[0]);
      }
    });
  };
  navFn(routers);
  return navList;
};

const NavBarList = getNavList(routeCateList);

const onClickLeft = () => {
  router.go(-1);
};
const onClickRight = () => {
  router.push("/workspace");
};

watch(route, (_, newVal) => {
  showNav.value = NavBarList.some(
    (item) => unref(toRaw(newVal).path).indexOf(item) > -1
  );
});
</script>

<style lang="scss" scoped></style>
