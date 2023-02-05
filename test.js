process.env.NODE_ENV = 'test';

import chai from "chai";
import { expect, assert } from "chai";
import chaiHttp from "chai-http";
import { app } from "./server.js";
chai.use(chaiHttp);

let userToken, postId;

describe('Login user and create update delete blog', function () {
    it('create user', done => {
        chai.request(app)
            .post('/api/user/register')
            .send({ "name": "testing", "email": "testing@gmail.com" })
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                done();
            });
    });
    it('login user', done => {
        chai.request(app)
            .post('/api/user/login')
            .send({ "email": "testing@gmail.com" })
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('Token');
                userToken = res.body.Token;
                done();
            });
    });

    it('create blog', done => {
        chai.request(app)
            .post('/api/blog/create')
            .send({ "title": "testing blog", "description": "this is a testing blog", })
            .set('token', `${userToken}`)
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                postId = res.body.data._id;
                done();
            });
    });

    it('update blog', done => {
        chai.request(app)
            .put(`/api/blog/${postId}`)
            .send({ "title": "testing blog updated", "description": "this is a updated testing blog", })
            .set('token', `${userToken}`)
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                done();
            });
    });

    it('delete blog', done => {
        chai.request(app)
            .delete(`/api/blog/${postId}`)
            .set('token', `${userToken}`)
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                done();
            });
    });
    it('delete user', done => {
        chai.request(app)
            .delete('/api/user/delete')
            .set('token', `${userToken}`)
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                done();
            });
    })
});

describe('After logout', function () {
    it('logout user', done=>{
        chai.request(app)
        .post('/api/user/logout')
        .set('token',`${userToken}`)
        .end((err,res)=>{
            if(err) console.log(err);
            expect(res).to.have.status(200);
            done();
        })
    })

    it('create blog', done => {
        chai.request(app)
            .post('/api/blog/create')
            .send({ "title": "testing blog", "description": "this is a testing blog", })
            .set('token', `${userToken}`)
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                postId = res.body.data._id;
                done();
            });
    });

    it('update blog', done => {
        chai.request(app)
            .put(`/api/blog/${postId}`)
            .send({ "title": "testing blog updated", "description": "this is a updated testing blog", })
            .set('token', `${userToken}`)
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                done();
            });
    });

    it('delete blog', done => {
        chai.request(app)
            .delete(`/api/blog/${postId}`)
            .set('token', `${userToken}`)
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                done();
            });
    });
});