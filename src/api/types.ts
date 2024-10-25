import { TableColumnType } from "@/components/HxTable/index.vue";

/**==================== 登录 ==================== */
/** 登录用户信息类型 */
export interface LoginUserInfoType {
  id: number;
  userCode: string;
  userName: string;
  createDate: string;
  deptId: number;
  userState: string;
  mobile: string;
  wxOpenid: string;
  avatar: string;
  workRuleId: string;
  password: string;
  postName: string;
  qunhuiAccount: string;
  qunhuiPassword: string;
  k3UserAccount: string;
  roleName: string;
  deptCode: string;
  email: string;
  orgId: string;
  deptName: string;
  groupId: string;
  groupName: string;
  wageAccountingType: string;
  sysUserDeptMiddleVOList: string;
  authList: UserAuthItemType[];
}

/** 用户权限菜单列表类型 */
export interface UserAuthItemType {
  id: number;
  menuCode: string;
  menuName: string;
  parentCode: string;
  icon: string;
  appHomeUrl: string;
  appDetailUrl: string;
  isLeaf: boolean;
  meta?: Partial<{ title: string; icon: string; order: number }>;
}

/**===============  ===== 信息中心 ==================== */

/** 业务审批详情 */
export interface AuditTaskInfoItemType {
  billId: string;
  formName: string;
  formSort: number;
  formNo: string;
  itemList: { itemName: string; detailList: DetailItemType[] }[];
  /** 自定义属性, 接收组合表格数据 */
  combineList: DetailListItemType[];
  columns: TableColumnType[];
  formModel: string;
}
/** 业务审批详情-表单原始数据列表类型 */
export interface DetailItemType {
  inputItemName: string;
  inputItemFieldName: string;
  inputItemSort: number;
  inputItemValue: string;
  inputItemModel: string;
  readable: boolean;
  writable: boolean;
  required: boolean;
}
/** 业务审批详情-表单组合表格数据类型 */
export interface DetailListItemType {
  userId: string;
  userName: string;
  overtimeType: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  days: number;
  hours: number;
  remark: string;
}

/**==================== 人事行政部 ==================== */
/** 打卡记录列表类型 */
export interface AttendanceRecordItemType {
  id: string;
  sn: string;
  staffId: string;
  deptId: string;
  attTime: string;
  recordTotal: string;
  orgId: string;
  staffCode: string;
  staffName: string;
  deptName: string;
  pin: string;
  attMachineName: string;
}
/** 面部采集列表类型 */
export interface FaceCollectItemType {
  id: number;
  staffId: string;
  staffName: string;
  deptId: number;
  groupId: string;
  position: string;
  roleId: number;
  sex: string;
  education: string;
  marital: string;
  children: string;
  nation: string;
  birthDate: string;
  nativePlace: string;
  height: string;
  weight: string;
  englishLevel: string;
  computerLevel: string;
  drivingLicence: string;
  age: number;
  idCard: string;
  insurance: string;
  socialSecurity: string;
  registeredResidence: string;
  phone: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  emergencyResidence: string;
  startDate: string;
  contractExpiresDate: string;
  contractRenewalDate: string;
  oldPosition: string;
  newPosition: string;
  transferDate: string;
  remark: string;
  accommodation: string;
  contractSigning: string;
  ogranizationId: number;
  state: string;
  level: string;
  leaveofficeDate: string;
  renewalCount: string;
  province: string;
  city: string;
  district: string;
  resignationReason: string;
  temporaryFlag: number;
  laborServiceCompany: string;
  employeKind: string;
  currentStayAddress: string;
  tryDate: number;
  tryDateMoney: string;
  moneyStartDate: string;
  createUserId: string;
  createDate: string;
  clockingInUserCode: string;
  workRuleId: number;
  inductionCheckInId: string;
  noAttendance: boolean;
  userInfoId: string;
  wxOpenId: string;
  deptCode: string;
  deptName: string;
  groupCode: string;
  groupName: string;
  forenoonStart: string;
  forenoonEnd: string;
  afternoonStart: string;
  afternoonEnd: string;
  worktime: string;
  roleName: string;
  applyPosition: string;
  annualleave: string;
  validDate: string;
  authority: string;
  wageAccountingType: string;
  orgId: string;
  deptGroupInfoList: string;
  staffInfoWorkVOS: string;
  staffInfoFamilyVOS: string;
  staffInfoEducationVOS: string;
  staffInfoPhotoVOS: string;
  permissionFlag: string;
  permissionDeptId: string;
  userCode: string;
  userName: string;
  infoEduStartTime: string;
  infoEduEndTime: string;
  infoEduSchoolName: string;
  infoEducation: string;
  infoEduMajor: string;
  facePic: false;
  idpicture: string;
  inDate: string;
}
/** 离职申请列表类型 */
export interface ResignApplyItemType {
  id: string;
  billId: string;
  billNo: string;
  billState: number;
  staffId: number;
  deptName: string;
  staffCode: string;
  staffName: string;
  roleName: string;
  startDate: string;
  applyDate: string;
  resignationType: string;
  resignationReason: string;
  createUserId: number;
  createDate: string;
  modifyUserId: number;
  modifyDate: string;
  orgId: string;
}

/** 工号获取人员信息列表类型 */
export interface UserBasicInfoItemType {
  deptName: string;
  staffCode: string;
  staffName: string;
  roleName: string;
  staffId: number;
  startDate: string;
}
/**==================== 生产制造中心 ==================== */

/** 生产排产 - 列表响应类型 */
export interface ProdScheduleResType {
  records: ProdScheduleItemType[];
  total: number;
  size: number;
  current: number;
  orders: number[];
  optimizeCountSql: boolean;
  searchCount: boolean;
  countId: string;
  maxLimit: number;
  pages: number;
}
/** 生产排产 - 列表类型 */
export interface ProdScheduleItemType {
  FBILLNO: string;
  FNAME: string;
  Prodline: string;
  FPlanQty: string;
  PlanDate: string;
}

/**==================== 品质中心 ==================== */

/** 二维码验证历史列表类型 */
export interface CodeCompareItemType {
  id: string;
  billNo: string;
  createUserId: number;
  userName: string;
  finishedResult: string;
  createDate: string;
  filePath: string;
  verifyRecordVOList?: CompareDetailItemType[];
  orgId: string;
}
/** 二维码验证详情列表类型 */
export interface CompareDetailItemType {
  id: string;
  masterId: string;
  qrCodeContent: string;
  numberContent: string;
  verifyResult: string;
  orgId: string;
}
/** 二维码验证结果列表类型 */
export interface CompareResultResType {
  codeNumber: number;
  qrCodeVerifyDataVOS: CompareResultItemType[];
  finishedResult: string;
}
/** 二维码验证结果列表类型 */
export interface CompareResultItemType {
  qrCodeContent: string;
  numberContent: string;
  verifyResult: string;
}
