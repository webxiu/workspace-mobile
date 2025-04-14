// 根据角色动态生成路由

import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/verifyuser",
    method: "post",
    response: ({ body }) => {
      return {
        status: 200,
        message: "操作成功",
        data: "",
        timestamp: 1730108519235
      };
    }
  },
  {
    url: "/getloginpagemessage",
    method: "get",
    response: ({ body }) => {
      return {
        status: 200,
        message: "操作成功",
        data: {
          redirect: "https://dlpctest.deogra.com/api/app/qywx/api/login",
          clientPathMac: "/static/public/DeograWorkspace-1.0.0-arm64-mac.zip",
          agentid: "1000036",
          orgName: "深圳市XX科技公司",
          appid: "wwa8df5d5593162528",
          esopPath: "/static/virtual/file/ftpfile/sys/application/apk/esop_install_v1.0.11.apk",
          orgShortName: "XX科技",
          clientPathWin: "/static/public/DeograWorkspace_Setup_1.0.0.exe",
          clientPathWin32: "/static/public/DeograWorkspace_Setup_32_1.0.0.exe",
          version: "2025.0.122-SNAPSHOT",
          logoUrl: "/static/virtual/file/ftpfile/managercenter/file/5577FEE5AB4B4B6B9320D30E4206A4D6.png"
        },
        timestamp: 1744597004401
      };
    }
  },
  {
    url: "/sys/system/getPreviewDomain",
    method: "get",
    response: ({ body }) => {
      return {
        status: 200,
        message: "操作成功",
        data: "https://dlpctest.deogra.com/",
        timestamp: 1744597005440
      };
    }
  }
] as MockMethod[];
