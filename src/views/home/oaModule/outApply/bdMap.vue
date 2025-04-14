<script setup>
import { showFailToast, showToast } from "vant";
import { reactive, ref, watch } from "vue";
import { useGeocoder } from "vue-baidu-map-3x";

const centerConfig = reactive({ lng: 0, lat: 0 });
const keyword = ref("");
const showResultFlag = ref(false);
const onceFlag = ref(true);
const searchResult = ref([]);
const mapZoom = ref(11);
const BMapRef = ref();
const mapRef = ref();
const fullInfo = ref();

const emits = defineEmits(["close", "confirm"]);

const initPos = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        centerConfig.lng = position.coords.longitude;
        centerConfig.lat = position.coords.latitude;
      },
      (e) => {
        console.error(e);
      }
    );
  } else {
    console.log("该浏览器不支持获取地理位置。");
    useGeocoder().then((geocoder) => {
      geocoder.getPoint("深圳市宝安区松岗街道东方社区大田洋工业区", (res) => {
        centerConfig.lng = res.lng;
        centerConfig.lat = res.lat;
      });
    });
  }
};

watch(keyword, (newVal) => {
  console.log(newVal, "newVal==");
  if (!newVal) initPos();
});

const onReady = ({ BMap, map }) => {
  BMapRef.value = BMap;
  mapRef.value = map;
  initPos();
};

const handleSelect = (item) => {
  showResultFlag.value = false;
  let title = item.title;
  let { lng, lat } = item.marker.point;
  console.log(lng, lat);
  // // 以下代码是为了根据经纬度去转换出 省、市、区的信息出来。如果，不需要，可以自行修改。
  let point = new window.BMap.Point(lng, lat);
  let geoc = new window.BMap.Geocoder();
  geoc.getLocation(point, (res) => {
    let addString = res.addressComponents.province + res.addressComponents.city + res.addressComponents.district + title;
    fullInfo.value = { city: res.addressComponents.city, district: res.addressComponents.district, province: res.addressComponents.province };
    onceFlag.value = true;
    showResultFlag.value = false;
    keyword.value = addString;
    mapRef.value.clearOverlays(); //清除地图上所有覆盖物
    mapRef.value.addOverlay(new BMapRef.value.Marker({ lng, lat }));

    centerConfig.lng = lng;
    centerConfig.lat = lat;
    mapZoom.value = 15;
  });
};

const focus = () => {
  showResultFlag.value = true;
};

const onSearchComplete = (res) => {
  if (res && res.qk) {
    searchResult.value = [...res.qk];
    if (onceFlag) {
      onceFlag.value = false;
    } else {
      showResultFlag.value = true;
    }
  }
};

const onConfirm = () => {
  if (!keyword.value) return showToast({ message: "还未选定地址", icon: "warning" });
  emits("confirm", keyword.value, fullInfo.value);
};
const onClose = () => {
  emits("close");
};
</script>

<template>
  <div style="position: relative">
    <div class="input-outer">
      <van-search shape="round" background="#1989FA" v-model="keyword" placeholder="请输入地名关键字" @focus="focus" />
    </div>
    <!-- 检索结果 -->
    <div v-show="showResultFlag" class="search-result">
      <template v-if="searchResult.length">
        <div v-for="(item, index) in searchResult" class="item" :key="index" @click="handleSelect(item)">
          <p class="title">{{ item.title }}</p>
          <p class="address">{{ item.address }}</p>
        </div></template
      >
      <template v-else
        ><div><van-empty image-size="100" description="暂无搜索结果" /></div>
      </template>
    </div>

    <div style="padding: 2px">
      <!-- <baidu-map class="map" style="overflow: auto" :center="centerConfig" :zoom="mapZoom" @ready="onReady">
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        <bm-local-search :keyword="keyword" :auto-viewport="true" @searchcomplete="onSearchComplete" :panel="false"></bm-local-search>
        <bm-control>
          <div style="margin: 6px">
            <van-button style="width: 60px" size="small" type="primary" @click="onConfirm">确 认</van-button>
            <van-button style="width: 60px; margin-left: 16px" size="small" type="danger" @click="onClose">关 闭</van-button>
          </div>
        </bm-control>
      </baidu-map> -->
    </div>
  </div>
</template>

<style>
.map {
  width: 100%;
  height: calc(100vh - 130px);
  overflow: hidden;
}

.BMap_noprint.anchorTL {
  inset: auto auto 0 0 !important;
}
.anchorBL img {
  display: none !important;
}
.search-result {
  background-color: #fff;
  width: 100%;
  margin: 0 auto;
  z-index: 999;
  position: absolute;
  padding: 0 8px;
  max-height: 580px;
  overflow: scroll;
}

.search-result .item {
  border-bottom: 1px solid #ebeef2;
  padding: 0 8px;
}

.item:last-child {
  border-bottom: none;
}
.item .title {
  font-size: 24px;
  font-weight: 600;
  margin: 16px 0 6px;
  color: #313233;
}

.item .address {
  font-size: 24px;
  color: #9ca5b3;
  margin: 0 0 16px;
}
</style>
