import { supportsInterface } from "../../../../utils/common-functions";
import type { ContractBuilder } from "../../../../utils/contract";
import { ERC20_BURNABLE } from "../../../path/erc20-path";

export function addERC20Burnable(c: ContractBuilder) {
  c.addParent(ERC20_BURNABLE);
}
