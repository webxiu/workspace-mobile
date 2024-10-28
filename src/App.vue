<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-06-23 10:00:15 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-06-23 10:00:15 
 */ -->
<template>
  <van-config-provider :theme="theme" class="ui-h-100 ui-p-r">
    <router-view />
    <ReDialog />
  </van-config-provider>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { ConfigProvider, ConfigProviderTheme } from "vant";
import { ReDialog } from "@/components/ReDialog";

export default defineComponent({
  name: "App",
  components: {
    [ConfigProvider.name]: ConfigProvider,
    ReDialog: ReDialog
  },
  setup() {
    const theme = ref<ConfigProviderTheme>("light");

    return { theme };
  }
});
</script>
