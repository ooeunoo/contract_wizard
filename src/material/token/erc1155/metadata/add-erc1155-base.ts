import { supportsInterface } from "../../../../utils/common-functions";
import type { ContractBuilder } from "../../../../utils/contract";
import { defineFunctions } from "../../../../utils/define-functions";
import {
  Access,
  requireAccessControl,
} from "../../../common/access/set-access-control";
import {
  ERC1155_DEFAULT,
  ERC1155_SUPPLY_TRACKABLE,
} from "../../../path/erc1155-path";

export function addERC1155Base(
  c: ContractBuilder,
  name: string,
  symbol: string,
  uri: string,
  access: Access
) {
  c.addParent(ERC1155_DEFAULT, [name, symbol, uri]);

  c.addOverride(ERC1155_DEFAULT.name, functions._beforeTokenTransfer);
  c.addOverride(ERC1155_DEFAULT.name, supportsInterface);

  // Mintable
  const fn = getMintFunction();
  requireAccessControl(c, fn, access, "MINTER");
  c.addFunctionCode("_mint(account, id, amount);", fn);

  const fn2 = getMintBatchFunction();
  requireAccessControl(c, fn2, access, "MINTER");
  c.addFunctionCode("_mintBatch(to, ids, amounts);", fn2);

  const fn3 = getMintFunctionWithData();
  requireAccessControl(c, fn3, access, "MINTER");
  c.addFunctionCode("_mint(account, id, amount, data);", fn3);

  const fn4 = getMintBatchFunctionWithData();
  requireAccessControl(c, fn4, access, "MINTER");
  c.addFunctionCode("_mintBatch(to, ids, amounts, data);", fn4);

  // SupplyTrackable
  c.addParent(ERC1155_SUPPLY_TRACKABLE);
  c.addOverride(ERC1155_SUPPLY_TRACKABLE.name, functions._beforeTokenTransfer);
}

const functions = defineFunctions({
  _beforeTokenTransfer: {
    kind: "internal" as const,
    args: [
      { name: "operator", type: "address" },
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "ids", type: "uint256[] memory" },
      { name: "amounts", type: "uint256[] memory" },
      { name: "data", type: "bytes memory" },
    ],
  },
});

function getMintFunction() {
  const fn = {
    name: "mint",
    kind: "public" as const,
    args: [
      { name: "account", type: "address" },
      { name: "id", type: "uint256" },
      { name: "amount", type: "uint256" },
    ],
  };

  return fn;
}

function getMintBatchFunction() {
  const fn = {
    name: "mintBatch",
    kind: "public" as const,
    args: [
      { name: "to", type: "address" },
      { name: "ids", type: "uint256[] memory" },
      { name: "amounts", type: "uint256[] memory" },
    ],
  };

  return fn;
}

function getMintFunctionWithData() {
  const fn = {
    name: "mint",
    kind: "public" as const,
    args: [
      { name: "account", type: "address" },
      { name: "id", type: "uint256" },
      { name: "amount", type: "uint256" },
      { name: "data", type: "bytes memory" },
    ],
  };

  return fn;
}
function getMintBatchFunctionWithData() {
  const fn = {
    name: "mintBatch",
    kind: "public" as const,
    args: [
      { name: "to", type: "address" },
      { name: "ids", type: "uint256[] memory" },
      { name: "amounts", type: "uint256[] memory" },
      { name: "data", type: "bytes memory" },
    ],
  };

  return fn;
}
