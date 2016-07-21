var should = require('should');
var ut = process.env.COVERAGE
  ? require('../coverage/untie')
  : require('../lib/untie');


describe('Validator class', () => {

  // do not write full tests for Validator
  // because full tests writed for validatorFunctions
  describe('with schema', () => {
    function validateType(type, value, required, fail) {
      const schema = {};
      schema[type] = required ? ut.Type[type].Required : ut.Type[type];

      const target = {};
      target[type] = value;

      it('validator for ' + type + (required ? '.Required' : '') + ' with ' + value + (fail ? ' should fail' : ''), () => {
        const validator = ut.createValidator(schema);
        should(validator).be.a.Function;

        const errors = validator.validate(target);

        if (fail) {
          should(errors).be.Error;
        }
        else {
          should(errors).be.equal(null)
        }
      });
    }

    validateType('number', "asd", false, true);
    validateType('number', 123, false, false);
    validateType('number', 123, true, false);
    validateType('number', "asd", true, false);

    validateType('string', 123, false, true);
    validateType('string', "asdasd", false, false);
    validateType('string', "asd", true, false);
    validateType('string', "asd", true, 0);
  });
});
