'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sagarize = undefined;

var _effects = require('redux-saga/effects');

function createWatchSaga(pattern, saga) {
  return regeneratorRuntime.mark(function createWatchSagaReturnFunc() {
    return regeneratorRuntime.wrap(function createWatchSagaReturnFunc$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _effects.takeEvery)(pattern, saga);

          case 2:
          case 'end':
            return _context.stop();
        }
      }
    }, createWatchSagaReturnFunc, this);
  });
}

function spawnSaga(pattern, saga) {
  return (0, _effects.spawn)(createWatchSaga(pattern, saga));
}

/**
 * The sagarize utility helps create sagas which are mapped to the states of the component.
 *
 * Sagas are declared using a basic object which keys reflect the action labels.
 *
 * Example:
 * ```
 * const MySagas = sagarize({
 *   MY_ACTION_1: function* () {
 *     try {
 *       const res = yield call(yield call(fn1, data));
 *
 *       yield all([
 *         put(myAction1),
 *         put(myAction2)
 *       ]);
 *
 *     } catch (err) {
 *       yield put(yield call(fn2, err));
 *     }
 *   },
 *   MY_ACTION_2: function* () {
 *     try {
 *       const res = yield call(yield call(fn3, data));
 *
 *       yield all([
 *         put(myAction3),
 *         put(myAction4)
 *       ]);
 *
 *     } catch (err) {
 *       yield put(yield call(fn4, err));
 *     }
 *   }
 * });
 * ```
 *
 * @param {object} mapActionsToSaga - Key-value pairs of actions to sagas.
 * @return {object} A Saga helper.
 */
var sagarize = exports.sagarize = function sagarize(mapActionsToSaga) {
  var sagas = Object.keys(mapActionsToSaga).map(function (actionKey) {
    var saga = mapActionsToSaga[actionKey];

    if (!saga) {
      throw new Error('Saga utility error: saga not found for action ' + actionKey);
    }

    return spawnSaga(actionKey, saga);
  });

  return regeneratorRuntime.mark(function sagarizeReturnFunc() {
    var _ref;

    for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
      rest[_key] = arguments[_key];
    }

    return regeneratorRuntime.wrap(function sagarizeReturnFunc$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (_ref = []).concat.apply(_ref, [sagas].concat(rest));

          case 2:
          case 'end':
            return _context2.stop();
        }
      }
    }, sagarizeReturnFunc, this);
  });
};

exports.default = {
  sagarize: sagarize
};