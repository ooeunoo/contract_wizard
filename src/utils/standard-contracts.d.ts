export interface StandardContracts {
  version: string;
  sources: Record<string, string>;
  dependencies: Record<string, string[]>;
}

declare const contracts: StandardContracts;

export default contracts;
