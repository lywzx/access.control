import Role from "./Role";
import {
    Role as RoleType
} from "./types/Role";
import {
    RoleTypes,
    Post
} from './types/Types';
import {
    isString,
    some,
    every
} from 'lodash';
import { getRole, hasPermission } from "./Util";
import { AbilityOptions } from "./types/AbilityOptions";


class User {

    protected role: Role[] = [];

    protected permission: string[] = [];

    protected userId: number | undefined;

    constructor( role: Role);
    constructor( role: RoleType);
    constructor( role: string[]);
    constructor( role: Role[]);
    constructor( role: RoleType[] );
    constructor( role: string, permission?: string[]);
    constructor( role: RoleTypes = 'guest', permission?: string[], userId?: number) {
        let permi: string[] = permission || [];
        this.userId = userId;
        // TODO resolve error
        // this.setRole(role, permi);
        this.permission = permi;
    }


    public setRole(role: Role): void;
    public setRole(role: RoleType): void;
    public setRole(role: string[]): void;
    public setRole(role: Role[]): void;
    public setRole(role: RoleType[]): void;
    public setRole(role: string, permission?: string[]): void;
    public setRole(role: RoleTypes, permission?: string[]):void {
        this.role = getRole(role, permission);
    }

    /**
     *
     * @param {string | string[]} role
     * @param {boolean} requiredAll
     * @returns {boolean}
     */
    public hasRole(role: string|string[], requiredAll:boolean = false): boolean {
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
     *
     * @param {Post<string>} post
     * @param {K} key
     * @returns {boolean}
     */
    public owns<K extends keyof Post<string>>(post: Post<string>, key: K): boolean {
        return post[key] === this.userId;
    }

    /**
     *
     * @param {string | string[]} permission
     * @param {boolean} requiredAll
     * @returns {boolean}
     */
    public can(permission: string|string[], requiredAll:boolean = false):boolean {
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
            return hasPermission(this.permission, permission) || some(this.role, (r)=> r.can(permission));
        });
    }

    /**
     *
     * @param {string | string[]} permission
     * @param {boolean} requiredAll
     * @returns {boolean}
     */
    public hasPermission(permission: string|string[], requiredAll:boolean = false):boolean {
        return this.can(permission, requiredAll);
    }

    /**
     *
     * @param {string | string[]} permission
     * @param {boolean} requiredAll
     * @returns {boolean}
     */
    public isAbleTo(permission: string|string[], requiredAll:boolean = false):boolean {
        return this.can(permission, requiredAll);
    }

    /**
     *
     * @param {string | string[]} permission
     * @param {Post<string>} post
     * @param {K} key
     * @returns {boolean}
     */
    public canAndOwns<K extends keyof Post<string>>(permission: string|string[], post: Post<string>, key: K):boolean {
        return this.can(permission) && this.owns(post, key);
    }

    /**
     *
     * @param {string | string[]} roles
     * @param {string | string[]} permission
     * @param {Partial<AbilityOptions>} options
     */
    public ability(roles: string|string[], permission: string|string[], options: Partial<AbilityOptions> = {
        validate_all: false,
        return_type: 'both'
    }) {

    }

}


export default User;
