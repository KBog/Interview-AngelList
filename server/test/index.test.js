const request = require('supertest');
const chai = require('chai');
const { expect } = chai;
const app = require('../src/index').default;

describe('Proration API', () => {
  it('should return an empty list if no investors were set', (done) => {
    request(app)
      .post('/v1/proration/prorate')
      .send({ allocation: 100, investorAmounts: []})
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('proratedAmounts');
        expect(res.body.proratedAmounts).to.be.an('object').that.is.empty;
        done();
      });
  });

  it('solo investor less than allocation => investorA = 100', (done) => {
    request(app)
      .post('/v1/proration/prorate')
      .send({ allocation: 120, investorAmounts: [{
        name: 'Investor A',
        requested_amount: 100,
        average_amount: 20
      }]})
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('proratedAmounts');
        expect(Object.keys(res.body.proratedAmounts)).to.have.lengthOf(1);
        expect(res.body.proratedAmounts['Investor A']).to.equal(100)
        done();
      });
  });

  it('solo investor with no history => investorA = 120', (done) => {
    request(app)
      .post('/v1/proration/prorate')
      .send({ allocation: 120, investorAmounts: [{
        name: 'Investor A',
        requested_amount: 150,
        average_amount: 0
      }]})
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('proratedAmounts');
        expect(Object.keys(res.body.proratedAmounts)).to.have.lengthOf(1);
        expect(res.body.proratedAmounts['Investor A']).to.equal(120)
        done();
      });
  });

  it('works for basic 1 example => investorA = 80 and investorB = 20', (done) => {
    request(app)
      .post('/v1/proration/prorate')
      .send({ allocation: 100, investorAmounts: [{
        name: 'Investor A',
        requested_amount: 150,
        average_amount: 100
      }, {
        name: 'Investor B',
        requested_amount: 50,
        average_amount: 25
      }]})
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('proratedAmounts');
        expect(Object.keys(res.body.proratedAmounts)).to.have.lengthOf(2);
        expect(res.body.proratedAmounts['Investor A']).to.equal(80)
        expect(res.body.proratedAmounts['Investor B']).to.equal(20)
        done();
      });
  });

  it('works for basic 2 example => investorA = 100 and investorB = 25', (done) => {
    request(app)
      .post('/v1/proration/prorate')
      .send({ allocation: 200, investorAmounts: [{
        name: 'Investor A',
        requested_amount: 100,
        average_amount: 100
      }, {
        name: 'Investor B',
        requested_amount: 25,
        average_amount: 25
      }]})
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('proratedAmounts');
        expect(Object.keys(res.body.proratedAmounts)).to.have.lengthOf(2);
        expect(res.body.proratedAmounts['Investor A']).to.equal(100)
        expect(res.body.proratedAmounts['Investor B']).to.equal(25)
        done();
      });
  });

  it('works for complex 1 example => investorA = 97.96875 and investorB = 1.03125 and investorC = 1', (done) => {
    request(app)
      .post('/v1/proration/prorate')
      .send({ allocation: 100, investorAmounts: [{
        name: 'Investor A',
        requested_amount: 100,
        average_amount: 95
      }, {
        name: 'Investor B',
        requested_amount: 2,
        average_amount: 1
      }, {
        name: 'Investor C',
        requested_amount: 1,
        average_amount: 4
      }]})
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('proratedAmounts');
        expect(Object.keys(res.body.proratedAmounts)).to.have.lengthOf(3);
        expect(res.body.proratedAmounts['Investor A']).to.equal(97.96875)
        expect(res.body.proratedAmounts['Investor B']).to.equal(1.03125)
        expect(res.body.proratedAmounts['Investor C']).to.equal(1)
        done();
      });
  });

  it('works for complex 2 example => investorA = 98 and investorB = 1 and investorC = 1', (done) => {
    request(app)
      .post('/v1/proration/prorate')
      .send({ allocation: 100, investorAmounts: [{
        name: 'Investor A',
        requested_amount: 100,
        average_amount: 95
      }, {
        name: 'Investor B',
        requested_amount: 1,
        average_amount: 1
      }, {
        name: 'Investor C',
        requested_amount: 1,
        average_amount: 4
      }]})
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('proratedAmounts');
        expect(Object.keys(res.body.proratedAmounts)).to.have.lengthOf(3);
        expect(res.body.proratedAmounts['Investor A']).to.equal(98)
        expect(res.body.proratedAmounts['Investor B']).to.equal(1)
        expect(res.body.proratedAmounts['Investor C']).to.equal(1)
        done();
      });
  });

  it('works if investorA has never invested so investorB gets to reach their goal first => investorA = 45 and investorB = 75', (done) => {
    request(app)
      .post('/v1/proration/prorate')
      .send({ allocation: 120, investorAmounts: [{
        name: 'Investor A',
        requested_amount: 100,
        average_amount: 0
      }, {
        name: 'Investor B',
        requested_amount: 75,
        average_amount: 25
      }]})
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('proratedAmounts');
        expect(Object.keys(res.body.proratedAmounts)).to.have.lengthOf(2);
        expect(res.body.proratedAmounts['Investor A']).to.equal(45)
        expect(res.body.proratedAmounts['Investor B']).to.equal(75)
        done();
      });
  });

  it('works if all investors have no history to have equal opportunity => investorA = 60 and investorB = 60', (done) => {
    request(app)
      .post('/v1/proration/prorate')
      .send({ allocation: 120, investorAmounts: [{
        name: 'Investor A',
        requested_amount: 100,
        average_amount: 0
      }, {
        name: 'Investor B',
        requested_amount: 75,
        average_amount: 0
      }]})
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('proratedAmounts');
        expect(Object.keys(res.body.proratedAmounts)).to.have.lengthOf(2);
        expect(res.body.proratedAmounts['Investor A']).to.equal(60)
        expect(res.body.proratedAmounts['Investor B']).to.equal(60)
        done();
      });
  });
});
