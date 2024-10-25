/*
 * @Author: lixiuhai
 * @Date: 2023-06-23 10:03:25
 * @Last Modified by:   lixiuhai
 * @Last Modified time: 2023-06-23 10:03:25
 */

import { regExp } from "@/utils/regExp";

/**
 * 验证网址
 * @param arg 网址
 */
export const isExternal = (arg) => {
  return /^(https?:|mailto:|tel:)/.test(arg);
};

/**
 * 验证手机号码
 * @param arg 手机号码
 */
export const validPhone = (arg) => {
  let pass = false;
  const val = String(arg).trim();
  if (!regExp.phone.test(val)) {
    pass = false;
  } else {
    pass = true;
  }
  return pass;
};

/**
 * 验证网址是否有效
 * @param arg url地址
 */
export const validURL = (arg) => {
  const reg = regExp.address;
  return reg.test(arg);
};

/**
 * 验证邮箱账号
 * @param arg 邮箱账号
 */
export const validEmail = (arg) => {
  const reg = regExp.email;
  return reg.test(arg);
};

/**
 * 验证身份证号码
 * @param arg 身份证号码
 */
export const validID = (arg) => {
  const reg = regExp.idCard;
  return reg.test(arg);
};
