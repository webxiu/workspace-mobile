<template>
  <div>
    <van-collapse v-model="activeName" accordion>
      <van-collapse-item title="基本信息" name="0">
        <div>
          <div v-for="item in basicList">
            <div v-if="item.value" style="display: flex; margin: 10px 0">
              <div>{{ item.label }}：</div>
              <div>{{ item.value }}</div>
            </div>
          </div>
        </div>
      </van-collapse-item>
      <van-collapse-item title="更多信息" name="1">
        <div>
          <div v-for="item in moreList">
            <div v-if="item.value" style="display: flex; margin: 10px 0">
              <div>{{ item.label }}：</div>
              <div>{{ item.value }}</div>
            </div>
          </div>
        </div>
      </van-collapse-item>
      <van-collapse-item title="教育经历" name="2">
        <div v-for="(item, idx) in detailInfo.staffInfoEducationVOS">
          <div v-if="detailInfo.staffInfoEducationVOS.length > 1" style="font-weight: bold">教育经历{{ idx + 1 }}</div>
          <div>
            <div class="mg-10">开始时间：{{ item.startTime }}</div>
            <div class="mg-10">截止时间：{{ item.endTime }}</div>
            <div class="mg-10">学校名称：{{ item.schoolName }}</div>
            <div class="mg-10">学历：{{ item.education }}</div>
            <div class="mg-10">专业：{{ item.major }}</div>
            <div class="mg-10">备注：{{ item.remark }}</div>
          </div>
        </div>
        <div v-if="!detailInfo.staffInfoEducationVOS.length">暂无教育经历</div>
      </van-collapse-item>
      <van-collapse-item title="家庭关系" name="3">
        <div v-for="(item, idx) in detailInfo.staffInfoFamilyVOS">
          <div v-if="detailInfo.staffInfoFamilyVOS.length > 1" style="font-weight: bold">家庭关系{{ idx + 1 }}</div>
          <div>
            <div class="mg-10">关系：{{ item.relation }}</div>
            <div class="mg-10">姓名：{{ item.name }}</div>
            <div class="mg-10">工作单位：{{ item.workUnit || "无" }}</div>
            <div class="mg-10">职业：{{ item.profession || "无" }}</div>
            <div class="mg-10">联系电话：{{ item.contactNumber }}</div>
          </div>
        </div>
        <div v-if="!detailInfo.staffInfoFamilyVOS.length">暂无家庭关系</div>
      </van-collapse-item>
      <van-collapse-item title="工作经历" name="4">
        <div v-for="(item, idx) in detailInfo.staffInfoWorkVOS">
          <div v-if="detailInfo.staffInfoWorkVOS.length > 1" style="font-weight: bold">工作经历{{ idx + 1 }}</div>
          <div>
            <div class="mg-10">开始时间：{{ item.startTime }}</div>
            <div class="mg-10">截止时间：{{ item.endTime }}</div>
            <div class="mg-10">公司名称：{{ item.companyName || "无" }}</div>
            <div class="mg-10">职务名称：{{ item.jobName || "无" }}</div>
            <div class="mg-10">薪金：{{ item.money || "无" }}</div>
            <div class="mg-10">离职原因：{{ item.leaveReason || "无" }}</div>
            <div class="mg-10">证明人及电话：{{ item.certifierPhone || "无" }}</div>
          </div>
        </div>
        <div v-if="!detailInfo.staffInfoWorkVOS.length">暂无工作经历</div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import { useRoute } from "vue-router";
import { fetchDetailData } from "@/api/oaModule";

const route = useRoute();
const activeName = ref("0");
const detailInfo = ref<any>({});
const basicList = ref<any>([
  { label: "工号", title: "staffId" },
  { label: "姓名", title: "staffName" },
  { label: "身份证号码", title: "idCard" },
  { label: "民族", title: "nation" },
  { label: "出生日期", title: "birthDate" },
  { label: "性别", title: "sex" },
  { label: "年龄", title: "age" },
  { label: "最高学历", title: "education" },
  { label: "有无驾驶证", title: "drivingLicence" },
  { label: "婚姻状况", title: "marital" },
  { label: "联系电话", title: "phone" },
  { label: "户口所在地", title: "registeredResidence" },
  { label: "紧急联系人", title: "emergencyName" },
  { label: "紧急联系人电话", title: "emergencyPhone" },
  { label: "入长日期", title: "startDate" },
  { label: "状态", title: "state" },
  { label: "是否住宿", title: "accommodation" },
  { label: "雇员种类", title: "employeKind" },
  { label: "部门", title: "deptName" },
  { label: "组别", title: "groupName" },
  { label: "岗位", title: "roleName" }
]);

const moreList = ref<any>([
  { label: "现居住地址", title: "currentStayAddress" },
  { label: "联系人关系", title: "emergencyRelation" },
  { label: "联系人现居地址", title: "emergencyResidence" },
  { label: "身高(cm)", title: "height" },
  { label: "体重(kg)", title: "weight" },
  { label: "籍贯", title: "nativePlace" },
  { label: "子女人数", title: "children" },
  { label: "参保情况", title: "insurance" },
  { label: "电脑社保号", title: "socialSecurity" },
  { label: "计算机水平", title: "computerLevel" },
  { label: "英语水平", title: "englishLevel" },
  { label: "试用期(月)", title: "tryDate" },
  { label: "工资开始核算日", title: "moneyStartDate" }
]);

onMounted(() => {
  const { id = "" } = route.query;
  fetchDetailData({ id }).then((res) => {
    detailInfo.value = res.data;
    basicList.value.map((item: any, idx) => {
      for (const key in res.data) {
        if (Object.prototype.hasOwnProperty.call(res.data, key)) {
          // const element = res.data[key];
          item.value = res.data[item.title];
        }
      }
    });
    moreList.value.map((item: any) => {
      for (const key in res.data) {
        if (Object.prototype.hasOwnProperty.call(res.data, key)) {
          // const element = res.data[key];
          item.value = res.data[item.title];
        }
      }
    });
  });
});
</script>

<style scoped>
.mg-10 {
  margin: 10px 0;
}
</style>
