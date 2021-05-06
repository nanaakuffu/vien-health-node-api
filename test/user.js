//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let User = require('../models/user');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();


chai.use(chaiHttp);

//Our parent block
describe('Users', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.deleteMany({}, (err) => {
            done();
        });
    });

    /*
      * Test the /POST route
      */
    describe('POST /api/v1/users/register', () => {
        it('it should not POST register without email', (done) => {
            let user = {
                first_name: 'John',
                last_name: 'Smith',
                contact_number: "1112223331",
                password: 'password'
            }
            chai.request(server)
                .post('/api/v1/users/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });
        it('it should not POST register without confirm_password', (done) => {
            let user = {
                first_name: 'John',
                last_name: 'Smith',
                email: "johnsmith@example.com",
                contact_number: "1112223331",
                password: 'password'
            }
            chai.request(server)
                .post('/api/v1/users/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });
        it('it shoule save a user with all the correct data', (done) => {
            let user = {
                first_name: 'John',
                last_name: 'Smith',
                contact_number: "1112223331",
                email: "johnsmith@example.com",
                password: 'password',
                confirm_password: 'password'
            }
            chai.request(server)
                .post('/api/v1/users/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User was registered successfully!');
                    done();
                });
        });
    });

    /*
      * Test the /POST route
      */
    describe('POST /api/v1/users/login', () => {
        it('it should not login without email', (done) => {
            let user = {
                password: 'password'
            }
            chai.request(server)
                .post('/api/v1/users/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });
        it('it should not login without password', (done) => {
            let user = {
                email: 'johnsmith@example.com'
            }
            chai.request(server)
                .post('/api/v1/users/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });
        it('it should not login with the wrong password', (done) => {
            const user = new User({
                first_name: 'John',
                last_name: 'Smith',
                contact_number: "1112223331",
                email: "johnsmith@example.com",
                password: bcrypt.hashSync("password", 8),
            });
            user.save((err, user) => {
                let user_data = {
                    email: "johnsmith@example.com",
                    password: "example1"
                }
                chai.request(server)
                    .post('/api/v1/users/login')
                    .send(user_data)
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.body.should.be.a('object');
                        res.body.should.have.property('api_token');
                        res.body.should.have.property('message').eql('Password provided is invalid!');
                        done();
                    });
            });
        });
        it('it should POST login with the correct data', (done) => {
            const user = new User({
                first_name: 'John',
                last_name: 'Smith',
                contact_number: "1112223331",
                email: "johnsmith@example.com",
                password: bcrypt.hashSync("password", 8),
            });
            user.save((err, user) => {
                let user_data = {
                    email: "johnsmith@example.com",
                    password: "password"
                }
                chai.request(server)
                    .post('/api/v1/users/login')
                    .send(user_data)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('first_name');
                        res.body.should.have.property('last_name');
                        res.body.should.have.property('email');
                        res.body.should.have.property('contact_number');
                        res.body.should.have.property('api_token');
                        done();
                    });
            });
        });
    });

    describe('POST /api/v1/users/logout', () => {
        it('it should not logout without token', (done) => {
            chai.request(server)
                .post('/api/v1/users/logout')
                .send()
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.should.have.property('message').eql('Access denied. No credentials sent!');
                    done();
                });
        });
    });

});