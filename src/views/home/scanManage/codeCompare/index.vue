<template>
  <div class="compare-history">
    <div class="compare-header">
      <div class="fw-700">二维码验证列表</div>
      <van-button type="primary" size="small" icon="plus" @click="showUpload = true">上传</van-button>
    </div>
    <van-pull-refresh v-model="upLoading" @refresh="onRefresh" class="flex-1 ui-ovy-a">
      <van-list v-model:loading="downLoading" :finished="finished" finished-text="没有更多了" @load="onLoad" class="p-16 box-border" v-if="dataList.length > 0">
        <van-cell v-for="(item, index) in dataList" :key="item.id">
          <div class="flex just-between">
            <div class="ui-va-m">
              <span class="ml-8 color-333">
                <van-icon name="contact-o" />
                验证人：{{ item.userName }}
              </span>
            </div>
            <van-tag :type="item.finishedResult === 'OK' ? 'success' : 'danger'">
              {{ item.finishedResult || "- -" }}
            </van-tag>
          </div>
          <div class="flex just-between align-end mt-10" @click="onView(item)">
            <div class="ui-ta-l">
              <div class="ml-8 color-333"><van-icon name="orders-o" /> 单据编号：{{ item.billNo }}</div>
              <div class="ml-8 color-333">
                <van-icon name="underway-o" />
                创建时间：{{ item.createDate }}
              </div>
            </div>
            <van-button type="primary" plain class="look-view">查看<van-icon name="arrow" /> </van-button>
          </div>
        </van-cell>
      </van-list>
      <van-empty v-else description="暂无数据" />
      <van-back-top />
    </van-pull-refresh>
    <van-overlay :show="showUpload" @click="showUpload = false" style="z-index: 100; padding: 50px 20px">
      <div class="wrapper" @click.stop>
        <van-icon name="cross" class="closed" @click="onClose" />
        <UploadCode ref="uploadRef" />
      </div>
    </van-overlay>
    <DetailDialog ref="detailRef" />
  </div>
</template>

<script setup lang="tsx">
import { onMounted, reactive, ref } from "vue";
import UploadCode from "./UploadCode.vue";
import DetailDialog from "./DetailDialog.vue";
import { codeCompareList, CodeCompareItemType } from "@/api/common";

const finished = ref(false);
const showUpload = ref(false);
const upLoading = ref(false);
const downLoading = ref(false);
const uploadRef = ref();
const detailRef = ref();
const dataList = ref<CodeCompareItemType[]>([]);
const formData = reactive({ page: 1, limit: 20 });

onMounted(() => onRefresh());

function onRefresh() {
  formData.page = 1;
  dataList.value = [];
  upLoading.value = true;
  onLoad();
}
function onLoad() {
  downLoading.value = true;
  codeCompareList(formData)
    .then(({ data }) => {
      if (dataList.value.length >= data.total) {
        finished.value = true;
        return;
      }
      formData.page += 1;
      dataList.value = [...dataList.value, ...data.records];
    })
    .finally(() => {
      downLoading.value = false;
      upLoading.value = false;
    });
}

function onView(item: CodeCompareItemType) {
  detailRef.value.onDetail(item);
}

function onClose() {
  onRefresh();
  showUpload.value = false;
  uploadRef.value.onReset();
}
</script>

<style scoped lang="scss">
.compare-history {
  display: flex;
  height: 100%;
  flex-direction: column;
}

.compare-header {
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px;
  box-shadow: 0 0 2px 1px #ccc;
}

.look-view {
  border: none;
  padding: 0;
  height: auto;
  position: relative;
  right: -8px;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 5px;
  position: relative;
  background: #fff;
  border-radius: 20px;

  .closed {
    position: absolute;
    top: 24px;
    right: 24px;
    z-index: 2;
  }
}

.van-cell {
  margin-bottom: 15px;
  border-radius: 12px;
  border: 1px solid var(--van-cell-border-color);
}
</style>
