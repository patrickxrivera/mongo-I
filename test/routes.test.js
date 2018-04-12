const chai = require('chai');
const chaiHttp = require('chai-http');

const Friend = require('../models/Friend');
const initTestSetup = require('./testSetup');
const code = require('../utils/statusCodes');
const app = require('../server');

initTestSetup();

chai.use(chaiHttp);
const expect = chai.expect;

describe('ROUTES', () => {
  describe('GET /api', () => {
    it('gets the root path', async () => {
      const res = await chai.request(app).get('/api');
      expect(res).to.have.status(code.STATUS_OK);
    });
  });

  describe('POST /api/friend/new', () => {
    it('should create a friend', async () => {
      const oldCount = await Friend.count();

      const route = '/api/friend/new';
      const body = {
        firstName: 'Joe',
        lastName: 'Doe',
        age: 21
      };

      const res = await chai
        .request(app)
        .post(route)
        .send(body);

      const newCount = await Friend.count();

      expect(res).to.have.status(code.STATUS_CREATED);
      expect(newCount).to.equal(oldCount + 1);
      expect(res.body).to.eql(body);
    });

    it('should throw an error when a required field is blank', async () => {
      const oldCount = await Friend.count();

      const route = '/api/friend/new';
      const body = {
        firstName: '',
        lastName: 'Doe',
        age: 21
      };

      const res = await chai
        .request(app)
        .post(route)
        .send(body);

      const newCount = await Friend.count();

      expect(res).to.have.status(code.STATUS_USER_ERROR);
      expect(newCount).to.equal(oldCount);
      expect(res.body.error).to.be.a('string');
    });

    it('should throw an error when the age is invalid', async () => {
      const oldCount = await Friend.count();

      const route = '/api/friend/new';
      const body = {
        firstName: 'Joe',
        lastName: 'Doe',
        age: -1
      };

      const res = await chai
        .request(app)
        .post(route)
        .send(body);

      const newCount = await Friend.count();

      expect(res).to.have.status(code.STATUS_USER_ERROR);
      expect(newCount).to.equal(oldCount);
      expect(res.body.error).to.be.a('string');
    });
  });

  describe('GET /api/friends', () => {
    it('should return all friends', async () => {
      const sampleRes = { firstName: 'Joe', lastName: 'Doe', age: 14 };
      const joe = new Friend(sampleRes);
      const sam = new Friend({ firstName: 'Sam', lastName: 'Doe', age: 16 });
      const beth = new Friend({ firstName: 'Beth', lastName: 'Doe', age: 22 });

      await Promise.all([joe.save(), sam.save(), beth.save()]);

      const route = '/api/friends';

      const res = await chai.request(app).get(route);

      expect(res).to.have.status(code.STATUS_OK);
      expect(res.body).to.be.a('array');
      expect(res.body[0]).to.include(sampleRes);
    });
  });

  describe('GET /api/friends/:id', () => {
    it('should return the friend with the given ID', async () => {
      const sampleRes = { firstName: 'Joe', lastName: 'Doe', age: 14 };
      const joe = new Friend(sampleRes);
      const sam = new Friend({ firstName: 'Sam', lastName: 'Doe', age: 16 });
      const beth = new Friend({ firstName: 'Beth', lastName: 'Doe', age: 22 });

      await Promise.all([joe.save(), sam.save(), beth.save()]);

      const route = `/api/friends/${joe._id}`;

      const res = await chai.request(app).get(route);

      expect(res).to.have.status(code.STATUS_OK);
      expect(res.body).to.be.a('object');
      expect(res.body).to.include(sampleRes);
    });

    it('should return an error if the requested ID is not found', async () => {
      const sampleRes = { firstName: 'Joe', lastName: 'Doe', age: 14 };
      const joe = new Friend(sampleRes);
      const sam = new Friend({ firstName: 'Sam', lastName: 'Doe', age: 16 });
      const beth = new Friend({ firstName: 'Beth', lastName: 'Doe', age: 22 });

      await Promise.all([joe.save(), sam.save(), beth.save()]);

      const route = `/api/friends/3`;

      const res = await chai.request(app).get(route);

      expect(res).to.have.status(code.STATUS_NOT_FOUND);
      expect(res.body).to.be.a('object');
      expect(res.body.error).to.be.a('string');
    });
  });

  describe('DELETE /api/friends/:id', () => {
    it('should delete the friend at the given ID', async () => {
      const sampleRes = { firstName: 'Joe', lastName: 'Doe', age: 14 };
      const joe = new Friend(sampleRes);
      const sam = new Friend({ firstName: 'Sam', lastName: 'Doe', age: 16 });
      const beth = new Friend({ firstName: 'Beth', lastName: 'Doe', age: 22 });

      await Promise.all([joe.save(), sam.save(), beth.save()]);

      const oldCount = await Friend.count();

      const route = `/api/friends/${joe._id}`;

      const res = await chai.request(app).delete(route);

      const newCount = await Friend.count();

      expect(res).to.have.status(code.STATUS_OK);
      expect(newCount).to.equal(oldCount - 1);
      expect(res.body.n).to.equal(1);
    });

    it('should return an error message when trying to delete with an invalid id', async () => {
      const joe = new Friend({ firstName: 'Joe', lastName: 'Doe', age: 14 });
      const sam = new Friend({ firstName: 'Sam', lastName: 'Doe', age: 16 });
      const beth = new Friend({ firstName: 'Beth', lastName: 'Doe', age: 22 });

      await Promise.all([joe.save(), sam.save(), beth.save()]);

      const oldCount = await Friend.count();

      const route = `/api/friends/3`;

      const res = await chai.request(app).delete(route);

      const newCount = await Friend.count();

      expect(res).to.have.status(code.STATUS_NOT_FOUND);
      expect(newCount).to.equal(oldCount);
    });
  });

  describe('PUT /api/friends/:id', () => {
    it('should update the friend with the given ID', async () => {
      const joe = new Friend({ firstName: 'Joe', lastName: 'Doe', age: 14 });
      const sam = new Friend({ firstName: 'Sam', lastName: 'Doe', age: 16 });
      const beth = new Friend({ firstName: 'Beth', lastName: 'Doe', age: 22 });

      await Promise.all([joe.save(), sam.save(), beth.save()]);

      const route = `/api/friends/${joe._id}`;
      const updatedJoe = { firstName: 'Joseph', lastName: 'Franks', age: 22 };

      const res = await chai
        .request(app)
        .put(route)
        .send(updatedJoe);

      expect(res).to.have.status(code.STATUS_OK);
      expect(res.body).to.include(updatedJoe);
    });

    it('should return an error if the requested ID is not found', async () => {
      const joe = new Friend({ firstName: 'Joe', lastName: 'Doe', age: 14 });
      const sam = new Friend({ firstName: 'Sam', lastName: 'Doe', age: 16 });
      const beth = new Friend({ firstName: 'Beth', lastName: 'Doe', age: 22 });

      await Promise.all([joe.save(), sam.save(), beth.save()]);

      const route = `/api/friends/3`;
      const updatedJoe = { firstName: 'Joseph', lastName: 'Franks', age: 22 };

      const res = await chai
        .request(app)
        .put(route)
        .send(updatedJoe);

      expect(res).to.have.status(code.STATUS_NOT_FOUND);
      expect(res.body).to.be.a('object');
      expect(res.body.error).to.be.a('string');
    });

    it('should return an error if the age is out of range', async () => {
      const joe = new Friend({ firstName: 'Joe', lastName: 'Doe', age: 14 });
      const sam = new Friend({ firstName: 'Sam', lastName: 'Doe', age: 16 });
      const beth = new Friend({ firstName: 'Beth', lastName: 'Doe', age: 22 });

      await Promise.all([joe.save(), sam.save(), beth.save()]);

      const route = `/api/friends/${joe._id}`;
      const updatedJoe = { firstName: 'Joseph', lastName: 'Franks', age: 200 };

      const res = await chai
        .request(app)
        .put(route)
        .send(updatedJoe);

      expect(res).to.have.status(code.STATUS_NOT_FOUND);
      expect(res.body).to.be.a('object');
      expect(res.body.error).to.be.a('string');
    });

    it('should return an error if any properties are empty', async () => {
      const joe = new Friend({ firstName: 'Joe', lastName: 'Doe', age: 14 });
      const sam = new Friend({ firstName: 'Sam', lastName: 'Doe', age: 16 });
      const beth = new Friend({ firstName: 'Beth', lastName: 'Doe', age: 22 });

      await Promise.all([joe.save(), sam.save(), beth.save()]);

      const route = `/api/friends/${joe._id}`;
      const updatedJoe = { firstName: 'Joseph', lastName: '', age: 200 };

      const res = await chai
        .request(app)
        .put(route)
        .send(updatedJoe);

      expect(res).to.have.status(code.STATUS_NOT_FOUND);
      expect(res.body).to.be.a('object');
      expect(res.body.error).to.be.a('string');
    });
  });
});
