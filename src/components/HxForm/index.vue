<!-- /*
 * @Author: Hailen 
 * @Date: 2024-10-19 10:13:18 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2024-10-19 10:13:18 
 */ -->

<script lang="tsx">
import { ref, defineComponent, PropType, watch, toRaw, Ref, h } from "vue";
import type { FormInstance, ColProps, FormProps, FieldProps } from "vant";
import { computed, isRef, CSSProperties } from "vue";
import { JSX } from "vue/jsx-runtime";

export type FormModelType = Record<string, any>;

export interface RenderParamsType {
  formModel: FormModelType;
  row: FormConfigItemType;
  index: number;
}

/** 表单项插槽类型 */
export type SlotsType = { [key: string]: (slot: Record<string, any>) => JSX.Element };

export interface FormConfigItemType extends Partial<FieldProps> {
  /** 表单名称 */
  label?: string;
  /** 表单属性 */
  name: string;
  /** 网格布局 */
  colProp?: Partial<ColProps>;
  /** 是否隐藏 (不渲染表单项目) */
  hide?: boolean;
  /** 表单项渲染函数 */
  render?: (item: RenderParamsType) => JSX.Element;
  /** 表单插槽 */
  slots?: (item: RenderParamsType) => SlotsType;
  style?: CSSProperties;
  class?: string;
}

const props = {
  /** 视图加载 */
  loading: { type: Boolean, default: false },
  /** 表单数据Model */
  formData: { type: Object as PropType<FormModelType>, default: () => ({}) },
  /** 表单Item配置 */
  formConfigs: { type: Array as PropType<FormConfigItemType[] | Ref<FormConfigItemType[]>>, default: () => [] },
  /** 表单属性 */
  formProps: { type: Object as PropType<Partial<FormProps>>, default: () => ({} as Partial<FormProps>) },
  /** 提交按钮网格布局 */
  submitColProp: { type: Object as PropType<Partial<ColProps>>, default: { span: 24 } },
  /** 重置按钮网格布局 */
  resetColProp: { type: Object as PropType<Partial<ColProps>>, default: { span: 24 } },
  /** 表单项之间的距离 */
  gutter: { type: Number, default: 20 },
  /** 是否显示提交按钮 */
  showSubmit: { type: Boolean, default: true },
  /** 是否显示重置按钮 */
  showReset: { type: Boolean, default: false },
  /** 提交按钮名称 */
  submitText: { type: [String, Boolean], default: "提交" },
  /** 重置按钮名称 */
  resetText: { type: [String, Boolean], default: "重置" }
};

export default defineComponent({
  props: props,
  emits: ["submit", "reset", "change"],
  setup(props, { emit, expose, attrs, slots }) {
    const formRef = ref<FormInstance>();
    const formInline = ref<FormModelType>(props.formData);
    watch(props, watchUpdata, { deep: true });
    function watchUpdata(values) {
      formInline.value = values.formData;
      emit("change", values.formData);
    }

    const configList = computed<FormConfigItemType[]>(() => {
      const configs = props.formConfigs;
      return isRef(configs) ? configs.value : configs;
    });
    const onSubmit = (values) => {
      formRef.value
        ?.validate()
        .then(() => emit("submit", formInline.value))
        .catch(console.log);
    };
    const onReset = () => {
      emit("reset");
    };

    function getRef() {
      return formRef.value;
    }

    expose({ getRef, onSubmit, onReset });

    return () => (
      <van-form ref={formRef} class="hx-form" onSubmit={onSubmit} {...props.formProps}>
        <van-cell-group inset>
          <van-row gutter={props.gutter}>
            {configList.value.map((item, index) => {
              const { render, slots, colProp, hide, ...itemProps } = item;
              const formItem = typeof render === "function" ? render({ formModel: formInline.value, row: item, index }) : null;
              const formSlot = typeof slots === "function" ? slots({ formModel: formInline.value, row: item, index }) : null;
              const slotList = formSlot ? { ...toRaw(formSlot) } : formSlot;
              return hide ? null : (
                <van-col span={24} {...colProp} key={item.name}>
                  {formItem ? (
                    h(formItem, { ...itemProps })
                  ) : (
                    <van-field v-model={formInline.value[item.name]} clearable {...itemProps}>
                      {slotList}
                    </van-field>
                  )}
                </van-col>
              );
            })}
            {props.showSubmit ? (
              <van-col span={24} {...props.submitColProp} class="mt-32">
                <van-button type="primary" round block native-type="submit">
                  {props.submitText}
                </van-button>
              </van-col>
            ) : null}
            {props.showReset ? (
              <van-col span={24} {...props.resetColProp} class="mt-32">
                <van-button type="default" round block native-type="reset" onClick={onReset}>
                  {props.resetText}
                </van-button>
              </van-col>
            ) : null}
          </van-row>
        </van-cell-group>
      </van-form>
    );
  }
});
</script>

<style lang="scss">
.hx-form {
  .van-col:not(:last-child) .van-cell {
    border-bottom: 1px solid var(--van-cell-border-color);
  }
}
</style>
