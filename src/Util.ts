import {
    some,
    isString,
    isObject,
    isArray,
    flatten,
    trim
} from "lodash";
import { RoleTypes, StringArray, StringOrStringArray } from "./types/Types";
import Role from "./Role";
import { Role as RoleType } from "./types/Role";


/**
 *
 * @param {string[]} exists_permission
 * @param {string} permission
 * @returns {boolean}
 */
export const hasPermission = function (exists_permission: string[], permission: string): boolean {
    if ( trim(permission) === '*' ) {
        return true;
    }
    if ( permission.indexOf('*') !== -1 ) {
        let reg = permission.replace(/\*+/g, function(str, index) {
            if (index === '0') {
                return '^[a-zA-z][\\w-]*?';
            }
            if (index === (permission.length - 1)) {
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
        let permissionTest: RegExp = new RegExp(reg);
        return some(exists_permission, (item) => permissionTest.test(item));
    }
    return exists_permission.indexOf(permission) !== -1;
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
        ret = [new Role(role, permission)];
    } else if (role instanceof Role) {
        ret = [role];
    } else if (isObject(role) && isString((<RoleType> role).role)) {
        let r = <RoleType> role;
        ret = [new Role(r.role, r.permission || [])]
    } else if (isArray(role)) {
        let r =  role as [string, RoleType, Role];
        ret = flatten(r.map(function (item: string|RoleType|Role): Role[] {
            return getRole(item);
        }));
    }

    return ret;
};

/**
 *
 * @param {StringOrStringArray} $value
 * @returns {StringArray}
 */
export const standardize = function (value: StringOrStringArray): StringArray {
    if ( isString(value) ) {
        return value.split('|');
    }
    return value;
}
