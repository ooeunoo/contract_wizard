import {
  CommonOptions,
  defaults as commonDefaults,
  withCommonDefaults,
} from "../../../utils/common-options";
import { Contract, ContractBuilder } from "../../../utils/contract";
import { printContract } from "../../../utils/print";
import { setAccessControl } from "../../common/access/set-access-control";
import { setInformation } from "../../common/information/set-info";
import { addERC1155Burnable } from "./feature/add-erc1155-burnable";
import { addERC1155Pausable } from "./feature/add-erc1155-pausable";
import { addERC1155Base } from "./metadata/add-erc1155-base";
import { addERC1155Freezable } from "./feature/add-erc1155-freezable";
import { addERC1155URIStoragable } from "./feature/add-erc1155-uriStoragable";
import {
  Access,
  ERC1155TypeFeatureType,
  setAccess,
  setFeatures,
} from "../../common/feature/set-features";

export interface ERC1155Options extends CommonOptions {
  metadata: {
    name: string;
    symbol: string;
    baseURI: string;
  };
  features: {
    burnable?: boolean;
    freezable?: boolean;
    pausable?: boolean;
    // uriStoragable?: boolean;
  };
}

export const ERC1155OptionDescription = {
  metadata: {
    name: "Name of token",
    symbol: "Symbol of token",
    baseURI: "BaseURI of token",
  },
  features: {
    burnable: "burnable description",
    freezable: "freezable description",
    pausable: "pausable description",
  },
};

export const defaults: Required<ERC1155Options> = {
  metadata: {
    name: "MyToken",
    symbol: "MTK",
    baseURI: "",
  },
  features: {
    burnable: false,
    pausable: false,
    freezable: false,
    // uriStoragable: false,
  },
  access: "ownable",
  info: commonDefaults.info,
} as const;

function withDefaults(opts: ERC1155Options): Required<ERC1155Options> {
  return {
    metadata: {
      name: opts.metadata.name ?? defaults.metadata.name,
      symbol: opts.metadata.symbol ?? defaults.metadata.symbol,
      baseURI: opts.metadata.baseURI ?? defaults.metadata.baseURI,
    },
    features: {
      burnable: opts.features.burnable ?? defaults.features.burnable,
      freezable: opts.features.freezable ?? defaults.features.freezable,
      pausable: opts.features.pausable ?? defaults.features.pausable,
      // uriStoragable:
      //   opts.features.uriStoragable ?? defaults.features.uriStoragable,
    },
    ...withCommonDefaults(opts),
  };
}

export function printERC1155(opts: ERC1155Options = defaults): string {
  return printContract(buildERC1155(opts));
}

export function isAccessControlRequired(
  opts: Partial<ERC1155Options>
): boolean {
  return (opts.features?.freezable || opts.features?.pausable) as boolean; // opts.features?.uriStoragable
}

export function buildERC1155(opts: ERC1155Options): Contract {
  const allOpts = withDefaults(opts);

  const c = new ContractBuilder(allOpts.metadata.name);

  const { access, info } = allOpts;
  const features = [];

  addERC1155Base(
    c,
    allOpts.metadata.name,
    allOpts.metadata.symbol,
    allOpts.metadata.baseURI,
    access
  );

  if (allOpts.features.burnable) {
    features.push([ERC1155TypeFeatureType.BURNABLE]);
    addERC1155Burnable(c);
  }

  if (allOpts.features.freezable) {
    features.push([ERC1155TypeFeatureType.FREEZABLE]);
    addERC1155Freezable(c, access);
  }

  if (allOpts.features.pausable) {
    features.push([ERC1155TypeFeatureType.PAUSABLE]);
    addERC1155Pausable(c, access);
  }

  // if (allOpts.features.uriStoragable) {
  //   addERC1155URIStoragable(c, access);
  // }

  setAccessControl(c, access);
  setInformation(c, info);

  // setFeatures(c, features);
  setAccess(
    c,
    !access ? Access.NONE : access == "ownable" ? Access.OWNABLE : Access.ROLES
  );
  return c;
}
