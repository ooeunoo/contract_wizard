import os from "os";
import * as constants from "./constants";

export function deduplicateSolidityVersoins(content: any) {
  return deduplicateLines(content, [constants._SOL_VERSION_PREFIX]);
}

export function deduplicateSolidityExpHeaders(content: any) {
  return deduplicateLines(content, [constants._SOL_EXP_HEADER_PREFIX]);
}

export function deduplicateLicenses(content: any) {
  return deduplicateLines(content, [
    constants._LICENSE_PREFIX_1,
    constants._LICENSE_PREFIX_2,
  ]);
}

export function deduplicateLines(content: any, linePrefixes: any) {
  const isTargetLine = (line: any) => {
    const lineTrimed = line.trim();
    for (const linePrefix of linePrefixes) {
      if (lineTrimed.indexOf(linePrefix) >= 0) {
        return true;
      }
    }
    return false;
  };

  const cleanTargetLine = (line: any) => {
    for (const linePrefix of linePrefixes) {
      const idx = line.indexOf(linePrefix);
      if (idx >= 0) {
        return line.substr(0, idx);
      }
    }
    return line;
  };

  const lines = content.split(os.EOL);
  let isFirst = true;
  let newContent = "";
  for (const line of lines) {
    if (isTargetLine(line)) {
      if (isFirst) {
        newContent += line + os.EOL;
        isFirst = false;
      } else {
        newContent += cleanTargetLine(line) + os.EOL;
      }
    } else {
      newContent += line + os.EOL;
    }
  }

  return newContent;
}
