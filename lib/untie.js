const UnTypes = {
  array: createPrimitiveTypeChecker('array'),
  bool: createPrimitiveTypeChecker('boolean'),
  func: createPrimitiveTypeChecker('function'),
  number: createPrimitiveTypeChecker('number'),
  object: createPrimitiveTypeChecker('object'),
  string: createPrimitiveTypeChecker('string'),
  symbol: createPrimitiveTypeChecker('symbol'),

  any: createAnyTypeChecker(),
  arrayOf: createArrayOfTypeChecker,
  objectOf: createObjectOfTypeChecker,
  oneOf: createEnumTypeChecker,
  oneOfType: createUnionTypeChecker,
  shape: createShapeTypeChecker,
};

function is(x, y) {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  }
  else {
    return x !== x && y !== y;
  }
}

function createChainableTypeChecker(validate) {
  function checkType(isRequired, props, propName, propFullName) {
    propFullName = propFullName || propName;

    if (props[propName] == null) {
      if (isRequired) {
        return new Error(
          `Required property \`${propFullName}\` was not specified.`
        );
      }
      return null;
    }
    else {
      return validate(
        props,
        propName,
        propFullName
      );
    }
  }

  var chainedCheckType = checkType.bind(null, false);
  chainedCheckType.Required = checkType.bind(null, true);

  return chainedCheckType;
}

function createPrimitiveTypeChecker(expectedType) {
  function validate(props, propName, propFullName) {
    var propValue = props[propName];
    var propType = getPropType(propValue);

    if (propType !== expectedType) {
      var preciseType = getPreciseType(propValue);

      return new Error(
        `Invalid property \`${propFullName}\` of type ` +
        `\`${preciseType}\`, expected ` +
        `\`${expectedType}\`.`
      );
    }
    return null;
  }

  return createChainableTypeChecker(validate);
}

function createAnyTypeChecker() {
  return createChainableTypeChecker(() => null);
}

function createArrayOfTypeChecker(typeChecker) {
  function validate(props, propName, propFullName) {
    if (typeof typeChecker !== 'function') {
      return new Error(
        `Property \`${propFullName}\` has invalid PropType notation inside arrayOf.`
      );
    }

    var propValue = props[propName];

    if (!Array.isArray(propValue)) {
      var propType = getPropType(propValue);
      return new Error(
        `Invalid property \`${propFullName}\` of type ` +
        `\`${propType}\`, expected an array.`
      );
    }

    for (var i = 0; i < propValue.length; i++) {
      var error = typeChecker(
        propValue,
        i,
        `${propFullName}[${i}]`
      );
      if (error instanceof Error) {
        return error;
      }
    }
    return null;
  }

  return createChainableTypeChecker(validate);
}

function createEnumTypeChecker(expectedValues) {
  if (!Array.isArray(expectedValues)) {
    //warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.');
    return () => null;
  }

  function validate(props, propName, propFullName) {
    var propValue = props[propName];

    for (var i = 0; i < expectedValues.length; i++) {
      if (is(propValue, expectedValues[i])) {
        return null;
      }
    }

    var valuesString = JSON.stringify(expectedValues);

    return new Error(
      `Invalid property \`${propFullName}\` of value \`${propValue}\`, ` +
      `expected one of ${valuesString}.`
    );
  }

  return createChainableTypeChecker(validate);
}

function createObjectOfTypeChecker(typeChecker) {
  function validate(props, propName, propFullName) {
    if (typeof typeChecker !== 'function') {
      return new Error(
        `Property \`${propFullName}\` has invalid PropType notation inside objectOf.`
      );
    }

    var propValue = props[propName];
    var propType = getPropType(propValue);

    if (propType !== 'object') {
      return new Error(
        `Invalid property \`${propFullName}\` of type ` +
        `\`${propType}\`, expected an object.`
      );
    }

    for (var key in propValue) {
      if (propValue.hasOwnProperty(key)) {
        var error = typeChecker(
          propValue,
          key,
          `${propFullName}.${key}`
        );
        if (error instanceof Error) {
          return error;
        }
      }
    }
    return null;
  }

  return createChainableTypeChecker(validate);
}

function createUnionTypeChecker(arrayOfTypeCheckers) {
  if (!Array.isArray(arrayOfTypeCheckers)) {
    //warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.');
    return () => null;
  }

  function validate(props, propName, propFullName) {
    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (
        checker(
          props,
          propName,
          propFullName
        ) == null
      ) {
        return null;
      }
    }

    return new Error(
      `Invalid property \`${propFullName}\`.`
    );
  }
  return createChainableTypeChecker(validate);
}

function createShapeTypeChecker(shapeTypes) {
  function validate(props, propName, propFullName) {
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== 'object') {
      return new Error(
        `Invalid property \`${propFullName}\` of type \`${propType}\`, expected \`object\`.`
      );
    }
    for (var key in shapeTypes) {
      var checker = shapeTypes[key];
      if (!checker) {
        continue;
      }
      var error = checker(
        propValue,
        key,
        `${propFullName}.${key}`
      );
      if (error) {
        return error;
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function isSymbol(propType, propValue) {
  if (propType === 'symbol') {
    return true;
  }

  // Symbol.prototype[@@toStringTag] === 'Symbol'
  if (propValue['@@toStringTag'] === 'Symbol') {
    return true;
  }
  if (typeof Symbol === 'function' && propValue instanceof Symbol) {
    return true;
  }

  return false;
}

function getPropType(propValue) {
  var propType = typeof propValue;

  if (Array.isArray(propValue)) {
    return 'array';
  }
  if (propValue instanceof RegExp) {
    return 'object';
  }
  if (isSymbol(propType, propValue)) {
    return 'symbol';
  }
  return propType;
}

function getPreciseType(propValue) {
  var propType = getPropType(propValue);

  if (propType === 'object') {
    if (propValue instanceof Date) {
      return 'date';
    } else if (propValue instanceof RegExp) {
      return 'regexp';
    }
  }
  return propType;
}

/**
 * Class for implement custom validators
 */
var Validator = (function() {
  function Validator() {
    if (!(this instanceof Validator)) throw new TypeError("Cannot call a class as a function");
  }

  Validator.validate = function(data) {
    var keys = Object.keys(this.schema);

    for (var kid in keys) {
      var propName = keys[kid];
      var validator = this.schema[propName];

      if (!validator) throw new TypeError(`Validator for \`${propName}\` is not specified.`);

      var result = validator(data, propName, propName);
      if (result) return result;
    }

    return false;
  }

  return Validator;
})();

function createValidator(schema) {
  var newValidator = {
    schema: schema,
  };

  Object.getOwnPropertyNames(Validator)
    .filter(function (prop) { return typeof Validator[prop] === 'function'; })
    .forEach(function (method) { newValidator[method] = Validator[method].bind(newValidator); });

  return newValidator;
}


module.exports = {
  default: Validator,
  Validator: Validator,
  Type: UnTypes,
  createValidator: createValidator,
};
