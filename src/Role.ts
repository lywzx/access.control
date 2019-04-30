
class Role {

    constructor(public role: string, public permission: string[]) {}


    public is(role: string){
        return this.role === role;
    }




}

export default Role;
