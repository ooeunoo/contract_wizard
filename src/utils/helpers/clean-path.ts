import * as constants from "./constants";

export function cleanPath(path: any): any {
  let cleanedPath;
  if (path.includes(constants._DIRTY_PATH)) {
    cleanedPath = path.split(constants._DIRTY_PATH).join(constants._SLASH);
  } else {
    cleanedPath = path;
  }

  if (path.includes(constants._DIRTY_PATH_2)) {
    const pathPartBefore = path.substring(
      0,
      path.indexOf(constants._DIRTY_PATH_2)
    );
    const folderBack = pathPartBefore.split(constants._SLASH).slice(-1)[0];
    cleanedPath = path
      .split(folderBack + constants._DIRTY_PATH_2)
      .join(constants._EMPTY);
  }

  if (cleanedPath.includes(constants._DIRTY_PATH || constants._DIRTY_PATH_2)) {
    return cleanPath(cleanedPath);
  } else {
    return cleanedPath;
  }
}
