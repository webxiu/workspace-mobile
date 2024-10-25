import { TagType, showDialog } from "vant";

/**
 * 列表及详情状态tag颜色
 * @param statusText 状态文本
 * @returns
 */
export const colorSelector = (statusText: string): TagType => {
  let statusColor: TagType;
  switch (statusText) {
    case "待提交":
      statusColor = "primary";
      break;
    case "审核中":
      statusColor = "warning";
      break;
    case "已审核":
      statusColor = "success";
      break;
    case "重新审核":
      statusColor = "danger";
      break;
    default:
      statusColor = "default";
      break;
  }
  return statusColor;
};

/**
 * 封装vant的showDialog提示信息
 * @param type 类型(成功或失败)
 * @param message 提示信息
 * @param title 显示标题
 */
export const showToastModel = (type: "success" | "fail", message: string, title = "提示信息:") => {
  return showDialog({
    title: title,
    message: message,
    theme: "round-button",
    confirmButtonColor: type === "success" ? "green" : "red",
    confirmButtonText: "确认"
  });
};
