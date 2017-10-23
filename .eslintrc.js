module.exports = {
  "extends": "airbnb-base",
  "plugins": [
    "import",
    "let-and-var",
  ],
  "rules": {
    "prefer-const": 2,
    "no-var": 0,
    "let-and-var/scopes": 2,

    // https://github.com/airbnb/javascript/blob/811392725efde953d8126ed22c3b475e4f8b3ea9/packages/eslint-config-airbnb-base/rules/errors.js#L3-L10
    // require trailing commas in multiline object literals
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      // functions: 'always-multiline',
    }],

    // https://github.com/airbnb/javascript/blob/811392725efde953d8126ed22c3b475e4f8b3ea9/packages/eslint-config-airbnb-base/rules/best-practices.js#L191-L207
    // disallow certain object properties
    // http://eslint.org/docs/rules/no-restricted-properties
    'no-restricted-properties': ['error', {
      object: 'arguments',
      property: 'callee',
      message: 'arguments.callee is deprecated',
    }, {
      property: '__defineGetter__',
      message: 'Please use Object.defineProperty instead.',
    }, {
      property: '__defineSetter__',
      message: 'Please use Object.defineProperty instead.',
    }, /*{
      object: 'Math',
      property: 'pow',
      message: 'Use the exponentiation operator (**) instead.',
    }*/],
    'no-param-reassign': 1,
  }
};
