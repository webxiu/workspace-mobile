// 单据审批状态
export enum BillState {
  /** 待提交 */
  submit = 0,
  /** 审核中 */
  auditing = 1,
  /** 已审核 */
  audited = 2,
  /** 重新审核 */
  reject = 3,
  /** 已终止 */
  revoke = 4
}

// 单据审批状态颜色
export const BillStateObj = {
  [BillState.submit]: { name: "待提交", color: "#409eff", type: "primary" },
  [BillState.auditing]: { name: "审核中", color: "#e6a23c", type: "warning" },
  [BillState.audited]: { name: "已审核", color: "#67c23a", type: "success" },
  [BillState.reject]: { name: "重新审核", color: "#dc143c", type: "danger" },
  [BillState.revoke]: { name: "已终止", color: "#763a96", type: "default" }
};
