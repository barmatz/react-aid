'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('./redux');

var _redux2 = _interopRequireDefault(_redux);

var _saga = require('./saga');

var _saga2 = _interopRequireDefault(_saga);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  redux: _redux2.default,
  saga: _saga2.default
};