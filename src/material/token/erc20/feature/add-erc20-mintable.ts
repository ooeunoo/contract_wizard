import type { ContractBuilder } from "../../../../utils/contract";
import { defineFunctions } from "../../../../utils/define-functions";
import {
  Access,
  requireAccessControl,
} from "../../../common/access/set-access-control";
import { ERC20_CAPPABLE } from "../../../path/erc20-path";

export const pattern = /^(\d*)(?:\.(\d+))?(?:e(\d+))?$/;

export function addERC20Mintable(
  c: ContractBuilder,
  access: Access,
  cappable?: { select: boolean; value: string }
) {
  requireAccessControl(c, functions.mint, access, "MINTER");
  c.addFunctionCode("_mint(to, amount);", functions.mint);

  if (cappable?.select) {
    const amount = cappable?.value;
    const m = amount.match(pattern);
    if (m) {
      const integer = m[1]?.replace(/^0+/, "") ?? "";
      const decimals = m[2]?.replace(/0+$/, "") ?? "";
      const exponent = Number(m[3] ?? 0);

      if (Number(integer + decimals) > 0) {
        const decimalPlace = decimals.length - exponent;
        const zeroes = new Array(Math.max(0, -decimalPlace)).fill("0").join("");
        const units = integer + decimals + zeroes;
        const exp =
          decimalPlace <= 0 ? "decimals()" : `(decimals() - ${decimalPlace})`;

        c.addParent(ERC20_CAPPABLE);

        c.addConstructorCode(`_setCap(${units} * 10 ** ${exp});`);

        c.addOverride(ERC20_CAPPABLE.name, functions._mint);
      }
    }
  }
}

const functions = defineFunctions({
  mint: {
    kind: "public" as const,
    args: [
      { name: "to", type: "address" },
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
