import type { CommonOptions } from "../utils/common-options";
import {
  printERC20,
  defaults as erc20defaults,
  isAccessControlRequired as erc20IsAccessControlRequired,
  ERC20Options,
  ERC20OptionDescription,
} from "../material/token/erc20/erc20";
import {
  printERC721,
  defaults as erc721defaults,
  isAccessControlRequired as erc721IsAccessControlRequired,
  ERC721Options,
  ERC721OptionDescription,
} from "../material/token/erc721/erc721";
import {
  printERC1155,
  defaults as erc1155defaults,
  isAccessControlRequired as erc1155IsAccessControlRequired,
  ERC1155Options,
  ERC1155OptionDescription,
} from "../material/token/erc1155/erc1155";

export interface WizardContractAPI<Options extends CommonOptions> {
  print: (opts?: Options) => string;
  defaults: Required<Options>;
  isAccessControlRequired: (opts: Partial<Options>) => boolean;
  optionDescription: any;
}

export type ERC20 = WizardContractAPI<ERC20Options>;
export type ERC721 = WizardContractAPI<ERC721Options>;
export type ERC1155 = WizardContractAPI<ERC1155Options>;

export const erc20: ERC20 = {
  print: printERC20,
  defaults: erc20defaults,
  isAccessControlRequired: erc20IsAccessControlRequired,
  optionDescription: ERC20OptionDescription,
};
export const erc721: ERC721 = {
  print: printERC721,
  defaults: erc721defaults,
  isAccessControlRequired: erc721IsAccessControlRequired,
  optionDescription: ERC721OptionDescription,
};
export const erc1155: ERC1155 = {
  print: printERC1155,
  defaults: erc1155defaults,
  isAccessControlRequired: erc1155IsAccessControlRequired,
  optionDescription: ERC1155OptionDescription,
};
