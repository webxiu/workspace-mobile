<!-- /*
 * @Author: lixiuhai 
 * @Date: 2024-05-16 11:02:44 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2024-05-16 11:02:44 
 */ -->
<script lang="tsx">
import { defineComponent, PropType, computed } from "vue";
import { JSX } from "vue/jsx-runtime";
import { ColProps } from "vant";

export interface RenderParamsType {
  row: any;
  index: number;
}
export interface TableColumnType {
  label: string;
  prop: string;
  span: number;
  hide?: boolean;
  ellipsis?: boolean;
  colProp?: Partial<ColProps>;
  align?: "left" | "center" | "right";
  headerAlign?: "left" | "center" | "right";
  render?: ((item: RenderParamsType) => JSX.Element) | JSX.Element;
}

const props = {
  gutter: { type: Number, default: 5 },
  columns: { type: Array as PropType<TableColumnType[]>, default: () => [] },
  dataList: { type: Array as PropType<any[]>, default: () => [] }
};

export default defineComponent({
  props: props,
  emits: ["scroll"],
  setup(props, { emit, expose, attrs, slots }) {
    const nDataList = computed(() => props.dataList);

    function onScroll(e) {
      emit("scroll", e);
    }

    expose({ onScroll });
    return () => (
      <div class="hailen-table">
        <van-row class="hailen-table_item">
          {props.columns.map((column, index) => {
            const { span, ellipsis, headerAlign = "center" } = column;
            return column.hide ? null : (
              <van-col span={span}>
                <div class={`table-cell title ${ellipsis ? "ellipsis" : ""}`} style={{ textAlign: headerAlign }}>
                  {column.label}
                </div>
              </van-col>
            );
          })}
        </van-row>
        <div class="table-content" onScroll={onScroll}>
          {nDataList.value.length ? (
            nDataList.value.map((row, index) => {
              return (
                <van-row gutter={props.gutter} class="hailen-table_item">
                  {props.columns.map((column) => {
                    const { render, span, colProp, hide, ellipsis, align = "center" } = column;
                    const innerEle = typeof render === "function" ? render({ row, index }) : row[column.prop];
                    return hide ? null : (
                      <van-col span={span} {...colProp}>
                        <div class={`table-cell ${ellipsis ? "ellipsis" : ""}`} style={{ textAlign: align }}>
                          {innerEle}
                        </div>
                      </van-col>
                    );
                  })}
                </van-row>
              );
            })
          ) : (
            <van-empty description="暂无数据" />
          )}
        </div>
      </div>
    );
  }
});
</script>

<style scoped lang="scss">
$line: var(--van-cell-border-color);
.hailen-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  font-size: 30px;
  overflow: hidden;
  .table-content {
    flex: 1;
    overflow-y: auto;
    margin-top: -1px;
  }
  .hailen-table_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;

    border-bottom: 1px solid $line;
    &:first-child {
      border-top: 1px solid $line;
    }
    .table-cell {
      padding: 6px;
      line-height: 45px;
      width: 100%;
      &.title {
        font-weight: 600;
      }
    }
    :deep(.van-col) {
      display: flex;
      align-items: center;
      height: 100%;
      border-right: 1px solid $line;
    }
    :deep(.van-col:first-child) {
      border-left: 1px solid $line;
    }
  }
}
</style>
