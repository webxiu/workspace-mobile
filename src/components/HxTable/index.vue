<script lang="tsx">
import { defineComponent, computed, PropType } from "vue";
import { JSX } from "vue/jsx-runtime";

export type DataItemType = Record<string, any>;

export interface RenderParamsType {
  index: number;
  row: DataItemType;
  column: TableColumnType;
}

/** 行属性 */
export interface TableColumnType {
  label: string;
  prop: string;
  index?: boolean;
  width?: number;
  hide?: boolean;
  ellipsis?: boolean;
  align?: "left" | "center" | "right";
  headerAlign?: "left" | "center" | "right";
  render?: ((item: RenderParamsType) => JSX.Element | string) | JSX.Element;
}

/** 表格属性 */
const props = {
  height: { type: Number, default: 100 },
  maxHeight: { type: Number, default: 260 },
  width: { type: Number, default: 80 },
  ellipsis: { type: Boolean, default: true },
  loading: { type: Boolean, default: false },
  columns: { type: Array as PropType<TableColumnType[]>, default: () => [] },
  dataList: { type: Array as PropType<DataItemType[]>, default: () => [] }
};

export default defineComponent({
  props: props,
  emits: ["scroll"],
  setup(props, { emit, expose, attrs, slots }) {
    const _dataList = computed(() => props.dataList);

    function onScroll(e) {
      emit("scroll", e);
    }

    return () => (
      <div class="hx-table" style={{ overflowX: props.loading ? "hidden" : "auto" }}>
        <table class="table" style={{ width: "100%" }}>
          <thead>
            <tr>
              {props.columns.map((column) => {
                const { label, prop, hide, headerAlign = "center", width = props.width } = column;
                const maxWidth = width + "px";
                return hide ? null : (
                  <td class="row-item" key={prop} style={{ textAlign: headerAlign, maxWidth, minWidth: maxWidth }}>
                    {label}
                  </td>
                );
              })}
            </tr>
          </thead>
          <div style={{ width: "100%", overflowY: "auto" }}>
            <tbody style={{ height: _dataList.value.length ? "auto" : props.height + "px", maxHeight: props.maxHeight + "px" }} onScroll={onScroll}>
              {_dataList.value.length ? (
                _dataList.value.map((row, index) => {
                  return (
                    <tr key={index}>
                      {props.columns.map((column) => {
                        const { render, ellipsis = props.ellipsis, hide, align = "center", width = props.width } = column;
                        const maxWidth = width + "px";
                        let innerEle = row[column.prop];
                        if (column.index) innerEle = index + 1;
                        if (typeof render === "function") innerEle = render({ row, column, index });
                        return hide ? null : (
                          <td key={column.prop} class={`row-item ${ellipsis ? "ellipsis" : ""}`} style={{ maxWidth, minWidth: maxWidth, textAlign: align }}>
                            <span class="cell-item">{innerEle}</span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              ) : (
                <van-empty image-size="50" description="暂无数据" />
              )}
            </tbody>
          </div>
        </table>
        {props.loading ? <van-loading vertical>加载中...</van-loading> : null}
      </div>
    );
  }
});
</script>

<style lang="scss" scoped>
.hx-table {
  overflow-x: auto;
  border: 1px solid #eee;
  position: relative;

  table {
    border-collapse: collapse;
  }
  .row-item {
    background: rgba(253, 253, 253, 0.5);
    border: 1px solid rgba(234, 239, 243, 1);
    font-size: 28px;
    font-weight: 400;
    color: rgba(63, 63, 63, 1);
    border: 1px solid #d6d6d6;
    overflow: hidden;
  }
  thead td.row-item {
    line-height: 20px;
    padding: 20px 20px;
    font-weight: 700;
    white-space: nowrap;
  }
  thead {
    display: inline-block;
    position: sticky;
  }
  tbody {
    display: inline-block;
    overflow-y: auto;
    width: 100%;
  }
  tbody tr:first-child td.row-item {
    border-top: none;
  }
  tbody td.row-item {
    padding: 5px;
    padding: 20px 20px;
    line-height: 20px;
    .table-cell-cont {
      width: inherit;
    }
  }

  .van-empty {
    padding: 10px 0;
  }
  .van-loading {
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
