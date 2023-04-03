import fs from "fs";
import path from "path";
import decomment from "decomment";
import * as findFile from "./find-file";
import * as constants from "./constants";
import { existsFile } from "./file";

/*
 * Finds all import paths
 */
export function findAllImportPaths(dir: any, content: any) {
  return new Promise(async (resolve) => {
    content = decomment(content, { safe: true });
    let allImports = [];
    const regex = new RegExp(constants._IMPORT, "gi");
    const importsCount = (content.match(regex) || []).length;
    let importsIterator = 0;
    let result;
    while ((result = regex.exec(content))) {
      const startImport = result.index;
      const endImport =
        startImport +
        content.substr(startImport).indexOf(constants._SEMICOLON) +
        1;
      const fullImportStatement = content.substring(startImport, endImport);
      const fullImportParts = fullImportStatement.split('"');
      const fullImportPartsAlt = fullImportStatement.split("'");
      const dependencyPath =
        fullImportParts.length > 1 ? fullImportParts[1] : fullImportPartsAlt[1];
      const fullImportPartsByAs = fullImportStatement.split(constants._AS);
      let alias =
        fullImportPartsByAs.length > 1
          ? fullImportPartsByAs[1].split(constants._SEMICOLON)[0]
          : null;

      let importObj: any = {
        startIndex: startImport,
        endIndex: endImport,
        dependencyPath,
        fullImportStatement,
        alias,
      };

      if (alias) {
        alias = alias.replace(/\s/g, constants._EMPTY);
        let fileExists = existsFile(dependencyPath);

        let fileContent: any;
        if (fileExists) {
          fileContent = fs.readFileSync(dependencyPath, constants._UTF8);
        } else {
          dir = dir.substring(0, dir.lastIndexOf(constants._SLASH));
          fileContent = await findFile.byName(
            dir,
            path.basename(dependencyPath)
          );
        }
        if (fileContent.includes(constants._CONTRACT)) {
          importObj.contractName = getContractName(fileContent);
        }
      }

      importsIterator++;
      allImports.push(importObj);
    }
    if (importsIterator == importsCount) resolve(allImports);
  });
}

export function getContractName(fileContent: any) {
  return fileContent
    .substring(
      fileContent.indexOf(constants._CONTRACT) + constants._CONTRACT.length,
      fileContent.indexOf("{")
    )
    .replace(/\s/g, constants._EMPTY);
}
