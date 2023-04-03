import { findAllImportPaths } from "./find-all-import-paths";
import { replaceAllImportsInCurrentLayer } from "./replace-all-imports-in-current-layer";

/*
 * Recursively replaces all imports
 */
export async function replaceAllImportsRecursively(fileContent: any, dir: any) {
  return new Promise(async (resolve) => {
    await replaceAllImportsRecursivelyInner(fileContent, dir, resolve);
  });
}

export async function replaceAllImportsRecursivelyInner(
  fileContent: any,
  dir: any,
  resolve: any
) {
  const importObjs: any = await findAllImportPaths(dir, fileContent);
  if (!importObjs || importObjs.length == 0) {
    return resolve(fileContent);
  }

  const updatedFileContent = await replaceAllImportsInCurrentLayer(
    0,
    importObjs,
    fileContent,
    dir
  );
  replaceAllImportsRecursivelyInner(updatedFileContent, dir, resolve);
}
