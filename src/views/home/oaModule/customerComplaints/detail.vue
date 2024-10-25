<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-06-23 09:57:28 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-06-23 09:57:28 
 */ -->
<template>
  <div class="customer-complaints">
    <van-form class="pt-40">
      <van-cell-group inset>
        <van-row type="flex">
          <van-col span="8">
            <div class="fw-700">客诉单详情</div>
          </van-col>
        </van-row>
        <van-divider :style="{ margin: '6px 0' }" />
        <van-row
          type="flex"
          class="mt-28 fz-28"
          v-for="item in customerOrderList"
        >
          <van-col span="8" class="ui-ta-r fw-700 color-666">
            {{ item.label }}：
          </van-col>
          <van-col span="14" class="ui-ta-l pl-8">{{ item.value }}</van-col>
        </van-row>

        <van-divider :style="{ margin: '6px 0' }" />

        <van-row type="flex">
          <van-col span="8">
            <div class="fw-700 mt-40 mb-40">客诉单详情</div>
          </van-col>
        </van-row>

        <van-collapse v-model="activeNames">
          <van-collapse-item
            :name="`${idx + 1}`"
            :key="idx"
            :title="`详情${idx + 1}`"
            v-for="(item, idx) in detailInfoList"
          >
            <van-row type="flex" class="mt-28 fz-28">
              <van-col span="8" class="ui-ta-r fw-700 color-666">
                产品型号：
              </van-col>
              <van-col span="14" class="ui-ta-l pl-8">{{
                item.productModel
              }}</van-col>
            </van-row>
            <van-row type="flex" class="mt-28 fz-28">
              <van-col span="8" class="ui-ta-r fw-700 color-666">
                订单数量：
              </van-col>
              <van-col span="14" class="ui-ta-l pl-8">{{
                item.orderQuantity
              }}</van-col>
            </van-row>
            <van-row type="flex" class="mt-28 fz-28">
              <van-col span="8" class="ui-ta-r fw-700 color-666"
                >单位：</van-col
              >
              <van-col span="14" class="ui-ta-l pl-8">{{ item.unit }}</van-col>
            </van-row>
            <van-row type="flex" class="mt-28 fz-28">
              <van-col span="8" class="ui-ta-r fw-700 color-666">
                客诉类型：
              </van-col>
              <van-col span="14" class="ui-ta-l pl-8">{{
                item.typeName
              }}</van-col>
            </van-row>
            <van-row type="flex" class="mt-28 fz-28">
              <van-col span="8" class="ui-ta-r fw-700 color-666">
                客诉日期：
              </van-col>
              <van-col span="14" class="ui-ta-l pl-8">{{
                item.complaintDate
              }}</van-col>
            </van-row>
            <van-row type="flex" class="mt-28 fz-28">
              <van-col span="8" class="ui-ta-r fw-700 color-666">
                客诉数量：
              </van-col>
              <van-col span="14" class="ui-ta-l pl-8">{{
                item.quantity
              }}</van-col>
            </van-row>
            <van-row type="flex" class="mt-28 fz-28">
              <van-col span="8" class="ui-ta-r fw-700 color-666">
                样品提交日期：
              </van-col>
              <van-col span="14" class="ui-ta-l pl-8">
                {{ item.sampleSubmitDate }}
              </van-col>
            </van-row>
            <van-row type="flex" class="mt-28 fz-28">
              <van-col span="8" class="ui-ta-r fw-700 color-666">
                客诉问题：
              </van-col>
              <van-col span="14" class="ui-ta-l pl-8">{{
                item.question
              }}</van-col>
            </van-row>
            <van-row type="flex" class="mt-28 fz-28">
              <van-col span="8" class="ui-ta-r fw-700 color-666">
                客诉问题描述：
              </van-col>
              <van-col span="14" class="ui-ta-l pl-8">
                {{ item.questionDescribe }}
              </van-col>
            </van-row>

            <van-row type="flex" class="mt-28 fz-28">
              <van-col span="8" class="ui-ta-r fw-700 color-666">
                客诉附件：
              </van-col>
              <van-col span="14" class="ui-ta-l pl-8">
                <a
                  class="pointer"
                  target="_blank"
                  :href="`${vPath}${item.resourceUrl}/${item.resourceName}`"
                  >点我预览或下载</a
                >
              </van-col>
            </van-row>
          </van-collapse-item>
        </van-collapse>
      </van-cell-group>
    </van-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { showToast } from "vant";
import { getCustomerComplaintDetail } from "@/api/oaModule";
import { useAppStore } from "@/store/modules/app";

interface CustomerDetailInfoType {
  entryid: number;
  complaintId: number;
  productModel: string;
  unit: string;
  orderQuantity: null;
  quantity: number;
  type: number;
  typeName: string;
  complaintDate: string;
  question: string;
  sampleSubmitDate: string;
  questionDescribe: string;
  fileName: string;
  resourceName: string;
  resourceUrl: string;
}

const route = useRoute();
const appStore = useAppStore();
const id = route.params.id;
const activeNames = ref<string[]>(["1"]);
const vPath = import.meta.env.VITE_IMAGEURL_PREFIX;
const detailInfoList = ref<CustomerDetailInfoType[]>([]);
const customerOrderList = ref([
  { label: "标题", field: "title", value: "" },
  { label: "订单号", field: "orderNo", value: "" },
  { label: "业务状态", field: "marketStateName", value: "" },
  { label: "审批状态", field: "stateName", value: "" },
  { label: "提交人", field: "customer", value: "" },
  { label: "提交时间", field: "marketSubmitDate", value: "" },
  { label: "创建时间", field: "createDate", value: "" },
]);

onMounted(() => {
  getData();
});

const getData = async () => {
  try {
    const result = await getCustomerComplaintDetail({ id });
    const data = result.data;
    if (!data) throw "暂无详情信息";
    customerOrderList.value.map((item) => (item.value = data.info[item.field]));
    detailInfoList.value = data.detailInfo;
  } catch (error) {
    showToast({ message: "获取详情失败", position: "top" });
  }
};
</script>

<style lang="scss" scoped>
:deep(.van-cell__title) {
  font-weight: 700;
}
</style>
