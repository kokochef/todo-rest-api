const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}];

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
  
  beforeEach((done) => {
    Todo.remove({}).then(() => {
      Todo.insertMany(todos);
    }).then(() => done());
  });

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
  
  beforeEach((done) => {
    Todo.remove({}).then(() => {
      Todo.insertMany(todos);
    }).then(() => done());
  });

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

  beforeEach((done) => {
    Todo.remove({}).then(() => {
      Todo.insertMany(todos);
    }).then(() => done());
  });

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

  beforeEach((done) => {
    Todo.remove({}).then(() => {
      Todo.insertMany(todos);
    }).then(() => done());
  });
  
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