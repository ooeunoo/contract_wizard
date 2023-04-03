import type { ContractBuilder } from "../../../../utils/contract";
import { defineFunctions } from "../../../../utils/define-functions";
import {
  Access,
  requireAccessControl,
} from "../../../common/access/set-access-control";
import { ERC1155_URI_STORAGABLE } from "../../../path/erc1155-path";

export function addERC1155URIStoragable(c: ContractBuilder, access: Access) {
  c.addParent(ERC1155_URI_STORAGABLE);

  c.addOverride(ERC1155_URI_STORAGABLE.name, functions.uri);

  requireAccessControl(c, functions.setBaseURI, access, "URI_SETTER");
  c.addFunctionCode("_setBaseURI(baseURI);", functions.setBaseURI);
}

const functions = defineFunctions({
  uri: {
    kind: "public" as const,
    args: [{ name: "tokenId", type: "uint256" }],
    returns: ["string memory"],
    mutability: "view" as const,
  },
  setBaseURI: {
    kind: "public" as const,
    args: [{ name: "baseURI", type: "string memory" }],
  },
});
