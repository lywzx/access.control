import Role from "./Role";
import {
    AbilityOptions, MapKeyStringValueBoolean,
    RoleAndOwnsOptions,
    RoleTypes,
    StringArray,
    StringOrStringArray
} from './types/Types';
import {
    isString,
    some,
    every
} from 'lodash';
import { getRole, hasPermission, standardize } from "./Util";
import { Post } from "./types/Post";

class User {

    /**
     *
     * @type {Role[]} current has roles
     */
    protected role: Role[] = [];

    /**
     * @type {string[]} current has permissions
     */
    protected permission: StringArray = [];

    /**
     * @type {number|undefined} current login user id
     */
    protected userId: number | undefined;


    /**
     *
     * @param {RoleTypes} role
     * @param {StringArray} permission
     * @param {number} userId
     */
    constructor( role: RoleTypes = 'guest', permission?: StringArray, userId?: number) {
        let permi: string[] = permission || [];
        this.userId = userId;
        this.setRole(role, permi);
        this.permission = permi;
    }


    /**
     *
     * @param {RoleTypes} role
     * @param {string[]} permission
     */
    public setRole(role: RoleTypes, permission?: string[]):void {
        this.role = getRole(role, permission);
    }

    /**
     *
     * @param {string | string[]} role
     * @param {boolean} requiredAll
     * @returns {boolean}
     */
    public hasRole(role: StringOrStringArray, requiredAll:boolean = false): boolean {
        let r:string[] = [];
        if (isString(role)) {
            r = role.split('|');
        } else {
            r = role;
        }

        return (requiredAll ? every : some)(r, (value: string) => {
            return some(this.role, (rol: Role)=> rol.is(value));
        });
    }


    /**
     * @param {Post} post
     * @param {string} key
     * @returns {boolean}
     */
    public owns(post: Post, key: string = 'user_id'): boolean {
        return post[key] === this.userId;
    }

    /**
     *
     * @param {string | string[]} permission
     * @param {boolean} requiredAll
     * @returns {boolean}
     */
    public can(permission: StringOrStringArray, requiredAll:boolean = false):boolean {
        let permissions: string[] = [];
        if (isString(permission)) {
            permissions = permission.split('|');
        } else {
            permissions = permission;
        }

        return (requiredAll ? every : some)(permissions, (permission)=>{
            if (permission.indexOf('.') !== -1) {
                let [role, per] = permission.split('.');

                if (role !== '*' || per !== '*') {
                    return some(this.role, (r) => {
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
            return hasPermission(this.permission, permission) ||
                some(this.role, (r)=> r.can(permission));
        });
    }

    /**
     *
     * @param {string | string[]} permission
     * @param {boolean} requiredAll
     * @returns {boolean}
     */
    public hasPermission(permission: StringOrStringArray, requiredAll:boolean = false):boolean {
        return this.can(permission, requiredAll);
    }

    /**
     *
     * @param {string | string[]} permission
     * @param {boolean} requiredAll
     * @returns {boolean}
     */
    public isAbleTo(permission: StringOrStringArray, requiredAll:boolean = false):boolean {
        return this.can(permission, requiredAll);
    }

    /**
     *
     * @param {StringOrStringArray} permissions
     * @param {Post} post
     * @param {RoleAndOwnsOptions} options
     * @returns {boolean}
     */
    public canAndOwns(permissions: StringOrStringArray, post: Post, options: RoleAndOwnsOptions):boolean {
        return this.can(permissions) && this.owns(post, options.foreignKeyName);
    }

    /**
     *
     * @param {StringOrStringArray} roles
     * @param {Post} post
     * @param {RoleAndOwnsOptions} options
     * @returns {boolean}
     */
    public hasRoleAndOwns(roles: StringOrStringArray, post: Post, options: RoleAndOwnsOptions = {
        requireAll: false,
        foreignKeyName: 'user_id'
    }) {
        return this.hasRole(roles) && this.owns(post, options.foreignKeyName);
    }


    /**
     *
     * @param {StringOrStringArray} roles
     * @param {StringOrStringArray} permissions
     * @param {AbilityOptions} options
     */
    public ability(roles: StringOrStringArray, permissions: StringOrStringArray, options: AbilityOptions = {
        validate_all: false,
        return_type: 'both'
    }): boolean| {
        validateAll?: boolean;
        roles: MapKeyStringValueBoolean,
        permissions: MapKeyStringValueBoolean
    } {
        if ( options.return_type === 'boolean') {
            let hasRole = this.hasRole(roles, options.validate_all);
            let hasPermissions = this.hasPermission(permissions, options.validate_all);

            return options.validate_all ? hasRole && hasPermissions : hasRole || hasPermissions;
        }


        let rs = standardize(roles);
        let ps = standardize(permissions);

        let checkedRoles:MapKeyStringValueBoolean = {};
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
        let validateAll:boolean;
        let checkFn = (item: any) => (item === false);
        if ((options.validate_all && !(some(checkedRoles, checkFn) || some(checkedPermissions, checkFn))) || (!options.validate_all && (some(checkedRoles) || some(checkedPermissions)))) {
            validateAll = true;
        } else {
            validateAll = false;
        }

        // Return based on option.
        if (options.return_type === 'array') {
            return {
                'roles': checkedRoles,
                'permissions': checkedPermissions
            };
        }

        return {
            'validateAll': validateAll,
            'roles': checkedRoles,
            'permissions': checkedPermissions
        }
    }

}


export default User;
