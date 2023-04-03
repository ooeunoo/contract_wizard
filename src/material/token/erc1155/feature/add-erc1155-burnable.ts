import type { ContractBuilder } from "../../../../utils/contract";
import { ERC1155_BURNABLE } from "../../../path/erc1155-path";

export function addERC1155Burnable(c: ContractBuilder) {
  c.addParent(ERC1155_BURNABLE);
}
