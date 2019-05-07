import { Role as RoleType } from "./Role";
import Role from "../Role";

export type RoleTypes = string | string[] | RoleType | RoleType[] | Role | Role[];

export type Post<T> = {
    [P in keyof T]: number
}

