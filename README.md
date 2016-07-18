# Readme

[![GitHub stars](https://img.shields.io/github/stars/lestad/untie.svg)](https://github.com/lestad/untie/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/lestad/untie.svg)](https://github.com/lestad/untie/network)
[![npm](https://img.shields.io/npm/dm/untie.svg?maxAge=2592000)](https://npmjs.com/untie)
[![GitHub issues](https://img.shields.io/github/issues/lestad/untie.svg?maxAge=2592000)]()
[![Maintainer](https://img.shields.io/badge/maintainer-lestad-blue.svg)](https://lestad.top)

Untie is a simple validator for JS-objects.

[![Code Climate](https://codeclimate.com/github/LestaD/untie/badges/gpa.svg)](https://codeclimate.com/github/LestaD/untie)
[![Test Coverage](https://codeclimate.com/github/LestaD/untie/badges/coverage.svg)](https://codeclimate.com/github/LestaD/untie/coverage)
[![Issue Count](https://codeclimate.com/github/LestaD/untie/badges/issue_count.svg)](https://codeclimate.com/github/LestaD/untie)
[![Build Status](https://travis-ci.org/LestaD/untie.svg?branch=master)](https://travis-ci.org/LestaD/untie)
[![David](https://img.shields.io/david/dev/lestad/untie.svg?maxAge=2592000)]()

## Usage

```js
const { Type, Validator } = require('untie');

const input = {
  user: {
    id: 13,
    nickname: 500,
    profile: {
      firtname: 'Sergey',
      lastname: 'Sova',
    },
  },
};

class UserValidator extends Validator {
  static schema = {
    id: Type.number.Required,
    name: Type.string.Required,
    profile: Type.shape({
      firstname: string,
      lastname: string,
    }),
  };
}

console.log(UserValidator.validate(input));
```

### Simple docs

`validate` method returns:
- `null` if passed document is valid.
- `Error` if document has errors.
- object of `Error`s if document nested fields has errors.


## Installation


[![NPM](https://nodei.co/npm/untie.png?compact=true)](https://nodei.co/npm/untie/)

[![Minimum node](https://img.shields.io/badge/engines-node%20%3E%3D%204-green.svg)](https://github.com/LestaD/untie/blob/master/package.json)

```bash
npm install --save untie
```


### Usage with Express


> validators/user.js

```js
const { Type, Validator } = require('untie');

module.exports =
class UserValidator extends Validator {
  static schema = {
    login: Type.string.Required,
    email: Type.string.Required,
    password(dataObject, property) {
      const value = dataObject[property];

      if (typeof value !== 'string') {
        return new Error('Invalid property `password`, expected type `string`');
      }

      if (value.length < 8) {
        return new Error(`Property password must be 8 symbols minimum.`);
      }
    }
  };
}
```

for Node < v6

```js
var untie = require('untie');

module.exports = untie.createValidator({
  login: untie.Type.string.Required,
  email: untie.Type.string.Required,
  password: function(dataObject, property) {
    var value = dataObject[property];

    if (typeof value !== 'string') {
      return new Error('Invalid property `password`, expected type `string`');
    }

    if (value.length < 8) {
      return new Error('Property password must be 8 symbols minimum.');
    }
  }
});
```


> routes/register.js

```js
const UserValidator = require('validators/user');

module.exports = function register(req, res, next) {
  const error = UserValidator.validate(req.body); // return null or error object

  if (error) {
    return next(error);
  }

  // create user model and save
  req.status(201).json({ user: req.body.user });
}
```

## Validators

- array
- bool
- func
- number
- object
- string
- symbol

- any
- arrayOf
- objectOf
- oneOf
- OneOfType
- shape


## More examples

```js
const {
  array,
  bool,
  func,
  number,
  object,
  string,
  symbol,

  any,
  arrayOf,
  objectOf,
  oneOf,
  OneOfType,
  shape,
} = require('untie').Type;


const exampleValidationSchema = {
  optionalArray: array,
  optionalBool: bool,
  optionalFunc: func,
  optionalNumber: number,
  optionalObject: object,
  optionalString: string,
  optionalSymbol: symbol,

  optionalAnyValue: any,

  // Value must one of that values
  optionalEnum: oneOf(['hello', 'world', 'foo', 'bar']),

  // Value must correspond one of type
  optionalUnion: oneOfType([string, number, bool, object, arrayOf(string)]),

  // each item in array must be a number
  optionalNumbersArray: arrayOf(number),

  // Value of each key must be function
  optionalMethods: objectOf(func),

  // Object must correspond defined struct
  optionalPlayer: shape({
    name: string,
    lifes: number,
    uid: number,
  }),

  // That method must be defined
  requiredFunc: func.Required,

  // Should be passed any value
  requiredAny: any.Required,

  customProperty: function(dataObject, property) {
    if (dataObject[property] >= 1200) {
      return new Error('Custom property must be more than 1199.');
    }
  },

  // Required all props in required shape
  requiredShape: shape.Required({
    target: number.Required,
    amount: number.Required,
    message: string.Required,
  }),
};

```
