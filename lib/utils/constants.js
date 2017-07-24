const isNumber = require('is-number');

// definition from solvespace.h:119
exports.ANGLE_COS_EPS = isNumber(Number(process.env.ANGLE_COS_EPS)) ?
  Number(process.env.ANGLE_COS_EPS) :
  1e-6;

// definition from solvespace.h:120
exports.LENGTH_EPS = isNumber(Number(process.env.LENGTH_EPS)) ?
  Number(process.env.LENGTH_EPS) :
  1e-6;

// definition from solvespace.h:121
exports.VERY_POSITIVE = isNumber(Number(process.env.VERY_POSITIVE)) ?
  Number(process.env.VERY_POSITIVE) :
  1e10;

// definition from solvespace.h:122
exports.VERY_NEGATIVE = isNumber(Number(process.env.VERY_NEGATIVE)) ?
  Number(process.env.VERY_NEGATIVE) :
  1e-10;
