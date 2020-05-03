import { all } from 'redux-saga/effects';
import { appSaga } from '../containers/Main/saga';

export default function* rootSaga() {
  yield all([...appSaga]);
}
