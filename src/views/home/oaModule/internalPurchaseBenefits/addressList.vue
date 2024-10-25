<template>
  <div>
    <div class="van-tabs__content">
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
      ></van-address-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { queryAddressList } from "@/api/oaModule";
import { queryUserInfo } from "@/api/user";
import { useAppStore } from "@/store/modules/app";

const router = useRouter();
const route = useRoute();

const chosenAddressId = ref("1");
const userInfo: any = ref({});
const list = ref([]);

const onAdd = () => {
  router.push(`/oa/internalPurchaseBenefits/addressAdd?type=add`);
};
const onEdit = (addressItem) => {
  router.push({
    path: "/oa/internalPurchaseBenefits/addressAdd",
    query: {
      id: +addressItem.id,
      type: "edit",
    },
  });
};

const fetchAddressList = () => {
  queryAddressList({ userId: userInfo.value.id }).then((res) => {
    if (res.data && res.data.length) {
      list.value = res.data.map((item) => {
        if (item.isDefault) chosenAddressId.value = item.id;
        return {
          id: item.id,
          name: item.addressee,
          tel: item.addresseePhone,
          address: item.fullAddress,
          isDefault: item.isDefault === 1 ? true : false,
        };
      });
    }
  });
};

const fetchAddrList = () => {
  queryUserInfo({}).then((res) => {
    if (res.data) {
      userInfo.value = res.data;
      fetchAddressList();
    }
  });
  useAppStore().setNavTitle("收货地址列表");
};

onMounted(() => {
  fetchAddrList();
});

watch(route, () => fetchAddrList());
</script>

<style scoped></style>
