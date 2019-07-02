import some from 'lodash/some';
import trim from 'lodash/trim';

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
