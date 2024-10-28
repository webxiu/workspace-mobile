<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-06-23 10:03:55 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-06-23 10:03:55 
 */ -->
<script setup lang="ts">
import { Transition, ref } from "vue";
import BackButton from "@/components/BackButton/index.vue";
import { routes } from "@/router";

const names = ref<string[]>([]);

const keepAliveNames = (routes) => {
  const names: string[] = [];
  const fn = (routes: RouteConfigRawType[]) => {
    routes.forEach((item) => {
      if (item.meta?.keepAlive === false) names.push(item.name as string);
      if (item.children?.length) fn(item.children);
    });
  };
  fn(routes);
  return names;
};

names.value = keepAliveNames(routes);
</script>

<template>
  <router-view>
    <template #default="{ Component, route }">
      <BackButton />
      <!-- <transition name="fade-transform" mode="out-in"> -->
      <KeepAlive :exclude="names">
        <component :is="Component" :key="route.fullPath" />
      </KeepAlive>
      <!-- </transition> -->
    </template>
  </router-view>
</template>
