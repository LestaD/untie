var should = require('should');
var ut = process.env.COVERAGE
  ? require('../coverage/untie')
  : require('../lib/untie');

var T = ut.Type;

var demoValues = {
  array: [],
  bool: true,
  func: function() {},
  number: 123,
  object: {},
  string: "foo",
  symbol: Symbol(),
};

describe('Validates', () => {

  function testType(type, testValue) {
    var Vl = T[type];

    describe(type+': ' + String(testValue.toString()), () => {
      it('optional without value', () => {
        should(Vl({  }, 'data')).be.equal(null);
      });
      it('optional with value', () => {
        should(Vl({ data: testValue }, 'data')).be.equal(null);
      });
      it('required with value', () => {
        should(Vl.Required({ data: testValue }, 'data')).be.equal(null);
      });
      it('required without value', () => {
        should(Vl.Required({}, 'data')).be.not.equal(null);
      });

      // test for another types
      Object.keys(demoValues)
        .filter(function(exType){ return exType !== type })
        .forEach(function(exType){
          it('fail with '+exType, () => {
            var testres = Vl({ data: demoValues[exType] }, 'data');
            should(testres).be.not.equal(null);
          });
          it('Required fail with '+exType, () => {
            var testres = Vl({ data: demoValues[exType] }, 'data');
            should(testres).be.not.equal(null);
          });
        });
    });
  }

  testType('array', []);
  testType('array', [1, "2", true, [], null, undefined, function() {}]);
  testType('bool', true);
  testType('bool', false);
  testType('func', function() {});
  testType('func', (function(){ var D={}; D.demo = function demo(){}; return D.demo; })());
  testType('number', 123);
  testType('number', 0);
  testType('number', 0.5);
  testType('object', {});
  testType('string', "");
  testType('string', "foobar");
  testType('symbol', Symbol());
  testType('symbol', Symbol('example'));


  function testAny(testValue) {
    var type = 'any';
    var Vl = T[type];
    describe(type+': ' + String(testValue), () => {
      it('optional without value', () => {
        should(Vl({  }, 'data')).be.equal(null);
      });
      it('optional with value', () => {
        should(Vl({ data: testValue }, 'data')).be.equal(null);
      });
      if (testValue !== null) {
        it('required with value', () => {
          should(Vl.Required({ data: testValue }, 'data')).be.equal(null);
        });
      }
      else {
        it('fail with null', () => {
          should(Vl.Required({ data: testValue }, 'data')).not.be.equal(null);
        });
      }
      it('required without value', () => {
        should(Vl.Required({}, 'data')).be.not.equal(null);
      });

      // test for another types
      Object.keys(demoValues)
        .forEach(function(exType){
          it('with '+exType, () => {
            var testres = Vl({ data: demoValues[exType] }, 'data');
            should(testres).be.equal(null);
          });
          it('Required with '+exType, () => {
            var testres = Vl({ data: demoValues[exType] }, 'data');
            should(testres).be.equal(null);
          });
        });
    });
  };

  testAny(123);
  testAny("example");
  testAny(null);
  testAny([]);
  testAny({});
  testAny(function(){});
  testAny(Symbol());


  function testArrayOf(target, testValue) {
    var type = 'arrayOf'
    var Vl = T[type]((T[target]));

    describe(type+'['+target+']: '+ String(typeof testValue[0] !== 'symbol' ? testValue : '[<Symbol>]'), () => {
      it('without value', () => {
        should(Vl({  }, 'data')).be.equal(null);
      });
      it('with value', () => {
        should(Vl({ data: testValue }, 'data')).be.equal(null);
      });

      Object.keys(demoValues)
        .filter(exType => exType !== target)
        .forEach(function(exType){
          it('fail with '+exType, () => {
            var testres = Vl({ data: [demoValues[exType]] }, 'data');
            should(testres).be.not.equal(null);
          });
        });
    });
  }

  testArrayOf('array', [[null], [1,5], ["foo", "bar"], []]);
  testArrayOf('bool', [true, false]);
  testArrayOf('func', [function(){}, console.log]);
  testArrayOf('number', [1,2,3.6, 0, -9]);
  testArrayOf('object', [{}, null, console]);
  testArrayOf('symbol', [Symbol(), Symbol(), Symbol('foo')]);
});
