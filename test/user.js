// process.env.NODE_ENV = 'test';

const expect  = require('chai').expect;
const request = require('supertest');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');

//Assertion Style
let should = chai.should();

chai.use(chaiHttp);

describe('CRUD API for the user', () =>{
  //Test the GET route
    it('Should get all the Users',(done) =>{
      chai.request(server)
      .get('/api/user/')
      .end((err, response)=>{
        const body = response.body;
        response.should.have.status(200);
        response.body.should.be.a('object');                 
        done();
      })
    })



     

  //Test the GET(by Id) route
    it('Should get user by Id',(done) =>{
      const userId = "639c44e87a8a5f05a0a1a614";
      chai.request(server)
      .get('/api/user/' +userId)
      .end((err, response)=>{
        const body = response.body;
        response.should.have.status(200);
        response.body.should.be.a('object');  
        done();

      })
    })


 //Test the PATCH route

    it('UPDATING:OK, Updating a  user works',(done) =>{
      const userId = "63a41169da5bca269a6c5d5b";
      const user ={
        name : "This name is from test"
      };
      chai.request(server)
      .patch('/api/user/'  +userId)
      .send(user)
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
    it('DELETE: OK, Deleting  a  user works',(done) =>{
      const postId = "63a30b7389a5da2825dc2f53";
      chai.request(server)
      .delete('/api/user/' +postId)
      .then((response)=>{
        const body = response.body;
        response.should.have.status(200);
        body.should.be.a('object');
        done()
      })
      .catch((err)=> done(err));
    })


});

describe('SignUp and SignIn for the user', () =>{
//Test the POST route
it('New User: OK, SignUp works',(done) =>{
  chai.request(server)
  .post('/api/user/register')
  .send({name:'Testt name', email: 'testyjkboduhiok@gmail.com', password: 'testpasssword'})
  .then((res) =>{
    const body = res.body;
    res.status.should.be.eql(200);
    done();
  })
  .catch((err)=> done(err));
})

it('OK, Login works',(done) =>{
  chai.request(server)
  .post('/api/user/login')
  .send({email: 'testbodui@gmail.com', password: 'testpasssword'})
  .then((res) =>{
    const body = res.body;
    res.status.should.be.eql(200);
    done();
  })
  .catch((err)=> done(err));
})

})

