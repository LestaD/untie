var should = require('should');
var ut = process.env.COVERAGE
  ? require('../coverage/untie')
  : require('../lib/untie');


describe('exports', _ => {
  it('default', () => {
    should(ut).have.property('default');
    should(ut.default).be.a.Function;
  });

  it('Validator', () => {
    should(ut).have.property('Validator');
    should(ut.Validator).be.a.Function;
  });

  it('createValidator', () => {
    should(ut).have.property('createValidator');
    should(ut.createValidator).be.a.Function;
  });

  it('Type', () => {
    should(ut).have.property('Type');
    should(ut.Type).be.a.Object;
  });

  describe('all types', () => {

    const types = [
      'array',
      'bool',
      'func',
      'number',
      'object',
      'string',
      'symbol',
      'any',
    ];

    types.forEach(type => {
      it(type, () => {
        should(ut.Type).have.property(type);
        should(ut.Type[type]).be.a.Function;
      });
      it(type+'.Required', () => {
        should(ut.Type[type]).have.property('Required');
        should(ut.Type[type].Required).be.a.Function;
      });
    });

    const withoutRequired = [
      'arrayOf',
      'objectOf',
      'oneOf',
      'oneOfType',
      'shape',
    ];

    withoutRequired.forEach(type => {
      it(type, () => {
        should(ut.Type).have.property(type);
        should(ut.Type[type]).be.a.Function;
      });
    });
  });

  it('default == Validator', () => {
    should(ut.default).is.equal(ut.Validator);
  });

  describe('Validator', () => {
    it('has .validate()', () => {
      should(ut.Validator).have.property('validate');
      should(ut.Validator.validate).be.a.Function;
    });

    it('.validate() with 1 parameter', () => {
      should(ut.Validator.validate.length).be.equal(1);
    });

    // TODO: write tests
  });

  describe('createValidator', () => {
    it('receive 1 parameter', () => {
      should(ut.createValidator.length).be.equal(1);
    });
  });
});
