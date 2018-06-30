const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

describe('POST /todos', () => {

  beforeEach((done) => {
    Todo.remove({}).then(() => done());
  });
  
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/api/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/api/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  
  beforeEach(populateTodos);

  it('should get all todos', (done) => {
    request(app)
     .get('/api/todos')
     .expect(200)
     .expect((res) => {
       expect(res.body.todos.length).toBe(2);
     })
     .end(done);
  });
});

describe('GET /todos/:id', () => {
  
  beforeEach(populateTodos);

  it('should return todo doc', (done) => {
    request(app)
      .get(`/api/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
      .get(`/api/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/api/todos/123')
      .expect(404)
      .end(done);
  }); 
});

describe('DELETE /todos/:id', () => {

  beforeEach(populateTodos);

  it('should remove a todo', (done) => {
    request(app)
      var hexId = todos[1]._id.toHexString();
      request(app)
        .delete(`/api/todos/${hexId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo._id).toBe(hexId)
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Todo.findById(hexId).then((todo) => {
            expect(todo).toBeNull();
            done();
          }).catch((e) => done(e));
        });
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
      .get(`/api/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if non-object id sent', (done) => {
    request(app)
      .get('/api/todos/123')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {

  beforeEach(populateTodos);

  it('should update the todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = 'This is a new text from test suite';

    request(app)
      .patch(`/api/todos/${hexId}`)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = todos[1]._id.toHexString();
    var text = 'This is for the second instance from test suite';

    request(app)
      .patch(`/api/todos/${hexId}`)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeNull();
      })
      .end(done);
  });
});

describe('GET /users/me', () => {

  beforeEach(populateUsers);

  it('should return user if authenticated', (done) => {
    request(app)
      .get('/api/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/api/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {

  beforeEach((done) => {
    User.remove({}).then(() => {
      done();
    });
  });

  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123app';

    request(app)
      .post('/api/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeDefined();
        expect(res.body._id).toBeDefined();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toBeDefined();
          expect(user.password).not.toBe(password);
          done();
        }).catch((err) => done(err));
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/api/users')
      .send({
        email: 'and',
        password: '123'
      })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
     request(app)
      .post('/api/users')
      .send({
        email: users[0].email,
        password: 'asesdd'
      })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {

  beforeEach(populateUsers);

  it('should login user and return auth token', (done) => {
    request(app)
      .post('/api/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeDefined();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[0]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((err) => done(err));
      });
  });

  it('should reject invalid credentials', (done) => {
    request(app)
      .post('/api/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeUndefined();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((err) => done(err));
      });
  });
});