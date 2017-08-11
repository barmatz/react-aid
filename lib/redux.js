'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reducer = exports.containerizer = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reactRedux = require('react-redux');

var _reactRedux2 = _interopRequireDefault(_reactRedux);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The containerizer utility helps connect a React component to a Redux store.
 *
 * First you will have to initialize the container by calling the constructor and passing it your
 * component.
 * ```
 * containerizer(MyComponent)
 * ```
 *
 * The constructor will return a container helper which will allow you to set the `mapStateToProps`,
 * `mapDispatchToProps`,
 * and `mergeProps` handlers, as well as an `options` object. Note: the mapping methods return the
 * instance of the helper so you
 * can chain your actions. Finally, you should establish the connection by calling the `connect`
 * helper.
 *
 * ```
 * containerizer(MyComponent)
 *   .mapStateToProps(...)
 *   .mapDispatchToProps(...)
 *   .mergeProps(...)
 *   .options({...})
 *   .connect()
 * ```
 *
 * Methods:
 * `containerizer(component)`
 * `mapStateToProps(state, [ownProps])`
 * `mapDispatchToProps(dispatch, [ownProps])`
 * `mergeProps(stateProps, dispatchProps, ownProps)`
 * `connect()`
 *
 * The mapping methods each accept a single callback which is in-line with the Redux handlers.
 * @see https://github.com/reactjs/react-redux/blob/master/docs/api.md
 *
 * Example:
 * ```
 * function MyComponent(props) (
 *   <div>{props.myProperty}</div>
 * )
 *
 * containerizer(MyComponent)
 *  .mapStateToProps((state) => {
 *    return {
 *      myProperty: state.myProperty
 *    };
 *  })
 *  .mapDispatchToProps((dispatch) => {
 *    return {
 *      onMyEvent: () => dispatch(myAction())
 *    };
 *  })
 *  .connect()
 * ```
 *
 * @param  {object} component - React component that will be connected to the Redux store.
 * @return {object} Container helper.
 *
 */
var containerizer = exports.containerizer = function containerizer(component) {
  var helper = {
    mapStateToProps: function mapStateToProps(callback) {
      helper.mapStateToProps = callback;return helper;
    },
    mapDispatchToProps: function mapDispatchToProps(callback) {
      helper.mapDispatchToProps = callback;return helper;
    },
    mergeProps: function mergeProps(callback) {
      helper.mergeProps = callback;return helper;
    },
    options: function options(_options) {
      helper.options = _options;return helper;
    },
    connect: function connect() {
      var mapStateToProps = helper.mapStateToProps,
          mapDispatchToProps = helper.mapDispatchToProps,
          mergeProps = helper.mergeProps,
          options = helper.options;


      return (0, _reactRedux2.default)(mapStateToProps, mapDispatchToProps, mergeProps, options)(component);
    }
  };

  return helper;
};

/**
 * The reducer utility helps create a Redux reducer with a set of states mapped to its actions.
 *
 * States are declared using a basic object which keys reflect the action labels.
 * A default state can be defined using the `setDefaultState` method.
 * Once you are finished defining your reducer execute the `reduce` method that returns the actual
 * reducer.
 *
 * Methods:
 * `reducer(mapActionsToState)`
 * `setDefaultState(state)`
 * `setName(name)`
 * `reduce()`
 *
 * Note: States can either be key/value pairs or a function that returns key/value pairs.
 *
 * Example:
 * ```
 * const MyReducer = reducer({
 *    myAction1: {...},
 *    myAction2: (state, action) => ({...})
 *  })
 *  .setName('MyReducer')
 *  .setDefaultState({...})
 *  .reduce()
 * ```
 *
 * @param {object} mapActionsToState - Key-value pairs of actions to states.
 * @return {object} Reducer helper.
 */
var reducer = exports.reducer = function reducer(mapActionsToState) {
  var helper = {
    setName: function setName(name) {
      helper.name = name;return helper;
    },
    setDefaultState: function setDefaultState(state) {
      helper.defaultState = state;return helper;
    },
    reduce: function reduce() {
      return function (state, action) {
        var name = helper.name,
            defaultState = helper.defaultState,
            actionsToStateMap = mapActionsToState || {},
            finalState = state || defaultState || {};


        var actionState = actionsToStateMap[action.type];

        if (typeof actionState === 'function') {
          actionState = actionState(finalState, action);
        } else if (!actionState) {
          console.warn('Reducer utility: no state found for action type ' + action.type + ' in ' + (name ? 'reducer ' + name : 'unknown reducer (use reducer.setName() to give your reducer a name)') + ', reverting to default state');
        }

        return actionState ? _extends({}, finalState, actionState) : finalState;
      };
    }
  };

  return helper;
};