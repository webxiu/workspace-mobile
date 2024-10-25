/*
 * @Author: lixiuhai
 * @Date: 2023-06-23 09:56:28
 * @Last Modified by:   lixiuhai
 * @Last Modified time: 2023-06-23 09:56:28
 */
export enum SignStatus {
  /** 待分发 */
  distribute = "1",
  /** 分发失败 */
  fail = "2",
  /** 待签名 */
  noSign = "3",
  /** 异常反馈 */
  exception = "4",
  /** 已签名 */
  signed = "5",
  /** 归档 */
  dossier = "6",
}

export const statusObj = {
  "1": { color: "blue", title: "待分发" },
  "2": { color: "red", title: "分发失败" },
  "3": { color: "blue", title: "待签名" },
  "4": { color: "red", title: "异常反馈" },
  "5": { color: "green", title: "已签名" },
  "6": { color: "green", title: "归档" },
};
