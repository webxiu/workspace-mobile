<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-06-23 09:59:31 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-06-23 09:59:31 
 */ -->
<script lang="ts" setup>
import dayjs from "dayjs";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { routeCateList } from "@/router";
import { getLoginInfo } from "@/utils/storage";
import { version } from "../../../package.json";
import MyIcon from "@/components/MyIcon/index.vue";
import { useUserStore } from "@/store/modules/user";

const router = useRouter();
const renderRoutes = ref<any[]>([]);
const curYear = dayjs().format("YYYY");

onMounted(() => getAuthList());

const getAuthList = async () => {
  /**
   * 考虑到更新权限后需要立即更新菜单
   * const authList = getLoginInfo().authList || [];
   * 按照上面代码则需要刷新两次或者重登录才生效
   * 所以这里取重新获取的接口数据列表，而不是使用上一次本地缓存里面的路由列表
   */
  await useUserStore().setUserInfo();
  const updatedAuthMenu = useUserStore().userAuthMenu;
  const authRoutes = updatedAuthMenu
    ?.filter((item) => !item.isLeaf)
    .map((item) => {
      const children = updatedAuthMenu.filter((el) => el.parentCode === item.menuCode);
      return { ...item, children, path: "/" + children[0].appHomeUrl.split("/")[1] };
    });

  // 为authRoutes设置meta属性兼容旧代码
  let viewAuthedRoutes = authRoutes?.map((item) => {
    item.children = item.children.map((it) => {
      routeCateList.forEach((el) => {
        el.children?.forEach((ell) => {
          if (it.appHomeUrl.split("/")[2] === ell.path) {
            it.meta = { ...ell.meta, title: it.menuName, icon: it.icon };
          }
        });
      });
      return it;
    });
    return item;
  });
  renderRoutes.value = viewAuthedRoutes;
};

const onClickItem = (item: RouteConfigRawType, cell: RouteConfigRawType) => {
  if (cell && !cell.meta?.disable) {
    const appUrl = (cell as any).appHomeUrl;
    router.push(appUrl);
  }
};
</script>

<template>
  <div class="workspace flex-col just-between">
    <!-- 后端返回的权限菜单结合路由表渲染 -->
    <div v-for="item in renderRoutes" class="flex-1">
      <div class="cate-title" v-if="item.menuName">{{ item.menuName }}</div>
      <van-grid :column-num="3" :gutter="10" :border="false">
        <template v-for="cell in item.children">
          <van-grid-item
            class="no-select"
            :class="{ disable: cell.meta.disable }"
            v-if="cell.meta && !cell.meta.hidden && !cell.meta.disable"
            @click="onClickItem(item, cell)"
          >
            <template #icon>
              <MyIcon :iconClass="cell.meta.icon" class-name="iconClass" />
            </template>
            <template #text>
              <span class="icon-text-span">
                {{ cell.meta.title }}
              </span>
            </template>
          </van-grid-item>
        </template>
      </van-grid>
    </div>
    <van-empty v-if="renderRoutes.length === 0" image-size="100" description="暂无数据" style="margin-top: 20%" />
    <van-divider style="padding: 15px 0; font-size: 12px">©2023-{{ curYear }} Deogra &nbsp;{{ "v" + version }}</van-divider>
  </div>
</template>

<style lang="scss" scoped>
.workspace {
  width: 750px;
  height: 100%;
  .iconClass {
    width: 90px;
    height: 90px;
  }

  .icon-text-span {
    font-size: 26px;
    margin-top: 5px;
    color: #646566;
  }

  .cate-title {
    padding: 60px 30px 20px;
    color: rgba(69, 90, 100, 0.6);
    font-weight: 700;
    font-size: 26px;
    line-height: 16px;
  }
}
:deep(.van-grid-item) {
  &:hover {
    cursor: pointer;
  }
  &.disable {
    &:hover {
      cursor: not-allowed;
    }
    opacity: 0.5;
  }
}
</style>
