/*
 * @Author: lixiuhai
 * @Date: 2023-06-23 10:03:22
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-24 11:04:19
 */

import { LoginType, LoginUserInfoType } from "@/api/user";

import Cookies from "js-cookie";
import { toParse } from "@/utils/common";

const COOKIE_KEY = "Token";
const LOGIN_INFO = "Login_Info";
const KKVIEW_URL = "kkView_url";

/** ==================================  存储Cookie  ================================== */
/**
 * 获取Cookie
 */
export const getCookie = () => {
  return Cookies.get(COOKIE_KEY) || "";
};

/**
 * 设置Cookie
 * @param cookie cookie
 */
export const setCookie = (cookie: string) => {
  Cookies.set(COOKIE_KEY, cookie);
};

/**
 * 移除Cookie
 */
export const removeCookie = () => {
  Cookies.remove(COOKIE_KEY);
};

/** ==================================  存储用户信息  ================================== */
/**
 * 获取用户信息(包含权限列表)
 */
export const getLoginInfo = (): LoginUserInfoType => {
  return JSON.parse(localStorage.getItem(LOGIN_INFO) || "{}");
};

/**
 * 设置用户信息
 * @param userInfo 用户信息
 */
export const setLoginInfo = (userInfo: LoginUserInfoType) => {
  localStorage.setItem(LOGIN_INFO, JSON.stringify(userInfo));
};

/**
 * 移除用户信息
 */
export const removeLoginInfo = () => {
  localStorage.removeItem(LOGIN_INFO);
};

/**
 * 设置kkview预览url地址
 * @param kkViewUrl url地址
 */
export const setKKViewUrl = (kkViewUrl: string) => {
  localStorage.setItem(KKVIEW_URL, kkViewUrl);
};

/**
 * 获取kkview预览url地址
 */
export const getKKViewUrl = (): string => {
  return localStorage.getItem(KKVIEW_URL) as string;
};

/** ==================================  存储悬浮按钮位置  ================================== */
export interface PositionType {
  top: number;
  left: number;
}
/**
 * 获取悬浮按钮位置
 * @param key 存储Key
 */
export const getSuspendPosition = (key: string): PositionType => {
  return JSON.parse(localStorage.getItem(key) || "{}");
};

/**
 * 设置悬浮按钮位置
 * @param key 存储Key
 * @param position 用户信息
 */
export const setSuspendPosition = (key, position: PositionType) => {
  localStorage.setItem(key, JSON.stringify(position));
};

/** ==================================  存储跳转回签登录  ================================== */
const SignBackKey = "Sign_Back";
/** 获取登录状态 */
export const getSignBack = (): LoginType => {
  return JSON.parse(localStorage.getItem(SignBackKey) || "{}");
};

/** 设置登录状态 */
export const setSignBack = (data: LoginType) => {
  localStorage.setItem(SignBackKey, JSON.stringify(data));
};

/** ==================================  存储企业微信登录code(消息卡片进入)  ================================== */
const WeChatCode = "WeChat_Code";
/** 获取企业微信登录code */
export const getWeChatCode = (): { code: string; state: string } => {
  return toParse(localStorage.getItem(WeChatCode));
};

/** 设置企业微信登录code */
export const setWeChatCode = (data: { code: string; state: string }) => {
  localStorage.setItem(WeChatCode, JSON.stringify(data));
};
