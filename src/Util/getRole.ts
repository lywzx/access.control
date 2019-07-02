import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import flatten from 'lodash/flatten';
import { RoleTypes, StringArray, StringOrStringArray } from '../types/Types';
import Role from '../Role';
import { RoleTypes as RoleType } from '../types/RoleTypes';

/**
 *
 * @param {RoleTypes} role
 * @param {string[]} permission
 * @returns {Role[]}
 */
export const getRole = function(role: RoleTypes, permission: string[] = []): Role[] {
  let ret: Role[] = [];
  if (isString(role)) {
    if (role.indexOf('|') === -1) {
      ret = [new Role(role, permission)];
    } else {
      role = role.split('|');
    }
  }

  if (role instanceof Role) {
    ret = [role];
  } else if (isObject(role) && isString((role as RoleType).role)) {
    let r = role as RoleType;
    ret = [new Role(r.role, r.permissions || [])];
  } else if (isArray(role)) {
    let r = role as [string, RoleType, Role];
    ret = flatten(
      r.map(function(item: string | RoleType | Role): Role[] {
        return getRole(item);
      })
    );
  }

  return ret;
};
