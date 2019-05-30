'use strict';
const expect = require('chai').expect;
const assert = require('chai').assert;
const Role = require('../dist/Role').default;


describe('Role', function() {

    let roleName = 'administrator';
    let permissions = [
        'add_user',
        'delete_user',
        'edit_user',
        'edit_own_user_info',
        'add_post',
        'edit_post',
        'publish_post',
        'un_publish_post',
        'delete_post',
        'view_unpost_post'
    ];
    let role = new Role(roleName, permissions);

    it('check roles instance', function() {
        expect(role).to.be.instanceOf(Role).property('permissions').to.be.a('array').have.lengthOf(permissions.length);
    });

    it('check method `is` on roles', function(){
        assert.isOk(role.is('administrator'));
    });


    describe('Role can method', function(){

        it('check roles with permissions `add_user` will return true', function(){
            expect(role.can('add_user')).to.be.equal(true);
        });

        it('check roles with permissions `add_user1` will return false', function(){
            expect(role.can('add_user1')).to.be.equal(false);
        });

        it('check roles with permissions array', function(){

            // check has any on permissions
            expect(role.can(['add_user', 'add_manage_user'])).to.be.equal(true);

            // has two permissions at the same time
            expect(role.can(['add_user', 'add_manage_user'], true)).to.be.equal(false);

        });

        it('check roles with permissions string', function() {

            expect(role.can('add_user|add_manage_user')).to.be.equal(true);


            expect(role.can('add_user|add_manage_user', true)).to.be.equal(false);
        });


        it('check roles with * string', function() {

            expect(role.can('*_user')).to.be.equal(true);

            expect(role.can(['*_user', '*_some_other_permission'], true)).to.be.equal(false);

            expect(role.can('*_some_other_permission')).to.be.equal(false);
        });

    });

});
