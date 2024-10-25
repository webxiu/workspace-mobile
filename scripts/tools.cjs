/*
 * @Author: lixiuhai
 * @Date: 2023-06-23 10:06:13
 * @Last Modified by:   lixiuhai
 * @Last Modified time: 2023-06-23 10:06:13
 */
const fs = require("fs");
const path = require("path");

/** 读文件 */
function readFile(path) {
  const data = fs.readFileSync(path);
  const html = data.toString();
  return html;
}

/** 写文件 */
function writeFile(path, data) {
  fs.writeFileSync(path, data, { encoding: "utf-8" });
}

/** 同步递归创建文件夹, 返回文件夹目录 */
function mkdirSync(dirName) {
  if (!dirName) throw new Error("目录不合法");
  if (fs.existsSync(dirName)) {
    return dirName;
  } else {
    if (mkdirSync(path.dirname(dirName))) {
      fs.mkdirSync(dirName);
      return dirName;
    }
  }
}

function getJsonFiles(jsonPath) {
  let jsonFiles = [];
  function findJsonFile(dir) {
    let files = fs.readdirSync(dir);
    files.forEach(function (item, index) {
      let fPath = path.join(dir, item);
      let stat = fs.statSync(fPath);
      if (stat.isDirectory() === true) {
        // console.log('======目录:', dirName, fPath)
        findJsonFile(fPath);
      }
      if (stat.isFile() === true) {
        // console.log('文件:', fPath)
        jsonFiles.push(fPath);
      }
    });
  }
  findJsonFile(jsonPath);
  return jsonFiles;
}

/** 按文件夹分类, 返回路径各组文件路径(只分类一层文件夹), 过滤了第一层文件, 只扫描下面的目录
 * option:
 *  rootPath 跟路径
 *  excludeDir: 排除目录
 *  includeDir: 包含目录
 *  includeFile: 包含文件
 */
const getDirPaths = (option) => {
  const { rootPath, excludeDir, includeDir, includeFile } = option;
  const dirFileObj = {};
  const findJsonFile = (dir) => {
    const files = fs.readdirSync(dir);
    files.forEach((name) => {
      const fPath = path.join(dir, name);
      const stat = fs.statSync(fPath);
      const keys = Object.keys(dirFileObj);
      if (stat.isDirectory()) {
        // if (!excludeDir.includes(name) && includeDir.includes(name)) {
        if (includeDir.includes(name)) {
          // 判断是否为当前目录的子目录
          const hasChildDir = keys.some((dir) =>
            fPath.split("/").includes(dir)
          );
          if (hasChildDir) {
            findJsonFile(fPath);
          } else {
            dirFileObj[name] = [];
            findJsonFile(fPath);
          }
        }
      } else if (stat.isFile()) {
        // 过滤文件后缀不符合的
        const exts = name.split(".");
        const ext = exts[exts.length - 1];
        if (!includeFile.includes(`.${ext}`)) {
          return;
        }
        // 遍历所有key(目录分类)数组, 添加到对应的数组中
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const dirPath = path.parse(path.dirname(fPath));
          if (fPath.split("/").includes(key)) {
            // 路径下子目录
            dirFileObj[key].push(fPath);
          } else if (dirPath.name === key) {
            // 路径下的文件
            dirFileObj[key].push(fPath);
            break;
          }
        }
      }
    });
  };
  findJsonFile(rootPath);
  return dirFileObj;
};

module.exports = {
  readFile,
  writeFile,
  getJsonFiles,
  getDirPaths,
};
