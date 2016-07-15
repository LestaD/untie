# Readme

Untie is a simple validator for JS-objects.


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
  const error = UserValidator.validate(req.body);

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
