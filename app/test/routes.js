const chai = require('chai');
const assert = chai.assert;
const supertest = require('supertest');
const proxyquire = require('proxyquire');
const jwt = require('jsonwebtoken');
require('dotenv').config();

describe('routes', function() {
    let dbStubs = { '@global': true };
    let bcryptStubs = { '@global': true };;
    const stubs = {
        redis: {
            createClient: function(port, host) {
                return {};
            },
            '@global': true,
        },
        bcryptjs: bcryptStubs,
        './db': dbStubs,
    };
    const server = proxyquire('../src/index', stubs);
    const request = supertest(server);

    describe('/', function() {
        describe('GET', function() {
            it('should respond 200', async function(){
                await request.get('/').expect(200);
            });
        });
    });

    describe('/register', function() {
        describe('POST', function() {
            afterEach(function () {
                delete dbStubs.getAsync;
                delete dbStubs.setAsync;
            });
            it('should respond with 201 for new user', async function () {
                dbStubs.getAsync = function(key) { return null; };
                dbStubs.setAsync = function(key, value) { return 1; };
                const data = { user: 'foo', password: 'bar' };
                await request.post('/register').send(data).expect(201);
            });
            it('should respond with 400 for invalid input', async function () {
                const data1 = { user: '', password: 'bar' };
                await request.post('/register').send(data1).expect(400);
                const data2 = { user: 'foo', password: '' };
                await request.post('/register').send(data2).expect(400);
            });
            it('should respond with 409 for conflict', async function () {
                dbStubs.getAsync = function(key) { return true; };
                const data = { user: 'foo', password: 'bar' };
                await request.post('/register').send(data).expect(409);
            });
        });
    });

    describe('/login', function() {
        describe('POST', function() {
            afterEach(function () {
                delete dbStubs.getAsync;
                delete bcryptStubs.compareSync;
            });
            it('should respond with 200 and jwt for valid user', async function () {
                dbStubs.getAsync = function(key) { return 1; };
                bcryptStubs.compareSync = function(pass, hash) { return 1; }
                const data = { user: 'foo', password: 'bar' };
                const resp = await request.post('/login').send(data).expect(200);
                assert.isString(resp.body.jwt);
            });
            it('should respond with 401 without jwt for invalid username', async function () {
                dbStubs.getAsync = function(key) { return 0; };
                const data = { user: 'foo', password: 'bar' };
                const resp = await request.post('/login').send(data).expect(401);
                assert.isUndefined(resp.body.jwt);
            });
            it('should respond with 401 without jwt for invalid password', async function () {
                dbStubs.getAsync = function(key) { return 1; };
                bcryptStubs.compareSync = function(pass, hash) { return 0; }
                const data = { user: 'foo', password: 'bar' };
                const resp = await request.post('/login').send(data).expect(401);
                assert.isUndefined(resp.body.jwt);
            });
            it('should contain username and 2min expiration in jwt', async function () {
                dbStubs.getAsync = function(key) { return 1; };
                bcryptStubs.compareSync = function(pass, hash) { return 1; }
                const data = { user: 'foo', password: 'bar' };
                const now = Date.now();
                const resp = await request.post('/login').send(data).expect(200);
                const decoded = jwt.verify(resp.body.jwt, process.env.SECRET);
                assert.equal(decoded.username, 'foo');

                const diff = Math.round((decoded.exp * 1000 - now) / 60000);
                assert.equal(diff, 2);
            });
        });
    });
});
