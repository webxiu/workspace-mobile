<template>
  <van-button
    icon="setting-o"
    class="flex-1"
    @click="visible = true"
    style="margin: 0 var(--van-padding-base)"
  />
  <van-popup
    v-model:show="visible"
    position="bottom"
    class="popup-model"
    teleport="body"
    @close="onClose"
  >
    <van-form>
      <van-cell-group inset>
        <van-field name="lineStyle" label="画笔颜色">
          <template #input>
            <input type="color" v-model="formData.lineStyle" />
          </template>
        </van-field>
        <van-field name="fillStyle" label="背景颜色">
          <template #input>
            <input type="color" v-model="formData.fillStyle" />
          </template>
        </van-field>
        <van-field name="lineWidth" label="画笔大小">
          <template #input>
            <van-stepper
              v-model="formData.lineWidth"
              min="1"
              max="6"
              step="1"
              theme="round"
              button-size="24"
              disable-input
            />
          </template>
        </van-field>
        <div style="padding: 20px 0px 30px; text-align: center">
          <van-button size="small" @click="onReset"> 恢复默认 </van-button>
          <van-button
            type="primary"
            size="small"
            @click="visible = false"
            style="margin-left: 20px"
          >
            确认修改
          </van-button>
        </div>
      </van-cell-group>
    </van-form>
  </van-popup>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

const defaultValue = {
  lineWidth: 3,
  lineStyle: "#000000",
  fillStyle: "#ffffff",
};

const emits = defineEmits(["change"]);
const visible = ref<boolean>(false);
const formData = reactive({
  lineWidth: defaultValue.lineWidth,
  lineStyle: defaultValue.lineStyle,
  fillStyle: defaultValue.fillStyle,
});

function onReset() {
  formData.lineWidth = defaultValue.lineWidth;
  formData.lineStyle = defaultValue.lineStyle;
  formData.fillStyle = defaultValue.fillStyle;
}

function onClose() {
  emits("change", formData);
}

defineExpose({ onReset });
</script>
