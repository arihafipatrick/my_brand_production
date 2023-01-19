// process.env.NODE_ENV = 'test';

const expect  = require('chai').expect;
const request = require('supertest');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

//Assertion Style
let should = chai.should();

chai.use(chaiHttp);

describe('Blog API Testing', () =>{
  //Test the GET route
    it('Should get all the Posts',(done) =>{
      chai.request(server)
      .get('/api/posts/')
      .end((err, response)=>{
        const body = response.body;
        response.should.have.status(200);
        response.body.should.be.a('array');                 
        done();
      })
    })



    it('Should not get all the Posts',(done) =>{
      chai.request(server)
      .get('/api/post')
      .end((err, response)=>{
        const body = response.body;
        response.should.have.status(404);               
        done();
      })
    })

  //Test the GET(by Id) route
    it('Should get post by Id',(done) =>{
      const postId = "63a55224e972da2086b9ed34";
      chai.request(server)
      .get('/api/posts/' +postId)
      .end((err, response)=>{
        const body = response.body;
        response.should.have.status(200);
        response.body.should.be.a('object');  
        done();

      })
    })


  //Test the POST route
    it('New Post: OK, creating a new post works',(done) =>{
      chai.request(server)
      .post('/api/posts/')
      .send({title:'Testt', description: 'testbody',})
      .then((res) =>{
        const body = res.body;
        res.status.should.be.eql(201);
        done();
      })
      .catch((err)=> done(err));
    })


 //Test the PATCH route

    it('UPDATING:OK, Updating a  post works',(done) =>{
      const postId = "63a30b7389a5da2825dc2f53";
      const post ={
        title : "This title is from test"
      };
      chai.request(server)
      .patch('/api/posts/'  +postId)
      .send(post)
      .then((res) =>{
        const body = res.body;
        res.status.should.be.eql(200);
        body.should.be.a('object')
        body.should.have.property('statusCode').eql('200')
        done();
      })
      .catch((err)=> done(err));
    })


  //Test the DELETE route
    it('DELETE: OK, Deleting  a  post works',(done) =>{
      const postId = "63a30b7389a5da2825dc2f53";
      chai.request(server)
      .delete('/api/posts/' +postId)
      .then((response)=>{
        const body = response.body;
        response.should.have.status(200);
        body.should.be.a('object');
        done()
      })
      .catch((err)=> done(err));
    })


});
