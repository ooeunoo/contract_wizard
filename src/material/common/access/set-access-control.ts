import type { ContractBuilder, BaseFunction } from "../../../utils/contract";
import { supportsInterface } from "../../../utils/common-functions";
import { ACCESS_CONTROL, OWNABLE } from "../../path/access-path";

export const accessOptions = [false, "ownable", "roles"] as const;

export type Access = typeof accessOptions[number];

/**
 * Sets access control for the contract by adding inheritance.
 */
export function setAccessControl(c: ContractBuilder, access: Access) {
  switch (access) {
    case "ownable": {
      c.addParent(parents.Ownable);
      break;
    }
    case "roles": {
      if (c.addParent(parents.AccessControl)) {
        c.addConstructorCode("_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);");
      }
      c.addOverride(parents.AccessControl.name, supportsInterface);
      break;
    }
  }
}

/**
 * Enables access control for the contract and restricts the given function with access control.
 */
export function requireAccessControl(
  c: ContractBuilder,
  fn: BaseFunction,
  access: Access,
  role: string
) {
  if (access === false) {
    access = "ownable";
  }

  setAccessControl(c, access);

  switch (access) {
    case "ownable": {
      c.addModifier("onlyOwner", fn);
      break;
    }
    case "roles": {
      const roleId = role + "_ROLE";

      if (
        c.addVariable(
          `bytes32 public constant ${roleId} = keccak256("${roleId}");`
        )
      ) {
        c.addConstructorCode(`_grantRole(${roleId}, msg.sender);`);
      }

      c.addModifier(`onlyRole(${roleId})`, fn);
      break;
    }
  }
}

const parents = {
  Ownable: OWNABLE,
  AccessControl: ACCESS_CONTROL,
};
