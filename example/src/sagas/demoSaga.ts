import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

function* testingFunc(action:any) {
   console.log('testing User')
}

function* demoSaga() {
  yield takeLatest("demoSaga_action", testingFunc);
}


export default demoSaga;