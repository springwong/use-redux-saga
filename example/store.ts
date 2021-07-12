import { applyMiddleware, compose, createStore, combineReducers, Store } from 'redux'
import rootReducer, { reducers } from './reducer'
import Reactotron from './ReactotronConfig'
import createSagaMiddleware from 'redux-saga';
import mySaga from './sagas';
import { cancel } from 'redux-saga/effects';
import { createReducerManager, createSagaManager, runSaga, setRunSaga } from 'use-redux-saga';

// create our new saga monitor
const sagaMonitor = Reactotron.createSagaMonitor!()

// create the saga middleware
const sagaMiddleware = createSagaMiddleware({
  sagaMonitor
});

const store: Store = createStore(combineReducers(reducers),
  // applyMiddleware(sagaMiddleware)
  // Reactotron ? Reactotron.createEnhancer!(): undefined
  compose(applyMiddleware(sagaMiddleware), Reactotron.createEnhancer!())
)

createReducerManager(reducers)

// // Add a dictionary to keep track of the registered async reducers
// store.asyncReducers = {}

// // Create an inject reducer function
// // This function adds the async reducer, and creates a new combined reducer
// store.injectReducer = (key, asyncReducer) => {
//   store.asyncReducers[key] = asyncReducer
//   store.replaceReducer(createReducer(store.asyncReducers))
// }

// function createReducer(asyncReducers: any) {
//     return combineReducers({
//       ...reducers,
//       ...asyncReducers
//     })
//   }


setRunSaga(sagaMiddleware.run);

// createSagaManager(sagaMiddleware.run, mySaga);

// then run the saga
sagaMiddleware.run(mySaga);


export default store;
