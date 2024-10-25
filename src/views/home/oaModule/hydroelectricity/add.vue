<template>
  <div class="add-water">
    <div class="line">
      <van-divider>{{ textType }}抄表记录</van-divider>
    </div>
    <div class="notice">
      <van-notice-bar
        style="--van-notice-bar-font-size: 14px"
        :wrapable="true"
        :scrollable="false"
        color="#1989fa"
        background="#ecf9ff"
        left-icon="info-o"
      >
        当水表读数或者电表读数看不清时，可点击勾选右侧的模糊单选,会自动填充上月读数！
      </van-notice-bar>
    </div>
    <div class="form-water">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            label-align="top"
            v-model="yearAndMonth"
            name="yearAndMonth"
            label="年月"
            readonly
            placeholder="请选择年月"
          />
          <van-field
            label-align="top"
            v-model="building"
            name="building"
            label="楼栋"
            readonly
            placeholder="请填写楼栋"
          />
          <van-field
            label-align="top"
            v-model="zoom"
            name="zoom"
            label="房间号"
            readonly
            placeholder="请填写房间号"
          />
          <van-field
            label-align="top"
            v-model="water"
            name="water"
            label="水表读数"
            type="digit"
            placeholder="请填写水表读数"
          >
            <template #right-icon>
              <van-checkbox @change="changeWaterBox" v-model="isWaterNotSee"
                >模糊</van-checkbox
              >
            </template>
          </van-field>
          <van-field
            label-align="top"
            v-model="electric"
            name="electric"
            label="电表读数"
            type="digit"
            placeholder="请填写电表读数"
          >
            <template #right-icon>
              <van-checkbox
                @change="changeElectricBox"
                v-model="isElectricNotSee"
                >模糊</van-checkbox
              >
            </template></van-field
          >
        </van-cell-group>
        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit">
            保&nbsp;&nbsp;&nbsp;存
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  getAllWaterAndElectricList,
  getPreMonthWaterAndElectric,
  insertWaterAndElectric,
  updateWaterAndElectric,
} from "@/api/oaModule";
import dayjs from "dayjs";
import { showConfirmDialog, showFailToast, showSuccessToast } from "vant";
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const routeParams = JSON.parse(route.query.item as string);
const router = useRouter();
const isWaterNotSee = ref(false);
const isElectricNotSee = ref(false);

const preDate = dayjs(routeParams.date).add(-1, "month").format("YYYY-MM");
const yearAndMonth = ref(routeParams.date);
const building = ref("");
const zoom = ref("");
const water = ref("");
const electric = ref("");

const [yearValue, monthValue] = preDate.split("-");
const textType = ref("新增");
const editId = ref("");

const setCache = () => {
  const preParams = JSON.stringify({
    ...routeParams.item,
    building: routeParams.item.buildingGroup.substr(0, 1),
  });
  localStorage.setItem("preParams", preParams);
};

setCache();

const changeWaterBox = (val) => {
  if (textType.value === "新增") {
    const preSecondYearMonth = dayjs(yearAndMonth.value)
      .add(-1, "month")
      .format("YYYY-MM");
    const [year, month] = preSecondYearMonth.split("-");
    if (val) {
      showConfirmDialog({
        title: "温馨提示",
        message: "是否确认使用上月水表读数覆盖当前水表读数",
      })
        .then(() => {
          getPreMonthWaterAndElectric({
            dormitoryId: routeParams.item?.id,
            year: +year,
            month: +month,
          })
            .then((res) => {
              if (res.data) {
                water.value = res.data.water;
              } else {
                isWaterNotSee.value = false;
              }
            })
            .catch(() => {
              isWaterNotSee.value = false;
            });
        })
        .catch(() => {
          isWaterNotSee.value = false;
        });
    }
  }
};

const changeElectricBox = (val) => {
  if (textType.value === "新增") {
    const preSecondYearMonth = dayjs(yearAndMonth.value)
      .add(-1, "month")
      .format("YYYY-MM");
    const [year, month] = preSecondYearMonth.split("-");
    if (val) {
      showConfirmDialog({
        title: "温馨提示",
        message: "是否确认使用上月电表读数覆盖当前电表读数",
      })
        .then(() => {
          getPreMonthWaterAndElectric({
            dormitoryId: routeParams.item?.id,
            year: +year,
            month: +month,
          })
            .then((res) => {
              if (res.data) {
                electric.value = res.data.electric;
              } else {
                isElectricNotSee.value = false;
              }
            })
            .catch(() => {
              isElectricNotSee.value = false;
            });
        })
        .catch(() => {
          isElectricNotSee.value = false;
        });
    }
  }
};

const onSubmit = (values) => {
  const [submitYear, submitMonth] = yearAndMonth.value.split("-");
  const submitType = { 新增: "add", 修改: "edit" };
  if (!values.water && !values.electric) {
    showFailToast("水电表读数不能同时为空");
    return;
  }
  const addParams: any = {
    buildingGroup: routeParams.checkedBuildingGroup,
    buildingId: routeParams.item?.buildingId,
    dormitoryId: routeParams.item?.id,
    dormitoryCode: routeParams.item?.name,
    electric: +values.electric ? +values.electric : undefined,
    electricVague: isElectricNotSee.value,
    water: +values.water ? +values.water : undefined,
    waterVague: isWaterNotSee.value,
    year: +submitYear,
    month: +submitMonth,
  };
  if (submitType[textType.value] === "edit") {
    addParams.id = editId.value;
  }

  const apiType = { add: insertWaterAndElectric, edit: updateWaterAndElectric };

  const beforeClose = (action): Promise<boolean> => {
    return new Promise((resolve) => {
      if (action === "cancel") {
        resolve(true);
      } else {
        apiType[submitType[textType.value]](addParams)
          .then((res) => {
            if (res.data) {
              showSuccessToast("保存成功");
              setTimeout(() => {
                router.push("/oa/hydroelectricity");
              });
            }
          })
          .finally(() => {
            resolve(true);
          });
      }
    });
  };

  showConfirmDialog({
    title: "提示",
    message: `确认保存${submitYear}年${+submitMonth}月【${
      routeParams.checkedBuilding
    }栋 ${routeParams.checkedBuildingGroup}-${
      routeParams.item?.dormitoryCode
    }】的水电记录吗？`,
    beforeClose,
  }).catch(() => {});
};

onMounted(() => {
  const queryData = routeParams.item || {};
  const [year, month] = yearAndMonth.value.split("-");
  if (queryData.hasElectric || queryData.hasWater) {
    textType.value = "修改";
    getAllWaterAndElectricList({
      page: 1,
      limit: 10,
      year: +year,
      dormitoryId: routeParams.item?.id,
      buildingId: routeParams.item?.buildingId,
      buildingGroup: routeParams.item?.buildingGroup,
      month: +month,
    }).then((res) => {
      if (res.data.records?.length) {
        const resultData = res.data.records[0] || {};
        editId.value = resultData.id;
        water.value = resultData.water;
        electric.value = resultData.electric;

        if (resultData.electricVague !== null) {
          isElectricNotSee.value = resultData.electricVague;
        }
        if (resultData.waterVague !== null) {
          isWaterNotSee.value = resultData.waterVague;
        }
      }
    });
  }
});

watch(
  () => route.query,
  (newVal) => {
    if (newVal.item) {
      const itemData = JSON.parse(newVal.item as string);
      building.value = itemData.checkedBuilding;
      zoom.value =
        itemData.checkedBuildingGroup + "-" + itemData.item.dormitoryCode;
    }
  },
  { immediate: true }
);
</script>
