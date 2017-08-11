import { takeEvery, spawn } from 'redux-saga/effects';

function createWatchSaga(pattern, saga) {
  return function* createWatchSagaReturnFunc() {
    yield takeEvery(pattern, saga);
  };
}

function spawnSaga(pattern, saga) {
  return spawn(createWatchSaga(pattern, saga));
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
export const sagarize = (mapActionsToSaga) => {
  const sagas = Object.keys(mapActionsToSaga).map((actionKey) => {
    const saga = mapActionsToSaga[actionKey];

    if (!saga) {
      throw new Error(`Saga utility error: saga not found for action ${actionKey}`);
    }

    return spawnSaga(actionKey, saga);
  });

  return function* sagarizeReturnFunc(...rest) {
    yield [].concat(sagas, ...rest);
  };
};

export default {
  sagarize,
};
