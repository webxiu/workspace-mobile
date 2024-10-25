/*
 * @Author: lixiuhai
 * @Date: 2023-06-23 10:06:16
 * @Last Modified by:   lixiuhai
 * @Last Modified time: 2023-06-23 10:06:16
 */
/**
 * 将全家方法名称提取写入到 README.md 中
 */
const tools = require("./tools.cjs");
const path = require("path");

const inputPath = path.join(__dirname, "../", "src");
const outPath = path.join(__dirname, "../", "README.md");

// 提取utils中的工具方法
const links = tools.getDirPaths({
  rootPath: inputPath,
  includeDir: ["utils"],
  includeFile: [".ts"],
});

// console.log("inputPath", inputPath);
// console.log("outPath", outPath);
// console.log("links", links.utils);

// 分割readme中的默认内容和动态全局函数字符
const fileDirs = links.utils;
const splitChar = "<!-- 以下是脚本自动生成:请勿删除本注释 -->";
let outPathCont = tools.readFile(outPath).split(splitChar)[0];

let result = "";
fileDirs.forEach((dir, index) => {
  const content = tools.readFile(dir).toString();
  // 替换格式为-->{名称}
  const name = content
    .replace(/\/\*\*\r\n \* /g, "{ ")
    .replace(/\r\n \*/g, " }");
  const desc = new RegExp(/(?<=\{\B).*?(?=\B\})/gi);
  const fun = new RegExp(/(?<=export const\s).*?(?=\s\=)/gi);
  const funList = content.match(fun);
  const descList = name.match(desc)?.filter(Boolean);
  const dirPos = "src" + dir.split("src")[1];

  // 方法格式
  if (!funList?.length) {
    console.error(`Error提示: 在 ${dirPos} 文件中, 方法或注释不符合匹配规则`);
    return;
  }

  const firstStr = index === 0 ? "" : `\n\n`;
  result += firstStr;
  result += `- **${dirPos}**\n`;
  const methods = funList
    .map((item, idx) => `${item}: ${descList[idx]}`)
    .join("\n");
  result += "\n```bash\n";
  result += `# 方法名称  方法描述\n`;
  result += methods + "\n";
  result += "```";
});

outPathCont += `${splitChar}\n\n${result}`;
try {
  tools.writeFile(outPath, outPathCont);
} catch (error) {
  console.log("写入失败:", error);
}
