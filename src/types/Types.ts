import { Role as RoleType } from "./Role";
import Role from "../Role";
import { Options } from "./Options";

export type RoleTypes = String | String[] | RoleType | RoleType[] | Role | Role[];

export type StringArray = string[];
export type StringOrStringArray = string | string[];

export type AbilityOptions = Partial<Pick<Options, 'validate_all'|'return_type'>>;
export type RoleAndOwnsOptions = Partial<Pick<Options, 'requireAll'|'foreignKeyName'>>;

export type MapKeyStringValueBoolean = {[s: string]: boolean};
