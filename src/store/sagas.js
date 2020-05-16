import { all } from 'redux-saga/effects';
import { appSaga } from '../containers/Main/saga';
import { saga as projectSaga } from '../containers/Projects/saga';

export default function* rootSaga() {
  yield all([...appSaga, ...projectSaga]);
}
