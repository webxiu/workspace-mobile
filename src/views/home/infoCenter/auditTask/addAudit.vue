<template>
  <div style="padding-top: 16px">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="username"
          name="selectedUser"
          label="加签审批人"
          required
          label-align="top"
          :rules="[{ required: true, message: '请选择加签审批人' }]"
        >
          <template #input>
            <div style="display: flex">
              <div class="user-photo" v-if="userList.length" v-for="item in userList" style="margin-right: 12px; display: flex; flex-direction: column">
                <van-badge color="#ccc">
                  <template #content>
                    <van-icon name="cross" @click="clickUserDelIcon(item)" style="cursor: pointer" />
                  </template>
                  <van-image :radius="5" width="40" height="40" fit="cover" position="center" :src="item.avatar" />
                </van-badge>

                <span style="text-align: center">{{ item.userName }}</span>
              </div>
              <div>
                <van-button icon="plus" type="default" plain color="#ddd" @click="clickUserBtn" />
              </div>
            </div>
          </template>
        </van-field>

        <van-field name="way" label="加签方式" required label-align="top" :rules="[{ required: true, message: '请选择加签审批人' }]">
          <template #input>
            <van-radio-group v-model="addSignWay" direction="horizontal">
              <van-radio name="1">在我之前</van-radio>
              <van-radio name="2">在我之后</van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <van-field
          v-if="userList.length"
          name="manyWay"
          label="多人审批方式"
          required
          label-align="top"
          :rules="[{ required: true, message: '请选择多人审批方式' }]"
        >
          <template #input>
            <van-radio-group v-model="addManySignWay" direction="horizontal">
              <van-radio name="1">或签</van-radio>
              <van-radio name="2">会签</van-radio>
              <van-radio name="3">依次审批</van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <van-field v-model="message" name="remark" rows="3" label-align="top" autosize label="加签意见" type="textarea" placeholder="填写加签意见" />
        <van-field name="files" label-align="top" label="附件上传">
          <template #input>
            <van-uploader
              v-model="fileValue"
              upload-icon="link-o"
              accept="image/*,.pdf,.ppt,.pptx,.bmp,.doc,.docx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.gif"
            />
          </template>
        </van-field>
      </van-cell-group>

      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit"> 确 认 加 签 </van-button>
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
      <van-search v-model="searchValue" shape="round" placeholder="搜索" @search="onSearch" :clearable="false" />
    </div>
    <div class="dept">
      <van-field v-model="deptValue" is-link readonly name="picker" label="" placeholder="选择部门" @click="clickChooseDept">
        <template #left-icon>
          <van-icon name="cluster" color="#3774c5" />
        </template>
      </van-field>

      <div style="padding: 8px 0 0 12px" v-if="selectedUserList.length">
        <van-button type="primary" size="small" @click="clickConfirmBtn">确定 · {{ selectedUserList.length }}</van-button>
      </div>

      <van-popup v-model:show="showDept" round position="bottom">
        <van-cascader
          v-model="cascaderValue"
          title="部门选择"
          :options="options"
          @close="showDept = false"
          @finish="onFinish"
          :field-names="{
            text: 'name',
            value: 'id',
            children: 'children'
          }"
        />
      </van-popup>
    </div>
    <div class="content">
      <van-index-bar :sticky="false">
        <div v-for="(el, idx) in fetchData" :key="idx">
          <van-index-anchor :index="el.groupName" />
          <van-cell v-for="(item, index) in el.children" :key="item.userName" @click="clickUserItem(item, idx)">
            <template #title>
              <div style="display: flex; line-height: 40px">
                <div style="height: 40px; display: flex; margin-right: 8px">
                  <van-radio :name="item.userName + (index + 1)" :checked="item.checked" />
                </div>
                <div class="photo">
                  <van-image :radius="5" width="40" height="40" fit="cover" position="center" :src="item.avatar" />
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
import { fetchDeptTreeData } from "@/api/oaModule";
import { getDeptTreeData, getUserListByDept } from "@/api/user";
import { pySegSort } from "@/utils/common";
import { onMounted } from "vue";
import { ref } from "vue";

defineOptions({ name: "auditTaskAddAudit" });

const username = ref("");
const showUserRight = ref(false);
const userList: any = ref([]);
const deptValue = ref("所有部门");
const showDept = ref(false);
const cascaderValue = ref("");
const selectedUserList: any = ref([]);
const addSignWay = ref("1");
const deptIdList = ref([]);
const addManySignWay = ref("1");

const options = ref([]);

const fetchData: any = ref([]);
const fileValue = ref([
  // { url: "https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg" },
]);
const message = ref("");
const searchValue = ref("");

const onSubmit = (values) => {};

const clickChooseDept = () => {
  showDept.value = true;
};

const onSearch = () => {
  fetchUsers();
};

const clickConfirmBtn = () => {
  userList.value = selectedUserList.value;
  username.value = userList.value[0]?.userName;
  showUserRight.value = false;
};

const onFinish = ({ selectedOptions }) => {
  showDept.value = false;
  deptValue.value = selectedOptions.map((option) => option.name).join("/");
  deptIdList.value = selectedOptions.map((item) => item.id);
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

  fetchData.value.forEach((el) => {
    el.children?.forEach((ev) => {
      if (ev.userName === item.userName) {
        ev.checked = false;
      }
    });
  });
};

const clickUserItem = (item, idx) => {
  const findChildIdx = fetchData.value[idx]?.children?.findIndex((el) => el.userName === item.userName);
  if (findChildIdx >= 0) {
    fetchData.value[idx].children[findChildIdx].checked = !fetchData.value[idx]?.children[findChildIdx].checked;
  }

  if (item.checked) {
    selectedUserList.value.push(item);
  } else {
    const delIdx = selectedUserList.value.findIndex((el) => !el.checked);
    selectedUserList.value.splice(delIdx, 1);

    if (!selectedUserList.value.length) username.value = "";
  }
};

const fetchUsers = () => {
  getUserListByDept({
    page: 1,
    limit: 1000000,
    userName: searchValue.value,
    userState: "A",
    deptIdList: deptIdList.value
  }).then((res) => {
    if (res.data) {
      const { records = [] } = res.data;
      const resultArr = pySegSort(records)?.segs?.map((item) => ({
        ...item,
        children: item.children?.map((el) => {
          el.checked = false;
          if (!el.avatar) {
            el.avatar = "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg";
          }
          return el;
        })
      }));
      fetchData.value = resultArr;
    }
  });
};

const getDeptData = () => {
  getDeptTreeData({}).then((res) => {
    if (res.data) {
      const result = JSON.parse(res.data);
      options.value = result[0]?.children || [];
    }
  });
};

onMounted(() => {
  fetchUsers();
  getDeptData();
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
  height: 71vh;
  overflow-y: auto;

  :deep(.van-cell) {
    padding-bottom: 0 !important;
  }
}
</style>
