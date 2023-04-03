import type { Access } from "../material/common/access/set-access-control";
import {
  defaults as infoDefaults,
  Info,
} from "../material/common/information/set-info";

export const defaults: Required<CommonOptions> = {
  access: false,
  info: infoDefaults,
} as const;

export interface CommonOptions {
  access?: Access;
  info?: Info;
}

export function withCommonDefaults(
  opts: CommonOptions
): Required<CommonOptions> {
  return {
    access: opts.access ?? false,
    info: opts.info ?? {},
  };
}
