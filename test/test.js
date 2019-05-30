'use strict';
const expect = require('chai').expect;
const User = require('../dist/User').default;

describe('ts-hi function test', () => {
    it('should return 2', () => {
        let user = new User;
        user.setRole('admin');

        expect(user.hasRole('admin')).to.equal(true);
    });
});
