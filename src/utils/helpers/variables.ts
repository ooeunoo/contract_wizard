import path from "path";
import fs from "fs";
import * as constants from "./constants";
import { existsFile } from "./file";

const configPath = "./config.json";
export const configExists = existsFile(configPath);

let config;
if (configExists) {
  config = JSON.parse(fs.readFileSync(configPath, constants._UTF8));
}

//Input solidity file path
export const args = process.argv.slice(2);
export const inputFilePath =
  args.length > 0 ? args[0] : config ? config.inputFilePath : constants._EMPTY;

//Input solidity file dir name
export const inputFileDir = path.dirname(inputFilePath);

//Input parent dir
export const parentDir = inputFileDir;

//Output directory to store flat combined solidity file
export const outDir =
  args.length > 1 ? args[1] : config ? config.outputDir : "./out";
export const flatContractPrefix =
  args.length > 2 ? args[2] : path.basename(inputFilePath, ".sol");

export const allSrcFiles: any = [];
export const importedSrcFiles = {};
