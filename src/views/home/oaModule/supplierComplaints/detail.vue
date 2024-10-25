<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-06-23 09:58:21 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-06-23 09:58:21 
 */ -->
<template>
  <div class="warp">
    <div class="form-add">
      <van-form colon label-width="100px" label-align="center">
        <van-row type="flex">
          <van-col span="24">
            <van-field v-model="dataInfo.fname" label="采购员" readonly />
          </van-col>
        </van-row>
        <van-row type="flex">
          <van-col span="24">
            <van-field v-model="dataInfo.content" label="内容" type="textarea" maxlength="100" readonly />
          </van-col>
        </van-row>
        <van-row type="flex">
          <van-col span="24">
            <van-field v-model="dataInfo.name" label="联系人" v-show="show" readonly />
          </van-col>
        </van-row>
        <van-row type="flex">
          <van-col span="24">
            <van-field v-model="dataInfo.phone" center label="手机号" v-show="show" readonly />
          </van-col>
        </van-row>
      </van-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { showToast } from "vant";
import { useAppStore } from "@/store/modules/app";
import { getSupplierComplaintsDetail } from "@/api/oaModule";

const route = useRoute();
const appStore = useAppStore();
const id = route.params.id;
const show = ref<boolean>(false);
const dataInfo = ref({ fname: "", content: "", name: "", phone: "" });

onMounted(() => {
  getData();
  appStore.setNavTitle("投诉详情");
});

const getData = async () => {
  try {
    const res = await getSupplierComplaintsDetail({ id });
    dataInfo.value = res.data;
  } catch (error) {
    showToast({ message: "获取详情信息失败", position: "top" });
  }
};
</script>

<style lang="scss" scoped></style>
