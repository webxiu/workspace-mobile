<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-06-23 09:59:08 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-06-23 09:59:08 
 */ -->
<template>
  <div class="login-section">
    <div class="content flex-1">
      <div class="logo-container">
        <img :src="logo" alt="" />
      </div>

      <div class="body-container">
        <slot name="body"></slot>
      </div>
    </div>

    <div class="foot-container">
      <slot name="foot"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import logo from "@/assets/images/logo.png";
</script>

<style lang="scss" scoped>
.login-section {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.logo-container {
  text-align: center;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  margin: 20% auto 80px;
  overflow: hidden;
  img {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
}
</style>
