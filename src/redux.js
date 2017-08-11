import connect from 'react-redux';

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
export const containerizer = (component) => {
  const helper = {
    mapStateToProps: (callback) => { helper.mapStateToProps = callback; return helper; },
    mapDispatchToProps: (callback) => { helper.mapDispatchToProps = callback; return helper; },
    mergeProps: (callback) => { helper.mergeProps = callback; return helper; },
    options: (options) => { helper.options = options; return helper; },
    connect: () => {
      const { mapStateToProps, mapDispatchToProps, mergeProps, options } = helper;

      return connect(mapStateToProps, mapDispatchToProps, mergeProps, options)(component);
    },
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
export const reducer = (mapActionsToState) => {
  const helper = {
    setName: (name) => { helper.name = name; return helper; },
    setDefaultState: (state) => { helper.defaultState = state; return helper; },
    reduce: () => (state, action) => {
      const { name, defaultState } = helper
          , actionsToStateMap = mapActionsToState || {}
          , finalState = state || defaultState || {};

      let actionState = actionsToStateMap[action.type];

      if (typeof actionState === 'function') {
        actionState = actionState(finalState, action);
      } else if (!actionState) {
        console.warn(`Reducer utility: no state found for action type ${action.type} in ${name
          ? `reducer ${name}`
          : 'unknown reducer (use reducer.setName() to give your reducer a name)'}` +
          ', reverting to default state');
      }

      return actionState ? { ...finalState, ...actionState } : finalState;
    },
  };

  return helper;
};
