'use strict';
const expect = require('chai').expect;
const assert = require('chai').assert;
const Util = require('../dist/Util');
const Role = require('../dist/Role').default;

describe('test `Util.hasPermission` fn', function() {
    let existsPermission = ['user_edit', 'student_edit', 'teacher_edit', 'admin_login', 'admin_logout'];
    it('check start with *, should return true', function() {
        expect(Util.hasPermission(existsPermission, '*_edit')).to.equal(true);
    });

    it('check start with *, not with end, should return false', function() {
        expect(Util.hasPermission(existsPermission, '*_ed')).to.equal(false);
    });

    it('check start end with *, should return true', function() {
        expect(Util.hasPermission(existsPermission, '*_ed*')).to.equal(true);
    });

    it('check end with *, should return true', function() {
        expect(Util.hasPermission(existsPermission, 'admin_*')).to.equal(true);
    });

    it('check with multiple *, should return true', function() {
        expect(Util.hasPermission(existsPermission, 'admin***')).to.equal(true);
    });

    it('check with center *, should return true', function() {
        expect(Util.hasPermission(existsPermission, 'admin*out')).to.equal(true);
    })
});

describe('test `Util.getRole` fn', function() {

    it('string without |', function() {
        expect(Util.getRole('administrator')).to.be.a('array').have.lengthOf(1).property(0).instanceOf(Role);
    });

    it('string with |', function() {
        expect(Util.getRole('administrator|student|teacher')).to.be.a('array').have.lengthOf(3).property(2).instanceOf(Role);
    });

    it('string[]', function(){
        expect(Util.getRole(['administrator', 'student', 'teacher'])).to.be.a('array').have.lengthOf(3).property(2).instanceOf(Role);
    });

    it('Role instance', function() {
        let role = new Role('administrator', ['edit', 'publish']);
        expect(Util.getRole([role])).have.lengthOf(1).property(0).instanceOf(Role).property('role').to.be.equal('administrator');
    });

    it('roles with permissions', function() {
        let roles = Util.getRole('administrator', ['edit', 'publish']);
        expect(roles).have.length(1).property(0).include({
            role: 'administrator'
        });
        assert.sameMembers(roles[0].permissions, ['edit', 'publish']);
    });

});
