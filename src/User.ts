import Role from "./Role";
import {
    Role as RoleType
} from "./types/Role";
import {
    isArray,
    isObject,
    isString,
    flatten,
    some
} from 'lodash';


type RoleTypes = string | string[] | RoleType | RoleType[] | Role | Role[];
type Post<T> = {
    [P in keyof T]: number
}

const getRole = function(role: RoleTypes, permission: string[] = []): Role[] {
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



class User {

    protected role: Role[] = [];

    protected permission: string[] = [];

    protected userId: number | undefined;

    constructor( role: string);
    constructor( role: Role);
    constructor( role: RoleType);
    constructor( role: string[]);
    constructor( role: Role[]);
    constructor( role: RoleType[] );
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

    public hasRole(role: string|string[]): boolean {
        let r:string[] = [];
        if (typeof role === 'string') {
            r = [role];
        }
        return some(r, (value: string) => {
            return some(this.role, (rol: Role)=> rol.is(value));
        });
    }


    public owns<K extends keyof Post<string>>(post: Post<string>, key: K) {
        return post[key] === this.userId;
    }

    public canAndOwns() {

    }


    public ability() {

    }

}


export default User;
