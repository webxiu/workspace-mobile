/*
 * @Author: lixiuhai
 * @Date: 2023-06-23 10:02:59
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-21 17:20:43
 */

import { NotifyOptions, NotifyType, showNotify } from "vant";
import { h, reactive } from "vue";

import HxForm from "@/components/HxForm/index.vue";
import { addDialog } from "@/components/ReDialog";
import { commonBack } from "@/api/common";
import dayjs from "dayjs";

const title = "德龙工作台";

/**
 * 设置网页标题
 * @param pageTitle 标题名称
 * @returns 标题名称
 */
export const getPageTitle = (pageTitle) => {
  if (pageTitle) {
    return `${pageTitle}`;
  }
  return `${title}`;
};

/** JSON字符串转换对象 */
export function toParse(str) {
  try {
    const parsed = JSON.parse(str || "{}");
    return parsed;
  } catch (e) {
    return {};
  }
}

/**
 * 日期格式化
 * @param date 日期数据
 * @param fmt 格式化
 */
export function formatDate(date: string | number, fmt = "YYYY-MM-DD HH:mm:ss") {
  return date ? dayjs(date).format(fmt) : "";
}

/**
 * 函数防抖
 * @param fn 处理函数
 * @param wait 等待时间
 */
export const debounce = (fn: Function, wait = 300) => {
  let timeout: NodeJS.Timeout;
  return (...arg) => {
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(fn.bind(null, ...arg), wait);
  };
};

/**
 * 函数节流
 * @param fn 处理函数
 * @param delay 间隔时间
 */
export const throttle = (fn: Function, delay = 300) => {
  let prev = Date.now();
  return (...args: any) => {
    const now = Date.now();
    if (now - prev >= delay) {
      fn.call(null, ...args);
      prev = Date.now();
    }
  };
};

/**
 * 获取信息中心列表tag相关颜色
 * @param priority 优先级中文汉字
 * @returns 对应的颜色字符串
 */
export const getColorByPriority = (priority: string): string => {
  let pri: string;
  switch (priority) {
    case "最高":
      pri = "red";
      break;
    case "较高":
      pri = "orange";
      break;
    case "普通":
      pri = "#722ed1";
      break;
    case "较低":
      pri = "#946A2C";
      break;
    case "最低":
      pri = "green";
      break;

    default:
      pri = "#fff";
      break;
  }

  return pri;
};

/**
 * 获取当前年月日
 * @param yyyy 年份
 * @returns
 */
export const getDateTime = (yyyy?: number) => {
  const year = yyyy || new Date().getFullYear();
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const mm = `${month}`.padStart(2, "0");
  const dd = `${day}`.padStart(2, "0");

  return {
    year: year,
    month: mm,
    day: dd,
    dateText: `${year}年${mm}月${dd}日`, // 当前年月
    dateTime: `${year}-${mm}-${dd}`, // 当前日期
    lastDate: `${year}-12-31` // 当前年的最后一天日期
  };
};

/**
 * 判断是否在移动端应用或者企业微信中打开
 */
export const getPlatform = () => {
  const isMobile = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  );
  const isWx = /micromessenger/i.test(navigator.userAgent);
  const isQywx = /wxwork/i.test(navigator.userAgent);
  return {
    /** 是否微信 */
    isWx: isWx,
    /** 是否企业微信 */
    isQywx: isQywx,
    /** 是否移动端 */
    isMobile: Boolean(isMobile),
    /** 是否PC端 */
    isPC: !Boolean(isMobile)
  };
};

export const getUrlParameters = (url: string): any => {
  const params: any = url.match(/([^?=&]+)(=([^&]*))/g) || [];
  const res = params.reduce((a, v) => ((a[v.slice(0, v.indexOf("="))] = decodeURIComponent(v.slice(v.indexOf("=") + 1))), a), {});
  return res;
};

/**
 * 判断是否在微信浏览器中运行
 */
export const isWeiXin = () => {
  const ua = navigator.userAgent.toLowerCase();
  const runOnWx = ua.indexOf("micromessenger") !== -1;
  if (runOnWx) {
    return true;
  } else {
    return false;
  }
};

/**
 * 车辆来源枚举
 */
export const carSourceContantInfo = {
  1: "派车",
  2: "私家车",
  3: "其他"
};

/**
 * 获取对象数组中汉字首字母
 */

export const pySegSort = (arr) => {
  if (arr.length == 0) return;
  if (!String.prototype.localeCompare) return null;
  var letters = "*ABCDEFGHJKLMNOPQRSTWXYZ".split("");
  var zh = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split("");
  var segs: any = []; // 存放数据
  var res: any = {};
  let curr;
  var re = /[^\u4e00-\u9fa5]/; //中文正则
  var pattern = new RegExp("[`\\-~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？12345678990]"); //特殊符号

  letters.filter((items, i) => {
    curr = {
      groupName: "", //字母
      children: [] //数据
    };
    arr.map((v, index) => {
      // 特殊字符
      if (pattern.test(v.userName[0])) {
        if ((!zh[i - 1] || zh[i - 1].localeCompare(v.userName) <= 0) && v.userName.localeCompare(zh[i]) == -1) {
          curr.children.push(v);
        }
      }
      // 判断首个字是否是中文
      if (re.test(v.userName[0])) {
        // 英文
        if (v.userName[0].toUpperCase() == items) {
          curr.children.push(v);
        }
      } else {
        // 中文
        if ((!zh[i - 1] || zh[i - 1].localeCompare(v.userName) <= 0) && v.userName.localeCompare(zh[i]) == -1) {
          curr.children.push(v);
        }
      }
    });

    if (curr.children.length) {
      curr.groupName = letters[i];
      segs.push(curr);
      curr.children.sort((a, b) => {
        return a.userName.localeCompare(b.userName);
      });
    }
  });
  res.segs = Array.from(new Set(segs)); //去重
  return res;
};

export function showNotice(type: NotifyType, message: string, duration = 5000, opt: NotifyOptions = {}) {
  showNotify({ type, message, duration, ...opt });
}

/** 单据公共回退逻辑 */
export function commonBackLogic({ billNo, ...param }) {
  return new Promise((resolve, reject) => {
    const formData = reactive({ comment: "" });
    const resultDialog = addDialog({
      title: `单据回退【${billNo}】`,
      props: {
        formData: formData,
        formConfigs: [
          {
            label: "备注",
            name: "comment",
            placeholder: "请输入",
            type: "textarea",
            rows: 3,
            style: { marginTop: "30px" },
            rules: [{ required: true, message: "请输入备注", trigger: "blur" }]
          }
        ]
      },
      show: true,
      lockScroll: true,
      showCancelButton: true,
      showConfirmButton: false,
      contentRender: () =>
        h(HxForm, {
          onSubmit: (data) => {
            const backToActivityId = "startEvent1";
            commonBack({ ...param, ...formData, backToActivityId, billNo })
              .then((res) => {
                if (!res.data) return reject(res);
                resolve(data);
                resultDialog.options.value.show = false;
              })
              .catch((err) => reject(err));
          }
        })
    });
  });
}
