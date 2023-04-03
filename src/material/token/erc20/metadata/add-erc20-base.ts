import { supportsInterface } from "../../../../utils/common-functions";
import type { ContractBuilder } from "../../../../utils/contract";
import { defineFunctions } from "../../../../utils/define-functions";
import { ERC20_DEFAULT } from "../../../path/erc20-path";

export function addERC20Base(c: ContractBuilder, name: string, symbol: string) {
  c.addParent(ERC20_DEFAULT, [name, symbol]);

  c.addOverride(ERC20_DEFAULT.name, functions._beforeTokenTransfer);
  c.addOverride(ERC20_DEFAULT.name, functions._afterTokenTransfer);
  c.addOverride(ERC20_DEFAULT.name, functions._mint);
  c.addOverride(ERC20_DEFAULT.name, functions._burn);
  c.addOverride(ERC20_DEFAULT.name, functions.balanceOf);
  c.addOverride(ERC20_DEFAULT.name, supportsInterface);
}

const functions = defineFunctions({
  _beforeTokenTransfer: {
    kind: "internal" as const,
    args: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
  },
  _afterTokenTransfer: {
    kind: "internal" as const,
    args: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
  },
  balanceOf: {
    kind: "public" as const,
    mutability: "view",
    args: [{ name: "account", type: "address" }],
    returns: ["uint256"],
  },
  _burn: {
    kind: "internal" as const,
    args: [
      { name: "account", type: "address" },
      { name: "amount", type: "uint256" },
    ],
  },

  _mint: {
    kind: "internal" as const,
    args: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
  },
});
