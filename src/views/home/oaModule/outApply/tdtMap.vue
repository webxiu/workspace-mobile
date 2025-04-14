<template>
  <div class="tdt-map">
    <tdt-map ref="mapRef" :key="state.center.toString()" :center="state.center" :zoom="state.zoom">
      <tdt-control position="bottomleft">
        <div style="margin: 6px">
          <van-button style="width: 60px" size="small" type="primary" @click="onConfirm">确 认</van-button>
          <van-button style="width: 60px; margin-left: 16px" size="small" type="danger" @click="onClose">关 闭</van-button>
        </div>
      </tdt-control>
      <tdt-control position="topleft">
        <div class="top-area">
          <div class="input-outer">
            <van-search shape="round" background="#1989FA" v-model="keyword" placeholder="请输入地名关键字" @focus="focus" />
          </div>
          <!-- 检索结果 -->
          <div v-show="showResultFlag" class="search-result">
            <template v-if="searchResult.length">
              <div v-for="(item, index) in searchResult" class="item" :key="index" @click="handleSelect(item)">
                <p class="title">{{ item.name }}</p>
                <p class="address">{{ item.address }}</p>
              </div></template
            >
            <template v-else
              ><div><van-empty image-size="100" description="暂无搜索结果" /></div>
            </template>
          </div>
        </div>
      </tdt-control>
    </tdt-map>
  </div>
</template>

<script lang="ts" setup>
import { showToast } from "vant";
import { nextTick, reactive, ref, watch } from "vue";
import "vue-tianditu/lib/style.css";
const keyword = ref("");
const mapRef = ref();
const searchResult = ref<any>([]);
const showResultFlag = ref(false);

const fullInfo = ref();
const state = reactive({
  center: [0, 0],
  zoom: 17
});

const onSearch = (val) => {
  fetch(
    `http://api.tianditu.gov.cn/v2/search?postStr={"keyWord":"${val}","level":18,"mapBound":"113.84249,22.7688,113.84651,22.7754","queryType":7,"start":0,"count":20}&type=query&tk=ab60b60d17ce8389969a65c6e00a0303`
  )
    .then((res) => res.json())
    .then((res) => {
      if (res.status.infocode === 1000 && res.pois?.length) {
        searchResult.value = res.pois;
      }
    });
};

watch(keyword, onSearch);

const handleSelect = (item) => {
  let title = item.name;
  state.center = item.lonlat?.split(",");
  state.zoom = 16;

  const geoCoder = new (window as any).T.Geocoder();

  geoCoder.getLocation(new T.LngLat(state.center[0], state.center[1]), (res) => {
    let addString = res.addressComponent.province + res.addressComponent.city + res.addressComponent.county + title;
    fullInfo.value = { city: res.addressComponent.city, district: res.addressComponent.county, province: res.addressComponent.province };
    showResultFlag.value = false;
    keyword.value = addString;
  });
};

const focus = () => {
  showResultFlag.value = true;
};

const initPos = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        state.center = [position.coords.longitude, position.coords.latitude];
      },
      (e) => {
        console.error(e);
      }
    );
  } else {
    console.log("该浏览器不支持获取地理位置。");
  }
};

nextTick(() => {
  initPos();
});

const emits = defineEmits(["close", "confirm"]);

const onConfirm = () => {
  if (!keyword.value) return showToast({ message: "还未选定地址", icon: "warning" });
  emits("confirm", keyword.value, fullInfo.value);
};
const onClose = () => {
  emits("close");
};
</script>

<style lang="scss">
.tdt-map {
  width: 100vw;
  height: 100vh;
}

.tdt-left .tdt-control {
  margin-left: 0 !important;
}

.tdt-top .tdt-control {
  margin-top: 0 !important;
}

.tdt-touch .tdt-control-copyright {
  display: none !important;
}

.top-area {
  width: 100vw !important;
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
}
</style>
