<template>
  <div class="signBack">
    <div class="sign-title">
      采购订单

      <div class="right-icon-bar" @click="router.push('/purchaseList')"><van-icon name="wap-home" size="17" /><span style="font-size: 15px">首页</span></div>
    </div>
    <div class="sign-info">
      <div class="info-item">
        <div class="item-title">订单日期：</div>
        <div class="item-des">{{ detailInfo.fdate }}</div>
      </div>
      <div class="info-item">
        <div class="item-title">订单编号：</div>
        <div class="item-des">{{ detailInfo.fbillno }}</div>
      </div>
      <div class="info-item">
        <div class="item-title">采购员：</div>
        <div class="item-des">{{ detailInfo.userName }}</div>
      </div>
      <div class="info-item">
        <div class="item-title">总税额：</div>
        <div class="item-des">{{ detailInfo.fbilltaxamount }}</div>
      </div>
      <div class="info-item">
        <div class="item-title">总金额：</div>
        <div class="item-des">{{ detailInfo.fbillamount }}</div>
      </div>
      <div class="info-item">
        <div class="item-title">总价税合计：</div>
        <div class="item-des">{{ detailInfo.fbillallamount }}</div>
      </div>
      <div class="info-item">
        <div class="item-title">回签状态：</div>
        <div class="item-des">
          <van-tag :type="calcBtnType(detailInfo.billState)">{{ calcState(detailInfo.billState) }}</van-tag>
        </div>
      </div>
    </div>
    <div class="upload-group" v-if="showAction && isRightSup">
      <van-uploader
        accept="image/*,application/pdf"
        v-model="fileList"
        :max-count="1"
        :max-size="20 * 1024 * 1024"
        @oversize="onOversize"
        @click-preview="clickPreview"
        ><div class="slot-file">
          <div>点击选择一个文件上传</div>
          <br />
          <div>注意：仅支持<span>图片以及&nbsp;.pdf</span>格式的文件</div>
        </div></van-uploader
      >
    </div>
    <div class="sign-footer">
      <van-button
        v-if="detailInfo.billState === null && isRightSup"
        type="primary"
        style="width: 83%; margin-top: 30px"
        @click="uploadAttr"
        :loading="submitLoading"
        >提&nbsp;&nbsp;&nbsp;交</van-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { showConfirmDialog, showToast } from "vant";
import { querySignNoInfo, uploadSignAttr, submitSupSignAttr } from "@/api/supSign";
import { getSignBack } from "@/utils/storage";
const loginData = getSignBack();
const route = useRoute();
const router = useRouter();
const submitLoading = ref(false);
const isRightSup = ref(false);
const fileList = ref([]);
const detailInfo = ref({
  fdate: "",
  fbillno: "",
  userName: "", // 采购员
  fbilltaxamount: "", // 总税额
  fbillamount: "", // 总金额
  fbillallamount: "", // 总价税额
  billState: null
});

const showAction = computed(() => {
  return detailInfo.value.billState === null;
});

const onOversize = (file) => {
  showToast("文件大小不能超过 20MB");
};

const calcState = (status) => {
  switch (status) {
    case 0:
      return "待提交";
    case 1:
      return "审核中";
    case 2:
      return "已驳回";
    case 3:
      return "已回签";
    default:
      return "待回签"; // null
  }
};

const calcBtnType = (status) => {
  switch (status) {
    case 1:
      return "primary";
    case 2:
      return "danger";
    case 3:
      return "success";

    default:
      return "warning";
  }
};

const beforeClose = (action): Promise<boolean> =>
  new Promise((resolve) => {
    if (action === "cancel") resolve(true);
    setTimeout(() => {
      if (action === "confirm") {
        // resolve(true);
        const reqParams = { ...detailInfo.value };
        const formData = new FormData();
        const file = (fileList.value[0] as any).file;
        const fileName = (fileList.value[0] as any).file.name;
        formData.append("files", file, fileName);
        formData.append("param", JSON.stringify(reqParams));

        uploadSignAttr(formData)
          .then((res) => {
            if (res.data && res.status === 200) {
              // 继续调用提交接口
              submitSupSignAttr({ billno: detailInfo.value.fbillno })
                .then((subRes) => {
                  if (subRes.data && subRes.status === 200) {
                    showToast("提交成功！");
                    router.push("/purchaseList");
                  }
                })
                .finally(() => resolve(true));
            }
          })
          .finally(() => resolve(true));
      }
    }, 1000);
  });

const uploadAttr = () => {
  if (fileList.value.length) {
    showConfirmDialog({
      message: "您确定要提交吗？",
      beforeClose
    })
      .then(() => {})
      .catch(() => {});
  } else {
    showToast("请先上传文件");
    return;
  }
};

const clickPreview = (file) => {
  // 预览pdf
  if (file.file.name.endsWith(".pdf")) {
    let pdfUrl = window.URL.createObjectURL(new Blob([file.file], { type: "application/pdf" }));
    window.open(pdfUrl);
  }
};

const fetchDetailInfo = () => {
  const billno = localStorage.getItem("purchaseNo");
  querySignNoInfo({ supCode: loginData.userNo, fbillno: billno })
    .then((res) => {
      if (res.data && res.status === 200) {
        detailInfo.value = res.data;
        isRightSup.value = true;
      }
    })
    .catch((e) => {
      showConfirmDialog({
        title: "提示",
        message: e.message,
        showCancelButton: false,
        confirmButtonText: "确定"
      })
        .then(() => {
          // on confirm
          router.push("/purchaseList");
        })
        .catch(() => {
          // on cancel
        });
    });
};

onMounted(() => {
  const billNo = route.query.billNo as string;
  if (billNo) {
    localStorage.setItem("purchaseNo", billNo);
    if (loginData.userNo) {
      fetchDetailInfo();
    }
  }
});
</script>

<style scoped lang="scss">
.close-line {
  padding: 15px;
  // background-color: red;
  color: #409eff;
  font-size: 28px;
  text-align: right;
}
:deep(.van-uploader__file) {
  width: 300px !important;
}
:deep(.van-field__label) {
  text-align: center;
}
.signBack {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .sign-title {
    text-align: left;
    padding: 35px 64px 0;
    font-size: 30px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;

    .right-icon-bar {
      font-weight: normal;
      font-size: 30px;
      color: #409eff;
    }
  }

  .sign-info {
    flex: 1;
    font-size: 28px;

    .info-item {
      display: flex;
      align-items: center;
      margin: 60px;
      .item-title {
        text-align: left;
      }
    }
  }

  .sign-footer {
    padding: 45px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .upload-group {
    display: flex;
    margin-left: 65px;
    font-size: 25px;

    .slot-file {
      height: 260px;
      padding: 50px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border: 1px dashed #ccc;
      border-radius: 15px;
      color: #aaa;

      span {
        color: #409eff;
        margin: 0 15px;
        font-weight: bold;
      }
    }
  }
}
</style>
