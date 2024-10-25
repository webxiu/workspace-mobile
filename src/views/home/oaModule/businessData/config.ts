/*
 * @Author: lixiuhai
 * @Date: 2023-06-23 09:57:10
 * @Last Modified by:   lixiuhai
 * @Last Modified time: 2023-06-23 09:57:10
 */

import type { EChartsOption, ToolboxComponentOption } from "echarts";

export interface OptionsType<T> {
  data: T[];
  year: number;
  month: string;
}

export interface SaleItemType {
  FYEAR: number;
  ItemValue: number;
  ItemName: string;
  FMonthName: string;
}

// 暂无数据时绘制提示文本
const noDataText = [
  {
    type: "text",
    top: "50%",
    left: "40%",
    cursor: "default",
    style: {
      text: "暂无数据",
      font: "16px Microsoft YaHei",
      fill: "#969799"
    }
  }
];

/** 图表工具按钮 */
const toolbox = {
  feature: {
    magicType: {
      type: ["line", "bar"],
      title: { bar: "切换为柱状图", line: "切换为折线图" }
    },
    saveAsImage: { title: "保存为图片" },
    dataView: { show: true, title: "数据视图", lang: ["数据视图", "关闭", "刷新"] }
  }
} as ToolboxComponentOption;

/** 折线图配置参数类型 */
export interface LineConfigType {
  title: string;
  xAxis: string[];
  datas: {
    name: string;
    type: "line" | "bar";
    data: any[];
  }[];
}

/** 获取折线图配置 */
const getLineOptions = (opt: LineConfigType) => {
  const { title, xAxis, datas } = opt;

  const series = datas.map((item) => ({
    name: item.name,
    label: { show: true },
    type: item.type || "line",
    smooth: true,
    data: item.data
  }));
  // 判断是否有数据
  const isNoData = datas.some((item) => item.data.length);

  const option: EChartsOption = {
    title: { text: title, top: 5, textStyle: { fontSize: 14 } },
    legend: [{ top: "35px" }],
    tooltip: { trigger: "axis" },
    grid: {
      top: 80,
      left: "3%",
      right: "3%",
      bottom: "5%",
      containLabel: true
    },
    toolbox: toolbox,
    xAxis: { type: "category", boundaryGap: false, data: xAxis },
    yAxis: { type: "value" },
    graphic: {
      elements: isNoData ? [] : noDataText
    },
    series: series
  };
  return option;
};

// X轴1-12月份坐标
const xAxis = Array.from(new Array(12)).map((_, i) => `${i + 1}月`);

// 1.销售数据
export const option_1 = (opeions: OptionsType<SaleItemType>) => {
  const { data, year, month } = opeions;
  // 过滤出当前年份数据
  const currentYearData: SaleItemType[] = data.filter((item: SaleItemType) => item.FYEAR == year);

  //   月实际销售额
  const realData = currentYearData
    .filter((item) => item.ItemName === "月实际销售额")
    .map((item) => {
      const name = item.FMonthName;
      const value = (item.ItemValue / 10000).toFixed(2);
      return { name, value, FYEAR: item.FYEAR, ItemName: item.ItemName };
    })
    .sort((a, b) => parseInt(a.name) - parseInt(b.name));
  // 月计划销售额
  const plainData = currentYearData
    .filter((item) => item.ItemName === "月计划销售额")
    .map((item) => {
      const name = item.FMonthName;
      const value = (item.ItemValue / 10000).toFixed(2);
      return { name, value, FYEAR: item.FYEAR, ItemName: item.ItemName };
    })
    .sort((a, b) => parseInt(a.name) - parseInt(b.name));

  // 销售达成率
  const salesRate = currentYearData.filter((item) => item.ItemName == "销售达成率" && item.FYEAR == year && parseInt(item.FMonthName) == parseInt(month))[0];
  return getLineOptions({
    title: `销售数据(单位:万元, 达成率${salesRate?.ItemValue || "0.00"}%)`,
    xAxis: xAxis,
    datas: [
      { type: "line", name: "实际", data: realData },
      { type: "line", name: "计划", data: plainData }
    ]
  });
};

export interface ProductItemType {
  [key: number | string]: number;
}

// 2.生产数据
export const option_2 = (opeions: OptionsType<ProductItemType>) => {
  const { data, year, month } = opeions;

  const _dataObj = data[0];
  const prodData = Object.keys(_dataObj || {})
    .map((_, i) => _dataObj[i])
    .filter(Boolean);
  return getLineOptions({
    title: `生产数据(单位:Pcs)`,
    xAxis: xAxis,
    datas: [{ type: "line", name: "", data: prodData }]
  });
};

export interface ComplainItemType {
  month: number;
  num: number;
}

// 3.客户投诉
export const option_3 = (opeions: OptionsType<ComplainItemType>) => {
  const { data, year, month } = opeions;
  let totalNum = 0;
  let complainData: number[] = [];
  const max = Math.max(...data.map((item) => item.num));
  const indicator = xAxis.map((name) => ({ name, max: max })).reverse();

  for (let i = 1; i <= 12; i++) {
    const dataItem = data.filter(({ month }) => month == i)[0];
    if (dataItem) {
      complainData.push(dataItem.num);
      totalNum += dataItem.num;
    } else {
      complainData.push(0);
    }
  }
  return getLineOptions({
    title: `客户投诉(单位:笔, 总计:${totalNum}笔)`,
    xAxis: xAxis,
    datas: [{ type: "line", name: "", data: complainData }]
  });
};

export interface HumanResourcestemType {
  /** 月份 */
  today: number;
  /** 人数 */
  num: number;
  /** 人员类型(1:职员 2:临时工 3:员工) */
  type: "1" | "2" | "3";
}

// 4.人力资源
export const option_4 = (opeions: OptionsType<HumanResourcestemType>) => {
  const { data, year, month } = opeions;

  const clerkData: number[] = []; // 职员
  const tempData: number[] = []; // 临时工
  const staffData: number[] = []; // 员工

  data.forEach((item) => {
    if (item.type === "1") {
      clerkData.push(item.num);
    } else if (item.type === "2") {
      tempData.push(item.num);
    } else if (item.type === "3") {
      staffData.push(item.num);
    }
  });
  const peopleNum = clerkData[clerkData.length - 1] + tempData[clerkData.length - 1] + staffData[clerkData.length - 1];
  return getLineOptions({
    title: `人力资源(单位:人, 总人数:${peopleNum}人)`,
    xAxis: xAxis,
    datas: [
      { type: "line", name: "职员人数", data: clerkData },
      { type: "line", name: "临时工人数", data: tempData },
      { type: "line", name: "员工人数", data: staffData }
    ]
  });
};
