import isString from 'lodash-es/isString';
import every from 'lodash-es/every';
import some from 'lodash-es/some';
import { hasPermission } from './Util';

class Role {
  /**
   *
   * @param {string} role
   * @param {string[]} permissions
   */
  public constructor(public role: string, public permissions: string[]) {}

  /**
   *
   * @param {string} role
   * @returns {boolean}
   */
  public is(role: string) {
    return this.role === role;
  }

  /**
   *
   * @param {string | string[]} permission
   * @param {boolean} requiredAll
   * @returns {boolean}
   */
  public can(permission: string | string[], requiredAll: boolean = false): boolean {
    let permissions: string[] = [];
    if (isString(permission)) {
      permissions = permission.split('|');
    } else {
      permissions = permission;
    }

    return (requiredAll ? every : some)(permissions, permission => hasPermission(this.permissions, permission));
  }
}

export default Role;
