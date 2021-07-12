import { applyMiddleware, compose, createStore, combineReducers, Store } from 'redux'
import { reducers } from './reducer'
import Reactotron from './ReactotronConfig'
import createSagaMiddleware from 'redux-saga';
import mySaga from './sagas';
import { createReducerManager, runSaga, setRunSaga } from 'use-redux-saga';

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

setRunSaga(sagaMiddleware.run);

// createSagaManager(sagaMiddleware.run, mySaga);

// then run the saga
sagaMiddleware.run(mySaga);


export default store;
