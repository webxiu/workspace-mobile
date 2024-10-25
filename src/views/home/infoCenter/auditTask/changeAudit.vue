<template>
  <div style="padding-top: 16px">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field v-model="username" name="username" label="转审人" required label-align="top" :rules="[{ required: true, message: '请选择转审人' }]">
          <template #input>
            <div style="display: flex">
              <div class="user-photo" v-if="userList.length" v-for="item in userList" style="margin-right: 12px; display: flex; flex-direction: column">
                <van-badge color="#ccc">
                  <template #content>
                    <van-icon name="cross" @click="clickUserDelIcon(item)" style="cursor: pointer" />
                  </template>
                  <van-image :radius="5" width="40" height="40" fit="cover" position="center" src="/avatar3.jpg" />
                </van-badge>

                <span style="text-align: center">{{ item.userName }}</span>
              </div>
              <div v-if="!userList.length">
                <van-button icon="plus" type="default" plain color="#ddd" @click="clickUserBtn" />
              </div>
            </div>
          </template>
        </van-field>

        <van-field v-model="message" name="remark" rows="3" label-align="top" autosize label="转审意见" type="textarea" placeholder="填写转审意见" />
        <!-- <van-field name="uploader" label-align="top" label="附件上传">
          <template #input>
            <van-uploader
              v-model="fileValue"
              upload-icon="link-o"
              accept="image/*,.pdf,.ppt,.pptx,.bmp,.doc,.docx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.gif"
            />
          </template>
        </van-field> -->
      </van-cell-group>

      <div style="margin: 32px 16px">
        <van-button round block type="primary" native-type="submit"> 提 交 </van-button>
      </div>
    </van-form>
  </div>
  <!-- 右侧弹出 -->
  <van-popup
    v-model:show="showUserRight"
    safe-area-inset-top
    safe-area-inset-bottom
    position="right"
    :style="{ width: '100%', height: '100%', padding: '12px 0 12px 12px' }"
  >
    <div class="top">
      <div class="cancel" @click="showUserRight = false">取消</div>
      <div class="title">选择联系人</div>
    </div>
    <div class="search">
      <van-search v-model="searchValue" shape="round" placeholder="搜索" :clearable="false" @search="onSearch" />
    </div>
    <div class="dept">
      <van-field v-model="deptValue" is-link readonly name="picker" label="" placeholder="选择部门" @click="clickChooseDept">
        <template #left-icon>
          <van-icon name="cluster" color="#3774c5" />
        </template>
      </van-field>

      <van-popup v-model:show="showDept" round position="bottom">
        <van-cascader
          v-model="cascaderValue"
          :options="options"
          @close="showDept = false"
          @change="handleCascaderChange"
          :field-names="{
            text: 'name',
            value: 'id',
            children: 'children'
          }"
        >
          <template #title>
            <div style="display: flex; align-items: center">
              <!-- <div>部门选择</div> -->
              <div>
                <van-button type="primary" size="small" @click="confirmAndClose">确认选择</van-button>
              </div>
            </div>
          </template>
        </van-cascader>
      </van-popup>
    </div>
    <div class="content">
      <van-index-bar :sticky="false">
        <div v-for="el in fetchData" :key="el.groupName">
          <van-index-anchor :index="el.groupName" />
          <van-cell v-for="item in el.children" :key="item.userName" @click="clickUserItem(item)">
            <template #title>
              <div style="display: flex; line-height: 40px">
                <div class="photo">
                  <van-image :radius="5" width="40" height="40" fit="cover" position="center" src="/avatar3.jpg" />
                </div>
                <div class="txt" style="margin-left: 8px">
                  {{ item.userName }}
                </div>
              </div>
            </template>
          </van-cell>
        </div>
      </van-index-bar>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { changeAuditUser } from "@/api/infoCenter";
import { getDeptTreeData, getUserListByDept } from "@/api/user";
import { getRouteLink } from "@/config/common";
import { pySegSort } from "@/utils/common";
import { closeToast, showConfirmDialog, showLoadingToast, showToast } from "vant";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

defineOptions({ name: "auditTaskChangeAudit" });

const username = ref("");
const showUserRight = ref(false);
const userList: any = ref([]);
const deptValue = ref("");
const showDept = ref(false);
const cascaderValue = ref("");
const deptIdList: any = ref([]);

let curDeptInputValue: string;

const options: any = ref([]);
const curSelectedUser: any = ref({});

const fetchData: any = ref([]);
const fileValue = ref([
  // { url: "https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg" },
]);
const message = ref("");
const searchValue = ref("");

const route = useRoute();
const router = useRouter();

const onSubmit = (values) => {
  const userCode = curSelectedUser.value.userCode;
  const reqParams = {
    addTaskUserCodes: [userCode],
    billNo: route.query.billNo,
    comment: values.remark
  };
  showConfirmDialog({
    title: "温馨提示",
    message: "是否确认提交转审"
  })
    .then(() => {
      changeAuditUser(reqParams).then((res) => {
        if (res.data) {
          showToast({ message: "提交成功", type: "success" });
          setTimeout(() => {
            location.href = "/infoCenter/auditTask";
            // router.push("/infoCenter/auditTask");
          }, 500);
        }
      });
    })
    .catch(console.log);
};

const onSearch = () => {
  fetchUsers();
};

const clickChooseDept = () => {
  showDept.value = true;
};

const getDeptData = () => {
  getDeptTreeData({}).then((res) => {
    if (res.data) {
      const result = JSON.parse(res.data);
      const allDeptItem = {
        director: "",
        id: "0",
        name: "所有部门",
        open: true,
        parentId: "-1",
        spread: true,
        title: "所有部门",
        children: []
      };
      options.value = [allDeptItem, ...result[0]?.children] || [];
    }
  });
};

const lookForAllId = (data: any[], arr: any[] = []) => {
  data.forEach((item) => {
    arr.push(item.id);
    if (item.children && item.children.length) lookForAllId(item.children, arr);
  });

  return arr;
};

const handleCascaderChange = ({ selectedOptions }) => {
  curDeptInputValue = selectedOptions.map((option) => option.name).join("/");
  if (selectedOptions.at(-1)?.id == "0") {
    deptIdList.value = [];
  } else {
    deptIdList.value = lookForAllId([selectedOptions.at(-1)]);
  }
};

const confirmAndClose = () => {
  showDept.value = false;
  deptValue.value = curDeptInputValue;

  fetchUsers();
};

const clickUserBtn = () => {
  showUserRight.value = true;
};

const clickUserDelIcon = (item) => {
  const findIdx = userList.value.findIndex((el) => el.userName === item.userName);

  if (findIdx >= 0) {
    userList.value.splice(findIdx, 1);
  }
  username.value = "";
};

const clickUserItem = (item) => {
  userList.value = [{ avatar: item.avatar, userName: item.userName }];
  curSelectedUser.value = item;
  username.value = userList.value[0]?.userName;
  showUserRight.value = false;
};

const fetchUsers = () => {
  showLoadingToast({ message: "查询中" });
  getUserListByDept({
    page: 1,
    limit: 1000000,
    userName: searchValue.value,
    userState: "A",
    deptIdList: deptIdList.value
  })
    .then((res) => {
      if (res.data) {
        const { records = [] } = res.data;
        const resultArr = pySegSort(records)?.segs?.map((item) => ({
          ...item,
          children: item.children?.map((el) => {
            el.checked = false;
            // if (!el.avatar) {
            //   el.avatar = "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg";
            // }
            return el;
          })
        }));
        fetchData.value = resultArr;
      }
    })
    .finally(() => closeToast());
};

onMounted(() => {
  getDeptData();
  fetchUsers();
});
</script>

<style scoped lang="scss">
.top {
  display: flex;
  margin-bottom: 16px;
  align-items: center;

  .cancel {
    flex: 0.4;
    font-size: 28px;
  }

  .title {
    flex: 0.6;
    color: #000;
  }
}

.dept {
  :deep(.van-cell) {
    padding-right: 0 !important;
  }

  :deep(.van-field__control) {
    padding-left: 8px !important;
  }

  :deep(.van-cell__right-icon) {
    padding-right: 16px !important;
  }
}

.content {
  height: 77vh;
  overflow-y: auto;

  :deep(.van-cell) {
    padding-bottom: 0 !important;
  }
}
</style>
