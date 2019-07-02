'use strict';
import { expect } from 'chai';
import User from '../src/User';

describe('ts-hi function test', () => {
  it('should return 2', () => {
    let user = new User();
    user.setRole('admin');

    expect(user.hasRole('admin')).to.equal(true);
  });
});
