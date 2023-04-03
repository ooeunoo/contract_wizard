import { ContractBuilder } from "../../../utils/contract";

export enum ERC20TypeFeatureType {
  BURNABLE = "BURNABLE",
  FREEZABLE = "FREEZABLE",
  PAUSABLE = "PAUSABLE",
  MINTABLE = "MINTABLE",
  LOCKABLE = "LOCKABLE",
}

export enum ERC721TypeFeatureType {
  PAUSABLE = "PAUSABLE",
  BURNABLE = "BURNABLE",
  FREEZABLE = "FREEZABLE",
  AUTO_INCREMENT_ID = "AUTO_INCREMENT_ID",
}

export enum ERC1155TypeFeatureType {
  PAUSABLE = "PAUSABLE",
  FREEZABLE = "FREEZABLE",
  BURNABLE = "BURNABLE",
  URI_STORAGABLE = "URI_STORAGABLE",
}

export enum Access {
  NONE = "Access.NONE",
  OWNABLE = "Access.OWNABLE",
  ROLES = "Access.ROLES",
}

export function setFeatures(c: ContractBuilder, features: any[]) {
  if (features.length > 0) {
    c.addConstructorCode(
      `FeatureType[] memory _features = new FeatureType[](${features.length});`
    );

    features.map((feature: any, index: number) => {
      c.addConstructorCode(`_features[${index}] = FeatureType.${feature};`);
    });

    c.addConstructorCode("");
    c.addConstructorCode(`_setFeatures(_features);`);
  }
}

export function setAccess(c: ContractBuilder, access: Access) {
  c.addConstructorCode(`_setAccess(${access});`);
}
