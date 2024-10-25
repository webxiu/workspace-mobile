<template>
  <div class="outer-b">
    <div class="zoom-select">
      <div class="search-area">
        <van-field name="building" label="楼栋" label-width="40">
          <template #input>
            <van-radio-group v-model="checkedBuilding" @change="changeBuilding" direction="horizontal">
              <van-radio v-for="item in buildingList" :name="item.name.replace('栋', '')" :key="item.id">{{ item.name }}</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field name="buildingGroup" label="分组" label-width="40">
          <template #input>
            <van-radio-group v-model="checkedBuildingGroup" @change="changeGroup" direction="horizontal">
              <van-radio v-for="item in calcGroups" :key="item.name" :name="item.name">{{ item.name }}</van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </div>
      <div class="notice">
        <van-notice-bar style="--van-notice-bar-font-size: 14px" :wrapable="true" :scrollable="false" color="#1989fa" background="#ecf9ff" left-icon="info-o">
          注意：蓝色代表水电均未填写，红色代表只填了水电中的某一项，绿色代表水电均已填写
        </van-notice-bar>
      </div>
      <div class="tree-select">
        <van-tree-select
          v-model:main-active-index="activeIndex"
          @click-nav="clickNav"
          height="55vw"
          :items="items"
          style="--van-tree-select-nav-background: #ccc"
        >
          <template #content>
            <van-empty description="暂无房间信息" v-if="!tags?.length && !zoomLoading" />
            <div v-if="zoomLoading" style="height: 100%; display: flex; align-items: center; justify-content: center">
              <van-loading color="#1989fa" size="40px" />
            </div>
            <div v-if="!zoomLoading" style="display: flex; flex-wrap: wrap; justify-content: flex-start">
              <van-tag
                v-for="item in tags"
                :type="calcTagType(item)"
                style="/* flex: 20%; */ height: 37px; width: 72px; line-height: 37px; margin: 10px 15px 15px 10px; justify-content: center"
                size="large"
                round
                @click="
                  (e) =>
                    gotoAddPage(e, {
                      item,
                      checkedBuilding,
                      checkedBuildingGroup,
                      date: props.searchDate
                    })
                "
                >{{ item.dormitoryCode }}</van-tag
              >
            </div>
          </template>
        </van-tree-select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAllBuildingList, getZoomList } from "@/api/oaModule";
import { TagType } from "vant";
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const props = defineProps(["searchDate"]);

const activeIndex = ref(0);
const items: any = ref([]);
const buildingList: any = ref([]);
const zoomLoading = ref(false);
const originBuildings: any = ref([]);

type ZType = {
  buildingGroup: string;
  buildingId: string;
  dormitoryBillno: string;
  dormitoryCode: string;
  floorNo: number;
  id: string;
  num: number;
  orgId: string;
  type?: TagType;
};
const tags = ref<ZType[]>([]);

const groups = ref([{ name: "A1" }, { name: "A2" }, { name: "D1" }, { name: "D2" }]);

const changeGroup = (val) => {
  const headStr = val[0];
  const buildingId = buildingList.value.find((item) => item.name === headStr + "栋")?.id;

  zoomLoading.value = true;
  getZoomList({
    buildingCode: buildingId,
    date: props.searchDate,
    buildingGroup: checkedBuildingGroup.value
  })
    .then((res) => {
      if (res.data) {
        originBuildings.value = res.data;
        items.value = res.data.map((item) => ({ text: item.floor + "楼" }));
        tags.value = res.data[activeIndex.value]?.value
          .map((item) => ({
            ...item
          }))
          .filter((item) => item.buildingGroup === checkedBuildingGroup.value);
      }
    })
    .finally(() => (zoomLoading.value = false));
};

const calcTagType = (item): TagType => {
  if (item.hasElectric && item.hasWater) {
    return "success";
  }

  if (item.hasElectric || item.hasWater) {
    return "danger";
  }

  if (!item.hasElectric && !item.hasWater) {
    return "primary";
  }
  return "primary";
};

const clickNav = (navIndex) => {
  tags.value = originBuildings.value[navIndex]?.value
    ?.map((item) => ({
      ...item
    }))
    .filter((item) => item.buildingGroup === checkedBuildingGroup.value);
};

const gotoAddPage = (e, data) => {
  // TODO: 可实现返回选择当前活跃的按钮
  // e.target.style.backgroundColor = "#1989fa";
  // e.target.style.color = "#fff";
  const itemData = JSON.stringify(data);
  router.push("/oa/hydroelectricity/add?item=" + itemData);
};

const changeBuilding = (name, type?: string, val?: string) => {
  zoomLoading.value = true;
  checkedBuilding.value = name;

  if (name === "A") {
    checkedBuildingGroup.value = "A1";
  } else if (name === "D") {
    checkedBuildingGroup.value = "D1";
  }

  if (type === "init" && val) {
    checkedBuildingGroup.value = val;
  }
  const buildingId = buildingList.value.find((item) => item.name.includes(name))?.id;
  getZoomList({
    buildingCode: buildingId,
    date: props.searchDate,
    buildingGroup: checkedBuildingGroup.value
  })
    .then((res) => {
      if (res.data) {
        originBuildings.value = res.data;
        items.value = res.data.map((item) => ({ text: item.floor + "楼" }));
        tags.value = res.data[activeIndex.value]?.value
          .map((item) => ({
            ...item
          }))
          .filter((item) => item.buildingGroup === checkedBuildingGroup.value);
      }
    })
    .finally(() => (zoomLoading.value = false));
};
const calcGroups = computed(() => {
  return groups.value.filter((item) => item.name.includes(checkedBuilding.value));
});

const checkedBuilding = ref("");
const checkedBuildingGroup = ref(calcGroups.value[0].name);

const fetchAllBuilding = () => {
  getAllBuildingList({}).then((res) => {
    if (res.data) {
      buildingList.value = res.data;
      checkedBuilding.value = res.data[0].name.replace("栋", "");
    }
  });
};

const initSearchData = () => {
  const cachData = localStorage.getItem("preParams");
  const cachJsonData = JSON.parse(cachData as string);

  if (cachJsonData) {
    const backName = cachJsonData.building;
    const buildingId = buildingList.value.find((item) => item.name.includes(backName))?.id;

    if (buildingId) {
      if (cachJsonData.buildingGroup) {
        changeBuilding(cachJsonData.buildingGroup[0], "init", cachJsonData.buildingGroup);
      }
      checkedBuildingGroup.value = cachJsonData.buildingGroup;
      localStorage.removeItem("preParams");

      return;
    } else {
      checkedBuilding.value = backName;
      checkedBuildingGroup.value = cachJsonData.buildingGroup;
    }
    localStorage.removeItem("preParams");
  }

  localStorage.removeItem("preParams");
};

watch(route, () => {
  initSearchData();
});

watch(
  () => props.searchDate,
  () => {
    if (checkedBuilding.value && checkedBuildingGroup.value) {
      changeBuilding(checkedBuildingGroup.value[0], "init", checkedBuildingGroup.value);
    }
  }
);
onMounted(() => {
  fetchAllBuilding();
});
</script>

<style scoped lang="scss">
.outer-b {
  display: flex;
  flex-direction: column;
}
.zoom-select {
  padding: 25px;

  :deep(.van-cell) {
    padding-left: 0;
  }
}

.tree-select {
  margin-top: 50px;
  flex: 1;

  :deep(.van-tree-select__content) {
    height: 55vh;
    padding-top: 10px;
  }

  :deep(.van-sidebar-item--select) {
    color: #1989fa;
    font-weight: 900;
  }

  :deep(.van-tree-select__nav) {
    flex: 0.4;
    // background-color: #f7f8fa;
    background-color: #fff;
    height: 55vh;
  }
  :deep(.van-sidebar-item) {
    background-color: #fff;
  }
}
</style>
