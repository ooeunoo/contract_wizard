import { buildERC20, ERC20Options } from "../material/token/erc20/erc20";
import { buildERC721, ERC721Options } from "../material/token/erc721/erc721";
import {
  buildERC1155,
  ERC1155Options,
} from "../material/token/erc1155/erc1155";

export enum Kinds {
  ERC20 = "ERC20",
  ERC721 = "ERC721",
  ERC1155 = "ERC1155",
}

export interface KindedOptions {
  ERC20: { kind: "ERC20" } & ERC20Options;
  ERC721: { kind: "ERC721" } & ERC721Options;
  ERC1155: { kind: "ERC1155" } & ERC1155Options;
}

export type GenericOptions = KindedOptions[keyof KindedOptions];

export type BuildKinds = {
  ERC20: "ERC20";
  ERC721: "ERC721";
  ERC1155: "ERC1155";
};

export function buildGeneric(opts: GenericOptions) {
  switch (opts.kind) {
    case "ERC20":
      return buildERC20(opts);

    case "ERC721":
      return buildERC721(opts);

    case "ERC1155":
      return buildERC1155(opts);

    default:
      const _: never = opts;
      throw new Error("Unknown ERC");
  }
}
