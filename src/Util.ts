import isString from 'lodash-es/isString';
import some from 'lodash-es/some';
import isObject from 'lodash-es/isObject';
import isArray from 'lodash-es/isArray';
import flatten from 'lodash-es/flatten';
import trim from 'lodash-es/trim';
import { RoleTypes, StringArray, StringOrStringArray } from './types/Types';
import Role from './Role';
import { Role as RoleType } from './types/Role';

/**
 *
 * @param {string[]} existsPermission
 * @param {string} permission
 * @returns {boolean}
 */
export const hasPermission = function(existsPermission: string[], permission: string): boolean {
  if (trim(permission) === '*') {
    return true;
  }
  if (permission.indexOf('*') !== -1) {
    let reg = permission.replace(/\*+/g, function(str, index) {
      if (index === '0') {
        return '^[a-zA-z][\\w-]*?';
      }
      if (index === permission.length - 1) {
        return '[\\w-]*?$';
      }
      return '[\\w-]*?';
    });
    if (reg.substr(0, 1) !== '^') {
      reg = '^' + reg;
    }
    if (reg.substr(-1, 1) !== '$') {
      reg = reg + '$';
    }
    let permissionTest = new RegExp(reg);
    return some(existsPermission, item => permissionTest.test(item));
  }
  return existsPermission.indexOf(permission) !== -1;
};

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

/**
 *
 * @param {StringOrStringArray} value
 * @returns {StringArray}
 */
export const standardize = function(value: StringOrStringArray): StringArray {
  if (isString(value)) {
    return value.split('|');
  }
  return value;
};
