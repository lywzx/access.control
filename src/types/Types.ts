import { RoleTypes as RoleType } from './RoleTypes';
import Role from '../Role';
import { Options } from './Options';

export type RoleTypes = string | string[] | RoleType | RoleType[] | Role | Role[];

export type StringArray = string[];
export type StringOrStringArray = string | string[];

export type AbilityOptions = Partial<Pick<Options, 'validateAll' | 'returnType'>>;
export type RoleAndOwnsOptions = Partial<Pick<Options, 'requireAll' | 'foreignKeyName'>>;

export interface MapKeyStringValueBoolean {
  [s: string]: boolean;
}
