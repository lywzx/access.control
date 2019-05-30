'use strict';
const expect = require('chai').expect;
const User = require('../dist/User').default;

describe('User', function() {

    describe('User constructor', function(){

        let userFist = new User('administrator', ['edit_user', 'rename_user']);

        it('check user instance', function() {
            expect(userFist).to.be.instanceOf(User);
        });

        it('check user has roles', function(){
            expect(userFist).property('roles').to.be.a('array').have.lengthOf(1);
        });

        it('check user has permissions', function() {
            expect(userFist).property('permissions').to.be.a('array').have.lengthOf(0);
        });


        let userSecond = new User(['administrator', 'editor'], ['edit_user', 'rename_user'], 5);

        it('check roles length be equal to 2', function(){
            expect(userSecond).property('permissions').to.be.a('array').have.lengthOf(2);
        });

        it('check permissions length be equal to 2', function(){
            expect(userSecond).property('permissions').to.be.a('array').have.lengthOf(2);
        });

    });


    describe('User setRole method', function() {

        it('check set administrator', function() {
            let user = new User();
            user.setRole('administrator');
            expect(user.hasRole('administrator')).to.be.equal(true);
        })


    });


    describe('User appendRole method', function() {

        it('check append role', function() {
            let user = new User();

            user.setRole('editor');

            expect(user.hasRole('editor', true)).to.be.equal(true);

            user.appendRole('administrator');

            expect(user.hasRole(['editor', 'administrator'], true)).to.be.equal(true);

        });


    });

    describe('User hasRole method', function() {
        let user = new User(['administrator', 'editor', 'common_user']);

        it('check has roles', function(){
           expect(user.hasRole('administrator')).to.be.equal(true);
        });

        it('check has administrator or editor', function() {
           expect(user.hasRole(['administrator', 'editor'])).to.be.equal(true);
        });

        it('check has administrator or not exists user', function() {
           expect(user.hasRole(['administrator', 'not_exists_user'])).to.be.equal(true);
        });

        it('check has administrator and not exists user', function() {
            expect(user.hasRole(['administrator', 'not_exists_user'], true)).to.be.equal(false);
        });

        it('check has `administrator|not_exists_user` at the same time', function() {
            expect(user.hasRole('administrator|not_exists_user', true)).to.be.equal(false);
        });
    });
    
    describe('User can method', function() {

        let administratorPermissions = ['add_user', 'remove_user', 'edit_self_user_info', 'reset_every_one_password'];
        let editorPermissions        = ['edit_post', 'add_post', 'edit_post_comment', 'remove_post_comment'];
        let user = new User('administrator', administratorPermissions, 1);
        user.appendRole('editor', editorPermissions);


        it('check any one permission', function() {
            expect(user.can('edit_post')).to.be.equal(true);
        });


        it('check user has role and permission', function() {

            expect(user.can('administrator.add_post')).to.be.equal(false);

            expect(user.can('editor.edit_post')).to.be.equal(true);


        });

        it('check user has one permission at least', function() {

            expect(user.can('editor.*')).to.be.equal(true);

            expect(user.can('editor.*_post')).to.be.equal(true);

            expect(user.can('administrator.*_post')).to.be.equal(false);

            expect(user.can('editor.edit_post|administrator.edit_post_comment')).to.be.equal(true);

            expect(user.can(['editor.edit_post', 'administrator.edit_post_comment'])).to.be.equal(true);

        });


        it('check user has assign permission at the same time', function() {

            expect(user.can('editor.add_post|editor.add_user', true)).to.be.equal(false);

            expect(user.can('editor.add_post|administrator.add_user', true)).to.be.equal(true);

        });

    });

    describe('User `owns` method', function() {
        let post = {
            user_id: 1,
            id: 1,
            name: 'administrator'
        };
        let user = new User('administrator', [], 1);

        it('check user own the post with default key', function() {
            expect(user.owns(post)).to.be.equal(true);
        });


        it('check user own the post with user self key', function() {
           expect(user.owns({
               u_id: 1,
               id: 1,
               name: 'the book name'
           }, 'uid'));
        });
    });


    describe('User `canAndOwns` method', function() {

        let post = {
            user_id: 1,
            id: 2,
            name: 'the book name'
        };
        let user = new User({
                'role': 'administrator',
                'permissions': ['add_post', 'edit_post']
            }, [], 1);

        it('check user is can edit', function() {

            expect(user.canAndOwns('administrator.edit_post', post)).to.be.equal(true);

            expect(user.canAndOwns('administrator.edit_post', {
                user_id: 2,
                id: 3,
                name: 'php is best language in the world'
            })).to.be.equal(false);
        });

        it('check user is owner or has permissions', function() {
            expect(user.can('administrator.add_post') || user.owns(post)).to.be.equal(true);
        });

    });

    describe('User `hasRoleAndOwns` method', function(){

        let post = {
            user_id: 1,
            id: 2,
            name: 'php is best language in the world'
        };
        let user = new User([
            {
                role: 'administrator'
            },
            {
                role: 'editor',
                permissions: ['edit_post', 'remove_post']
            }
        ], [], 1);

        it('check user id 1 has the post', function() {
            expect(user.hasRoleAndOwns('editor', post)).to.be.equal(true);
        });


    })

});
