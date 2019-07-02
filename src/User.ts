import Role from './Role';
import {
  AbilityOptions,
  MapKeyStringValueBoolean,
  RoleAndOwnsOptions,
  RoleTypes,
  StringArray,
  StringOrStringArray,
} from './types/Types';
import isString from 'lodash/isString';
import every from 'lodash/every';
import some from 'lodash/some';
import { getRole, hasPermission, standardize } from './Util';
import { PostTypes } from './types/PostTypes';

type abilityReturn =
  | boolean
  | {
      validateAll?: boolean;
      roles: MapKeyStringValueBoolean;
      permissions: MapKeyStringValueBoolean;
    };

class User {
  public get userId(): number | undefined {
    return this._userId;
  }

  public set userId(value: number | undefined) {
    this._userId = value;
  }

  /**
   *
   * @type {Role[]} current has roles
   */
  protected roles: Role[] = [];

  /**
   * @type {string[]} current has permissions
   */
  protected permissions: StringArray = [];

  /**
   * @type {number|undefined} current login user id
   */
  private _userId: number | undefined;

  /**
   *
   * @param {RoleTypes} role
   * @param {StringArray} permission
   * @param {number} userId
   */
  public constructor(role: RoleTypes = 'guest', permission?: StringArray, userId?: number) {
    if (isString(role)) {
      this.setRole(role, permission);
    } else {
      this.setRole(role);
      this.permissions = permission || [];
    }
    this._userId = userId;
  }

  /**
   *
   * @param {RoleTypes} role
   * @param {string[]} permission
   */
  public setRole(role: RoleTypes, permission?: string[]): void {
    this.roles = getRole(role, permission);
  }

  /**
   *
   * @param {RoleTypes} role
   * @param {string[]} permission
   */
  public appendRole(role: RoleTypes, permission?: string[]): void {
    this.roles = this.roles.concat(getRole(role, permission));
  }

  /**
   *
   * @param {string | string[]} role
   * @param {boolean} requiredAll
   * @returns {boolean}
   */
  public hasRole(role: StringOrStringArray, requiredAll: boolean = false): boolean {
    let r: string[] = [];
    if (isString(role)) {
      r = role.split('|');
    } else {
      r = role;
    }

    return (requiredAll ? every : some)(r, (value: string) => {
      return some(this.roles, (rol: Role) => rol.is(value));
    });
  }

  /**
   * @param {PostTypes} post
   * @param {string} key
   * @returns {boolean}
   */
  public owns(post: PostTypes, key: string = 'user_id'): boolean {
    return post[key] === this._userId;
  }

  /**
   *
   * @param {string | string[]} permission
   * @param {boolean} requiredAll
   * @returns {boolean}
   */
  public can(permission: StringOrStringArray, requiredAll: boolean = false): boolean {
    let permissions: string[] = [];
    if (isString(permission)) {
      permissions = permission.split('|');
    } else {
      permissions = permission;
    }

    return (requiredAll ? every : some)(permissions, permission => {
      if (permission.indexOf('.') !== -1) {
        let [role, per] = permission.split('.');

        if (role !== '*' || per !== '*') {
          return some(this.roles, r => {
            let result = true;
            if (role !== '*') {
              result = result && r.is(role);
            }
            if (per !== '*' && result) {
              result = result && r.can(per);
            }
            return result;
          });
        }
      }
      return hasPermission(this.permissions, permission) || some(this.roles, r => r.can(permission));
    });
  }

  /**
   *
   * @param {string | string[]} permission
   * @param {boolean} requiredAll
   * @returns {boolean}
   */
  public hasPermission(permission: StringOrStringArray, requiredAll: boolean = false): boolean {
    return this.can(permission, requiredAll);
  }

  /**
   *
   * @param {string | string[]} permission
   * @param {boolean} requiredAll
   * @returns {boolean}
   */
  public isAbleTo(permission: StringOrStringArray, requiredAll: boolean = false): boolean {
    return this.can(permission, requiredAll);
  }

  /**
   *
   * @param {StringOrStringArray} permissions
   * @param {PostTypes} post
   * @param {RoleAndOwnsOptions} options
   * @returns {boolean}
   */
  public canAndOwns(
    permissions: StringOrStringArray,
    post: PostTypes,
    options: RoleAndOwnsOptions = {
      requireAll: false,
      foreignKeyName: 'user_id',
    }
  ): boolean {
    return this.can(permissions, options.requireAll) && this.owns(post, options.foreignKeyName);
  }

  /**
   *
   * @param {StringOrStringArray} roles
   * @param {PostTypes} post
   * @param {RoleAndOwnsOptions} options
   * @returns {boolean}
   */
  public hasRoleAndOwns(
    roles: StringOrStringArray,
    post: PostTypes,
    options: RoleAndOwnsOptions = {
      requireAll: false,
      foreignKeyName: 'user_id',
    }
  ) {
    return this.hasRole(roles) && this.owns(post, options.foreignKeyName);
  }

  /**
   *
   * @param {StringOrStringArray} roles
   * @param {StringOrStringArray} permissions
   * @param {AbilityOptions} options
   */
  public ability(
    roles: StringOrStringArray,
    permissions: StringOrStringArray,
    options: AbilityOptions = {
      validateAll: false,
      returnType: 'both',
    }
  ): abilityReturn {
    if (options.returnType === 'boolean') {
      let hasRole = this.hasRole(roles, options.validateAll);
      let hasPermissions = this.hasPermission(permissions, options.validateAll);

      return options.validateAll ? hasRole && hasPermissions : hasRole || hasPermissions;
    }

    let rs = standardize(roles);
    let ps = standardize(permissions);

    let checkedRoles: MapKeyStringValueBoolean = {};
    for (let role of rs) {
      checkedRoles[role] = this.hasRole(role);
    }
    let checkedPermissions: MapKeyStringValueBoolean = {};
    for (let permission of ps) {
      checkedPermissions[permission] = this.hasPermission(permission);
    }

    // If validate all and there is a false in either.
    // Check that if validate all, then there should not be any false.
    // Check that if not validate all, there must be at least one true.
    let validateAll: boolean;
    let checkFn = (item: any) => item === false;
    if (
      (options.validateAll && !(some(checkedRoles, checkFn) || some(checkedPermissions, checkFn))) ||
      (!options.validateAll && (some(checkedRoles) || some(checkedPermissions)))
    ) {
      validateAll = true;
    } else {
      validateAll = false;
    }

    // Return based on option.
    if (options.returnType === 'array') {
      return {
        roles: checkedRoles,
        permissions: checkedPermissions,
      };
    }

    return {
      validateAll: validateAll,
      roles: checkedRoles,
      permissions: checkedPermissions,
    };
  }
}

export default User;
