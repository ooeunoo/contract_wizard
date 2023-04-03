import { describe, test } from "@jest/globals";
import { erc1155, erc20, erc721 } from "../../../generate/api";

describe("ERC1155", () => {
  test("generate", () => {
    const token = erc1155;

    const opts = token.defaults;

    opts.access = false;
    // opts.features.burnable = true;
    // opts.features.pausable = true;
    // opts.features.freezable = true;
    // opts.features.batchTransferable = true;

    console.log(token.print());
  });
});
