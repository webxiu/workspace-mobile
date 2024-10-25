<template>
  <div class="face-collect">
    <div class="" style="background: #fff; padding-bottom: 10px; border-bottom: 1px solid #ccc">
      <van-search v-model="formData.staffName" shape="round" @search="onSearch" placeholder="请输入姓名" />
      <div class="ui-ta-c fw-700 fz-28">待采集人员({{ dataList.length }}人)</div>
    </div>
    <van-pull-refresh v-model="loading" @refresh="onRefresh" class="flex-1 ui-ovy-a">
      <van-list finished-text="没有更多了" :finished="true" class="p-20 box-border" v-if="dataList.length > 0">
        <van-cell v-for="item in dataList" :key="item.id" class="border-line mb-16 border-10">
          <div class="flex just-between">
            <div>
              <div v-for="cell in itemList" :key="cell.value" class="flex flex-1 color-333">
                <span><van-icon :name="cell.icon" class="ui-va-m fw-700" /></span>
                <span class="ellipsis">
                  <span class="ml-8 label-colon">
                    <span class="label-name">{{ cell.label }}</span>
                  </span>
                  <span>{{ item[cell.value] }}</span>
                </span>
              </div>
            </div>
            <van-button icon="plus" plain type="primary" size="small" @click="onCollction(item)">采集</van-button>
          </div>
        </van-cell>
        <van-back-top />
      </van-list>
      <van-empty v-else description="暂无采集数据" />
    </van-pull-refresh>
    <van-overlay :show="showDialog" @click="showDialog = false" :zIndex="200">
      <div class="wrapper" @click.stop>
        <van-icon name="cross" class="closed" @click="onClose" />
        <UploadModal ref="uploadRef" :userInfo="userInfo" @finish="onFinish">
          <template #header>
            <van-nav-bar :title="`拍照上传 (${userInfo?.staffName}:${userInfo?.staffId})`" left-text="返回" :left-arrow="true" @click-left="onClose" />
          </template>
        </UploadModal>
      </div>
    </van-overlay>
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive, onMounted, computed } from "vue";
import { faceCollectList, FaceCollectItemType } from "@/api/oaModule";
import UploadModal from "./UploadModal.vue";
import { closeToast, showLoadingToast } from "vant";

const formData = reactive({ staffName: "" });

const uploadRef = ref();
const userInfo = ref<FaceCollectItemType>();
const showDialog = ref(false);
const loading = ref(false);
const dataList = ref<FaceCollectItemType[]>([]);

const itemList = reactive([
  { label: "姓名", value: "staffName", icon: "contact-o" },
  { label: "工号", value: "staffId", icon: "coupon-o" },
  // { label: "部门", value: "deptName", icon: "hotel-o" },
  { label: "入职时间", value: "startDate", icon: "underway-o" }
]);

onMounted(getData);

// 获取列表
function getData() {
  loading.value = true;
  showLoadingToast({ message: "加载中...", loadingType: "spinner", forbidClick: true });
  faceCollectList(formData)
    .then(({ data }) => (dataList.value = data || []))
    .finally(() => {
      closeToast();
      loading.value = false;
    });
}
const onSearch = (value: string) => {
  formData.staffName = value;
  getData();
};

const onRefresh = () => {
  formData.staffName = "";
  getData();
};

function onFinish(item: FaceCollectItemType) {
  dataList.value = dataList.value.filter((m) => m.id !== item.id);
  onClose();
}

function onClose() {
  showDialog.value = false;
  uploadRef.value.onReset();
}

const onCollction = (row: FaceCollectItemType) => {
  userInfo.value = row;
  showDialog.value = true;
};
</script>

<style lang="scss" scoped>
.face-collect {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    position: relative;
    background: #fff;

    .closed {
      position: absolute;
      top: 24px;
      right: 24px;
      z-index: 2;
    }
  }
}
</style>
