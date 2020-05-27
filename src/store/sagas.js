import { all } from 'redux-saga/effects';
import { appSaga } from '../containers/Main/saga';
import { saga as projectSaga } from '../containers/Projects/saga';
import { projectDetailSaga } from '../containers/ProjectDetail/saga';
import { authSaga } from '../containers/Auth/saga';

export default function* rootSaga() {
  yield all([...appSaga, ...projectSaga, ...projectDetailSaga, ...authSaga]);
}
