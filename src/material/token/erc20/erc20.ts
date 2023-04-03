import {
  CommonOptions,
  withCommonDefaults,
  defaults as commonDefaults,
} from "../../../utils/common-options";
import { Contract, ContractBuilder } from "../../../utils/contract";
import { printContract } from "../../../utils/print";
import { setAccessControl } from "../../common/access/set-access-control";
import { setInformation } from "../../common/information/set-info";
import { addERC20Burnable } from "./feature/add-erc20-burnable";
import { addERC20Mintable } from "./feature/add-erc20-mintable";
import { addERC20Pausable } from "./feature/add-erc20-pausable";
import { addERC20Base } from "./metadata/add-erc20-base";
import { addERC20Lockable } from "./feature/add-erc20-lockable";
import { addERC20Freezable } from "./feature/add-erc20-freezable";
import {
  Access,
  ERC20TypeFeatureType,
  setAccess,
  setFeatures,
} from "../../common/feature/set-features";
import { addERC20Premint } from "./metadata/add-erc20-pre-mint";

export interface ERC20Options extends CommonOptions {
  metadata: {
    name: string;
    symbol: string;
    premint?: string;
    premintAddress?: string;
  };
  features: {
    burnable?: boolean;
    freezable?: boolean;
    lockable?: boolean;
    pausable?: boolean;
    mintable?: boolean;
  };
}

export const ERC20OptionDescription = {
  metadata: {
    name: "Name of token",
    symbol: "Symbol of token",
    premint: "Create an initial amount of tokens.",
    premintAddress: "Receiver of   an initial amount of tokens.",
  },
  features: {
    burnable: "burnable description",
    freezable: "freezable description",
    lockable: "lockable description",
    pausable: "pausable description",
    mintable: "mintable description",
  },
};

export const defaults: Required<ERC20Options> = {
  metadata: {
    name: "MyToken",
    symbol: "MTK",
    premint: "0",
    premintAddress: "msg.sender",
  },
  features: {
    burnable: false,
    freezable: false,
    lockable: false,
    pausable: false,
    mintable: false,
  },
  access: commonDefaults.access,
  info: commonDefaults.info,
} as const;

function withDefaults(opts: ERC20Options): Required<ERC20Options> {
  return {
    metadata: {
      name: opts.metadata.name ?? defaults.metadata.name,
      symbol: opts.metadata.symbol ?? defaults.metadata.symbol,
      premint: opts.metadata.premint ?? defaults.metadata.premint,
      premintAddress:
        opts.metadata.premintAddress ?? defaults.metadata.premintAddress,
    },
    features: {
      burnable: opts.features.burnable ?? defaults.features.burnable,
      freezable: opts.features.freezable ?? defaults.features.freezable,
      lockable: opts.features.lockable ?? defaults.features.lockable,
      pausable: opts.features.pausable ?? defaults.features.pausable,
      mintable: opts.features.mintable ?? defaults.features.mintable,
    },
    ...withCommonDefaults(opts),
  };
}

export function printERC20(opts: ERC20Options = defaults): string {
  return printContract(buildERC20(opts));
}

export function isAccessControlRequired(opts: Partial<ERC20Options>): boolean {
  return (opts.features?.mintable ||
    opts.features?.pausable ||
    opts.features?.freezable ||
    opts.features?.lockable) as boolean;
}

export function buildERC20(opts: ERC20Options): Contract {
  const allOpts = withDefaults(opts);

  const c = new ContractBuilder(allOpts.metadata.name);

  const { access, info } = allOpts;
  const features = [];

  addERC20Base(c, allOpts.metadata.name, allOpts.metadata.symbol);

  if (allOpts.metadata.premint && allOpts.metadata.premint != "0") {
    addERC20Premint(
      c,
      allOpts.metadata.premint,
      allOpts.metadata.premintAddress as string
    );
  }

  if (allOpts.features.burnable) {
    features.push([ERC20TypeFeatureType.BURNABLE]);
    addERC20Burnable(c);
  }

  if (allOpts.features.freezable) {
    features.push([ERC20TypeFeatureType.FREEZABLE]);
    addERC20Freezable(c, access);
  }

  if (allOpts.features.pausable) {
    features.push([ERC20TypeFeatureType.PAUSABLE]);
    addERC20Pausable(c, access);
  }

  if (allOpts.features.mintable) {
    features.push([ERC20TypeFeatureType.MINTABLE]);
    addERC20Mintable(c, access);
  }

  if (allOpts.features.lockable) {
    features.push([ERC20TypeFeatureType.LOCKABLE]);
    addERC20Lockable(c, access);
  }

  setAccessControl(c, access);
  setInformation(c, info);

  // setFeatures(c, features);
  setAccess(
    c,
    !access ? Access.NONE : access == "ownable" ? Access.OWNABLE : Access.ROLES
  );
  return c;
}
