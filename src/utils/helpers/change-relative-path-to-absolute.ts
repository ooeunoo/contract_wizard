import fs from "fs";
import path from "path";
import * as constants from "./constants";
import { cleanPath } from "./clean-path";

/*
 * Replaces relative paths to absolute path for imports
 */
export const changeRelativePathToAbsolute = (filePath: any) => {
  const dir = path.dirname(filePath);
  const fileContent = fs.readFileSync(filePath, constants._UTF8);
  return new Promise(async (resolve) => {
    let fileContentNew: any = fileContent;
    const findAllImportPaths = require("./find-all-import-paths");
    const importObjs = await findAllImportPaths(dir, fileContent);
    if (!importObjs || importObjs.length == 0) {
      resolve(fileContentNew);
    }
    importObjs.forEach((importObj: any) => {
      const { dependencyPath, fullImportStatement } = importObj;
      const isAbsolutePath = !dependencyPath.startsWith(constants._DOT);
      if (!isAbsolutePath) {
        let dependencyPathNew = dir + constants._SLASH + dependencyPath;
        dependencyPathNew = cleanPath(dependencyPathNew);
        let fullImportStatementNew = fullImportStatement
          .split(dependencyPath)
          .join(dependencyPathNew);
        fileContentNew = fileContentNew
          .toString()
          .split(fullImportStatement)
          .join(fullImportStatementNew);
      }
    });

    resolve(fileContentNew);
  });
};
