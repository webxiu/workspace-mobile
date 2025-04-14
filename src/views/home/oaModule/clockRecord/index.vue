<template>
  <List v-if="show" />
  <Day v-else />
</template>

<script setup lang="ts">
import Day from "./day.vue";
import List from "./list.vue";
import { computed } from "vue";
import { getLoginInfo } from "@/utils/storage";
const loginInfo = getLoginInfo();
const show = computed(() => [atob("NjU5")].includes(loginInfo.userCode));
</script>
