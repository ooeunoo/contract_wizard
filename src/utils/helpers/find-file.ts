import fs from "fs";
import glob from "glob-promise";
import path from "path";
import * as variables from "./variables";
import * as constants from "./constants";
import { changeRelativePathToAbsolute } from "./change-relative-path-to-absolute";

export function byName(dir: any, fileName: any) {
  return new Promise((resolve) => {
    return byNameInner(dir, fileName, resolve);
  });
}

export async function byNameInner(dir: any, fileName: any, resolve: any) {
  const srcFiles = await glob(dir + constants._SOL);
  for (let j = 0; j < srcFiles.length; j++) {
    if (path.basename(srcFiles[j]) == fileName) {
      let fileContent = fs.readFileSync(srcFiles[j], constants._UTF8);
      resolve(fileContent);
      break;
    }
  }

  dir = dir.substring(0, dir.lastIndexOf(constants._SLASH));
  byNameInner(dir, fileName, resolve);
}

export async function byNameAndReplace(
  dir: any,
  dependencyPath: any,
  updatedFileContent: any,
  importStatement: any
) {
  return new Promise((resolve, reject) => {
    return byNameAndReplaceInner(
      dir,
      dependencyPath,
      updatedFileContent,
      importStatement,
      resolve,
      reject
    );
  });
}

export async function byNameAndReplaceInner(
  dir: any,
  dependencyPath: any,
  updatedFileContent: any,
  importStatement: any,
  resolve: any,
  reject: any
) {
  const srcFiles = await glob(dir + constants._SOL);
  let result = await byNameAndReplaceInnerRecursively(
    importStatement,
    updatedFileContent,
    dir,
    dependencyPath,
    srcFiles,
    0
  );
  let { flattenFileContent, importIsReplacedBefore }: any = result;
  if (importIsReplacedBefore) {
    flattenFileContent = flattenFileContent.replace(
      importStatement,
      constants._EMPTY
    );
    return resolve(flattenFileContent);
  } else {
    if (dir.includes(constants._SLASH)) {
      dir = dir.substring(0, dir.lastIndexOf(constants._SLASH));
      byNameAndReplaceInner(
        dir,
        dependencyPath,
        flattenFileContent,
        importStatement,
        resolve,
        reject
      );
    } else {
      flattenFileContent = flattenFileContent.replace(
        importStatement,
        constants._EMPTY
      );
      return resolve(flattenFileContent);
    }
  }
}

export async function byNameAndReplaceInnerRecursively(
  importStatement: any,
  updatedFileContent: any,
  dir: any,
  dependencyPath: any,
  srcFiles: any,
  j: any
) {
  return new Promise((resolve, reject) => {
    byNameAndReplaceInnerRecursivelyInner(
      importStatement,
      updatedFileContent,
      dir,
      dependencyPath,
      srcFiles,
      j,
      resolve,
      reject,
      true
    );
  });
}

export async function byNameAndReplaceInnerRecursivelyInner(
  importStatement: any,
  updatedFileContent: any,
  dir: any,
  dependencyPath: any,
  srcFiles: any,
  j: any,
  resolve: any,
  reject: any,
  importIsReplacedBefore: any
) {
  if (j >= srcFiles.length)
    return resolve({
      flattenFileContent: updatedFileContent,
      importIsReplacedBefore,
    });

  let isAbsolutePath = !dependencyPath.startsWith(constants._DOT);
  const filePath = srcFiles[j];
  const { importedSrcFiles }: any = variables;
  if (isAbsolutePath && filePath.includes(dependencyPath)) {
    let flattenFileContent = constants._EMPTY;
    if (
      !importedSrcFiles.hasOwnProperty(path.basename(filePath)) ||
      fs.existsSync(dependencyPath)
    ) {
      let importFileContent: any;
      if (fs.existsSync(dependencyPath)) {
        importFileContent = await changeRelativePathToAbsolute(dependencyPath);
      } else {
        importFileContent = await changeRelativePathToAbsolute(filePath);
      }

      if (importFileContent.includes(constants._IS)) {
        flattenFileContent = updatedFileContent.replace(
          importStatement,
          importFileContent
        );
      } else {
        flattenFileContent =
          importFileContent +
          updatedFileContent.replace(importStatement, constants._EMPTY);
      }
      importedSrcFiles[path.basename(filePath)] = importFileContent;
      resolve({ flattenFileContent, importIsReplacedBefore: true });
    } else {
      flattenFileContent = updatedFileContent.replace(
        importStatement,
        constants._EMPTY
      );
      //issue #2.
      const fileName = importedSrcFiles[path.basename(dir + dependencyPath)];
      if (
        flattenFileContent.includes(fileName) &&
        flattenFileContent.includes(constants._IMPORT)
      ) {
        let importFileContent = fs.readFileSync(filePath, constants._UTF8);
        flattenFileContent =
          importFileContent +
          flattenFileContent.replace(fileName, constants._EMPTY);
      }
      importIsReplacedBefore = true;
      j++;
      byNameAndReplaceInnerRecursivelyInner(
        importStatement,
        flattenFileContent,
        dir,
        dependencyPath,
        srcFiles,
        j,
        resolve,
        reject,
        importIsReplacedBefore
      );
    }
  } else {
    j++;
    byNameAndReplaceInnerRecursivelyInner(
      importStatement,
      updatedFileContent,
      dir,
      dependencyPath,
      srcFiles,
      j,
      resolve,
      reject,
      importIsReplacedBefore
    );
  }
}
