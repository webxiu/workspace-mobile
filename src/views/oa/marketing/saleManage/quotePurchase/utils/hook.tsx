import { useEleHeight } from "@/hooks";
import { v4 as uuidv4 } from "uuid";
import { h, onMounted, reactive, ref } from "vue";
import { addDialog } from "@/components/ReDialog";
import { type PaginationProps } from "@pureadmin/table";
import { message, showMessageBox, wrapFn } from "@/utils/message";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { BillState_Color, BillState, PAGE_CONFIG } from "@/config/constant";
import { getMenuColumns, RendererType, setColumn, updateButtonList } from "@/utils/table";
import { Printer, Tickets, Plus, Edit, Delete, Position, Download } from "@element-plus/icons-vue";
import { quoteApplyList, QuoteApplyListItemType, addQuoteApply, updateQuoteApply, deleteQuoteApply } from "@/api/oaManage/marketing";
import Print from "../print.vue";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref<QuoteApplyListItemType[]>([]);
  const rowData = ref<QuoteApplyListItemType>();
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const formData = reactive({ page: 1, limit: PAGE_CONFIG.pageSize });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 46);

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "申请单号", value: "billNo" },
    { label: "申请日期", value: "createDate", type: "date", format: "YYYY-MM-DD" },
    { label: "申请人", value: "createUserName" },
    { label: "产品编码", value: "productCode" },
    { label: "客户名称", value: "customerName" },
    {
      label: "是否翻单",
      value: "isRepeatOrder",
      children: [
        { label: "是", value: "是" },
        { label: "否", value: "否" }
      ]
    },
    { label: "参考单号", value: "referenceBillNo" },
    { label: "参考物料编码", value: "referenceMaterialCode" }
  ]);

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "询价单号", prop: "billNo", minWidth: 160 },
      { label: "询价日期", prop: "createDate", minWidth: 120 },
      {
        label: "单据状态",
        prop: "billState",
        minWidth: 140,
        align: "center",
        cellRenderer({ row, column }) {
          const value = row[column.columnKey] as string;
          if (!value) return value;
          const item = BillState_Color[value];
          const styleBox = { color: "#fff", padding: "3px 6px", borderRadius: "4px", background: item.color };
          return <span style={styleBox}>{item.name}</span>;
        }
      },
      { label: "采购员", prop: "createUserName", minWidth: 100 },
      { label: "物料编码", prop: "productCode", minWidth: 140 },
      { label: "物料名称", prop: "customerName", minWidth: 140 },
      { label: "物料规格", prop: "isRepeatOrder", minWidth: 100 },
      { label: "单价类型", prop: "quoteQuantity", minWidth: 100 },
      { label: "采购价格", prop: "quoteQuantityMoney", minWidth: 100 },
      { label: "申请单号", prop: "referenceBillNo", minWidth: 140 }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const getTableList = () => {
    loading.value = true;
    quoteApplyList(formData)
      .then(({ data }) => {
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .catch((err) => (loading.value = false));
  };

  const onReFresh = () => {
    getColumnConfig();
    getTableList();
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    console.log("formData", formData);
    getTableList();
  };

  function onAdd() {
    openDialog("add", {} as QuoteApplyListItemType);
  }

  const onEdit = wrapFn(rowData, () => {
    openDialog("edit", rowData.value);
  });

  function combineArrays(countArr = [], priceArr = []) {
    return countArr.map((item, index) => {
      return { id: uuidv4(), count: item, price: priceArr[index] };
    });
  }

  const openDialog = (type: "add" | "edit", row?: QuoteApplyListItemType) => {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    const quoteList = combineArrays(row.quoteQuantityLists, row.quoteQuantityMoneyLists);
    addDialog({
      title: `${title}报价申请单`,
      props: { row: { ...row, quoteList } },
      width: "80%",
      draggable: true,
      fullscreenIcon: true,
      contentRenderer: () => h(Print, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const { quoteList, ...formData } = formRef.value.formData;
        const quoteQuantity = quoteList.map((item) => item.count).join(",");
        const quoteQuantityMoney = quoteList.map((item) => item.price).join(",");
        const params = { ...formData, quoteQuantity, quoteQuantityMoney };
        console.log("表单数据", formRef.value.formData);
        console.log("params", params);

        // if (type === "edit" && ![BillState.submit, BillState.reject].includes(row.billState)) {
        //   return message("只有待提交和重新审核的单据才能修改", { type: "error" });
        // }
        FormRef.getRef().validate((valid) => {
          if (valid) {
            showMessageBox("确认提交吗").then(() => {
              const reqApi = { add: addQuoteApply, edit: updateQuoteApply };
              reqApi[type](params).then((res) => {
                if (res.data) {
                  message(`${title}成功`);
                  getTableList();
                  done();
                } else {
                  message(`${title}失败`, { type: "error" });
                }
              });
            });
          }
        });
      }
    });
  };

  const onDelete = wrapFn(rowData, () => {
    const { billNo } = rowData.value;
    showMessageBox(`确认要删除申请单号【${billNo}】吗?`).then(() => {
      deleteQuoteApply({ deleteIds: [rowData.value.id] }).then(({ data }) => {
        if (!data) return message("删除失败", { type: "error" });
        message("删除成功");
        getTableList();
      });
    });
  });

  const onSubmit = wrapFn(rowData, () => {
    console.log("提交", rowData.value);
  });

  const onRevoke = wrapFn(rowData, () => {
    console.log("撤销", rowData.value);
  });

  const onExport = wrapFn(rowData, () => {
    console.log("导出", rowData.value);
  });

  const onCurrentChange = (row: QuoteApplyListItemType) => {
    rowData.value = row;
  };
  const onDblclick = (row: QuoteApplyListItemType) => {
    openDialog("edit", row);
  };

  // 分页相关
  function handleSizeChange(val: number) {
    formData.limit = val;
    getTableList();
  }

  function handleCurrentChange(val: number) {
    formData.page = val;
    getTableList();
  }

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", icon: Plus, isDropDown: false },
    { clickHandler: onEdit, type: "warning", text: "修改", icon: Edit, isDropDown: false },
    { clickHandler: onDelete, type: "danger", text: "删除", icon: Delete, isDropDown: false },
    { clickHandler: onSubmit, type: "primary", text: "提交", icon: Position, isDropDown: true },
    { clickHandler: onRevoke, type: "default", text: "撤销", icon: Tickets, isDropDown: true },
    { clickHandler: onExport, type: "default", text: "导出", icon: Download, isDropDown: true }
    // { clickHandler: onDetail, type: "default", text: "审批详情", icon: Tickets, isDropDown: true },
  ]);

  return {
    loading,
    columns,
    dataList,
    maxHeight,
    pagination,
    searchOptions,
    buttonList,
    onReFresh,
    onTagSearch,
    onDblclick,
    onCurrentChange,
    handleSizeChange,
    handleCurrentChange
  };
};
