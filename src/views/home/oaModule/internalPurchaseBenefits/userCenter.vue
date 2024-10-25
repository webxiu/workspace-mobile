<template>
  <div>
    <my-layout>
      <div class="van-tabs__content">
        <van-cell-group>
          <van-cell
            title="我的收货地址"
            is-link
            to="/oa/internalPurchaseBenefits/addressList"
          />
        </van-cell-group>
      </div>
    </my-layout>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAppStore } from "@/store/modules/app";
import MyLayout from "./MyLayout.vue";
// const userInfo = { userName: "谢健" };

onMounted(() => {
  useAppStore().setNavTitle("个人中心");
});
</script>

<style scoped lang="scss"></style>
