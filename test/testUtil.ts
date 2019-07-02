'use strict';
import { expect, assert } from 'chai';
import { hasPermission, getRole } from '../src/index';
import Role from '../src/Role';

describe('test `hasPermission` fn', function() {
  let existsPermission = ['user_edit', 'student_edit', 'teacher_edit', 'admin_login', 'admin_logout'];
  it('check start with *, should return true', function() {
    expect(hasPermission(existsPermission, '*_edit')).to.equal(true);
  });

  it('check start with *, not with end, should return false', function() {
    expect(hasPermission(existsPermission, '*_ed')).to.equal(false);
  });

  it('check start end with *, should return true', function() {
    expect(hasPermission(existsPermission, '*_ed*')).to.equal(true);
  });

  it('check end with *, should return true', function() {
    expect(hasPermission(existsPermission, 'admin_*')).to.equal(true);
  });

  it('check with multiple *, should return true', function() {
    expect(hasPermission(existsPermission, 'admin***')).to.equal(true);
  });

  it('check with center *, should return true', function() {
    expect(hasPermission(existsPermission, 'admin*out')).to.equal(true);
  });
});

describe('test `getRole` fn', function() {
  it('string without |', function() {
    expect(getRole('administrator'))
      .to.be.a('array')
      .have.lengthOf(1)
      .property('0')
      .instanceOf(Role);
  });

  it('string with |', function() {
    expect(getRole('administrator|student|teacher'))
      .to.be.a('array')
      .have.lengthOf(3)
      .property('2')
      .instanceOf(Role);
  });

  it('string[]', function() {
    expect(getRole(['administrator', 'student', 'teacher']))
      .to.be.a('array')
      .have.lengthOf(3)
      .property('2')
      .instanceOf(Role);
  });

  it('Role instance', function() {
    let role = new Role('administrator', ['edit', 'publish']);
    expect(getRole([role]))
      .have.lengthOf(1)
      .property('0')
      .instanceOf(Role)
      .property('role')
      .to.be.equal('administrator');
  });

  it('roles with permissions', function() {
    let roles = getRole('administrator', ['edit', 'publish']);
    expect(roles)
      .have.length(1)
      .property('0')
      .include({
        role: 'administrator',
      });
    assert.sameMembers(roles[0].permissions, ['edit', 'publish']);
  });
});
