'use strict';
const expect = require('chai').expect;
const Util = require('../dist/Util');

describe('test `hasPermission` fn', () => {
    let existsPermission = ['user_edit', 'student_edit', 'teacher_edit', 'admin_login', 'admin_logout'];
    it('check start with *, should return true', () => {
        expect(Util.hasPermission(existsPermission, '*_edit')).to.equal(true);
    });

    it('check start with *, not with end, should return false', () => {
        expect(Util.hasPermission(existsPermission, '*_ed')).to.equal(false);
    });

    it('check start end with *, should return true', () => {
        expect(Util.hasPermission(existsPermission, '*_ed*')).to.equal(true);
    });

    it('check end with *, should return true', () => {
        expect(Util.hasPermission(existsPermission, 'admin_*')).to.equal(true);
    });

    it('check with multiple *, should return true', () => {
        expect(Util.hasPermission(existsPermission, 'admin***')).to.equal(true);
    });

    it('check with center *, should return true', () => {
        expect(Util.hasPermission(existsPermission, 'admin*out')).to.equal(true);
    })
});
