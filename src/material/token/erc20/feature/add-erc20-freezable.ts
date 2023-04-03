import { supportsInterface } from "../../../../utils/common-functions";
import type { ContractBuilder } from "../../../../utils/contract";
import { defineFunctions } from "../../../../utils/define-functions";
import {
  Access,
  requireAccessControl,
} from "../../../common/access/set-access-control";
import { ERC20_FREEZABLE } from "../../../path/erc20-path";

export function addERC20Freezable(c: ContractBuilder, access: Access) {
  c.addParent(ERC20_FREEZABLE);

  c.addOverride(ERC20_FREEZABLE.name, functions._beforeTokenTransfer);

  requireAccessControl(c, functions.freeze, access, "FREEZER");
  c.addFunctionCode("_freeze(account);", functions.freeze);

  requireAccessControl(c, functions.unfreeze, access, "FREEZER");
  c.addFunctionCode("_unfreeze(account);", functions.unfreeze);
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
  freeze: {
    kind: "public" as const,
    args: [{ name: "account", type: "address" }],
  },

  unfreeze: {
    kind: "public" as const,
    args: [{ name: "account", type: "address" }],
  },
});
