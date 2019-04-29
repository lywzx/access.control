import Role from "./Role";

class User {

    protected role: Role[] = [];

    public setRole(role: Role): void;
    public setRole(role: {role: string, permission?: string[]}): void;
    public setRole(role: string, permission: string[]):void;
    public setRole(role: string | string[] | Role | { role: string, permission?: string[]}, permission: string[] = []):void {
        let roles: Role[] = [];
        if (typeof role === 'string') {
            roles = [new Role(role, permission)];
        } else if (role instanceof Role) {
            roles = [role];
        } else if (typeof role === 'object' && typeof role.role === 'string') {

        }
        this.role = roles;
    }

    public hasRole(role: string|string[]): boolean {
        if (typeof role == "string") {

        }
    }

    public owns() {

    }

    public canAndOwns() {

    }

}


export default User;
