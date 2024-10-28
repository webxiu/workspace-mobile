<template>
  <List v-if="show" @switch="onSwich" />
  <Day v-else />
</template>

<script setup lang="tsx">
import Day from "./day.vue";
import List from "./list.vue";
import { computed, ref } from "vue";
import { getLoginInfo } from "@/utils/storage";
const loginInfo = getLoginInfo();
const testUsers = ["661", "659", "617", "746"];
const showType = ref(true);
const show = computed(() => {
  if (!testUsers.includes(loginInfo.userCode)) return false;
  return showType.value;
});

function onSwich() {
  if (testUsers.includes(loginInfo.userCode)) {
    showType.value = !showType.value;
  }
}
</script>
