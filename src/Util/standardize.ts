import isString from 'lodash/isString';
import { StringArray, StringOrStringArray } from '../types/Types';

/**
 *
 * @param {StringOrStringArray} value
 * @returns {StringArray}
 */
export const standardize = function(value: StringOrStringArray): StringArray {
  if (isString(value)) {
    return value.split('|');
  }
  return value;
};
