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
  }
] as MockMethod[];
