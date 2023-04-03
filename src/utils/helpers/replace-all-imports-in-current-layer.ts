import fs from "fs";
import path from "path";
import * as variables from "./variables";
import * as constants from "./constants";
import * as findFile from "./find-file";
import { updateImportObjectLocationInTarget } from "./update-import-object-location-in-target";
import { changeRelativePathToAbsolute } from "./change-relative-path-to-absolute";
import { cleanPath } from "./clean-path";
import { log } from "./logger";
import { existsFile } from "./file";

export async function replaceAllImportsInCurrentLayer(
  i: any,
  importObjs: any,
  updatedFileContent: any,
  dir: any
) {
  return new Promise(async (resolve) => {
    await replaceAllImportsInCurrentLayerInner(
      i,
      importObjs,
      updatedFileContent,
      dir,
      resolve
    );
  });
}

export async function replaceAllImportsInCurrentLayerInner(
  i: number,
  importObjs: string | any[],
  updatedFileContent: string,
  dir: string,
  resolve: { (value: unknown): void; (arg0: any): any }
) {
  if (i >= importObjs.length) {
    return resolve(updatedFileContent);
  }

  let importObj = importObjs[i];
  const { importedSrcFiles }: any = variables;
  let _updatedFileContent: any;

  //replace contracts aliases
  if (importObj.contractName) {
    _updatedFileContent = updatedFileContent.replace(
      importObj.alias + constants._DOT,
      importObj.contractName + constants._DOT
    );
  } else {
    _updatedFileContent = updatedFileContent;
  }

  let { dependencyPath } = importObj;
  dependencyPath = cleanPath(dependencyPath);
  let isAbsolutePath = !dependencyPath.startsWith(constants._DOT);
  let filePath = isAbsolutePath ? dependencyPath : dir + dependencyPath;
  filePath = cleanPath(filePath);

  importObj = updateImportObjectLocationInTarget(
    importObj,
    _updatedFileContent
  );
  const importStatement = _updatedFileContent.substring(
    importObj.startIndex,
    importObj.endIndex
  );
  const fileBaseName = path.basename(filePath);
  const fileExists = existsFile(filePath);
  if (fileExists) {
    log.info(`${filePath} SOURCE FILE WAS FOUND`);
    const importedFileContentUpdated: any = await changeRelativePathToAbsolute(
      filePath
    );
    if (!importedSrcFiles.hasOwnProperty(fileBaseName)) {
      importedSrcFiles[fileBaseName] = importedFileContentUpdated;
      if (importedFileContentUpdated.includes(constants._IS)) {
        _updatedFileContent = _updatedFileContent.replace(
          importStatement,
          importedFileContentUpdated
        );
      } else {
        _updatedFileContent =
          importedFileContentUpdated +
          _updatedFileContent.replace(importStatement, constants._EMPTY);
      }
    } else {
      _updatedFileContent = _updatedFileContent.replace(
        importStatement,
        constants._EMPTY
      );
      //issue #1.
      if (
        _updatedFileContent.includes(importedSrcFiles[fileBaseName]) &&
        _updatedFileContent.includes(constants._IMPORT)
      ) {
        _updatedFileContent =
          importedFileContentUpdated +
          _updatedFileContent.replace(
            importedSrcFiles[fileBaseName],
            constants._EMPTY
          );
      }
    }
  } else {
    if (!importedSrcFiles.hasOwnProperty(fileBaseName)) {
      log.warn(
        `!!! ${filePath} SOURCE FILE WAS NOT FOUND. I'M TRYING TO FIND IT RECURSIVELY !!!`
      );
      const directorySeperator =
        process.platform === "win32" ? "\\" : constants._SLASH;
      const dirNew = dir.substring(0, dir.lastIndexOf(directorySeperator));
      _updatedFileContent = await findFile.byNameAndReplace(
        dirNew,
        dependencyPath,
        _updatedFileContent,
        importStatement
      );
      log.info(`${filePath} SOURCE FILE WAS FOUND`);
    } else {
      _updatedFileContent = _updatedFileContent.replace(
        importStatement,
        constants._EMPTY
      );
    }
  }

  i++;
  replaceAllImportsInCurrentLayerInner(
    i,
    importObjs,
    _updatedFileContent,
    dir,
    resolve
  );
}
