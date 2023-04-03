import type { ContractBuilder } from "../../../../utils/contract";
import { ERC721_BURNABLE } from "../../../path/erc721-path";

export function addERC721Burnable(c: ContractBuilder) {
  c.addParent(ERC721_BURNABLE);
}
