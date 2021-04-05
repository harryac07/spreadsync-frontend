import { combineReducers } from 'redux';
import appReducer from 'containers/Main/reducer';
import projectReducer from 'containers/Projects/reducer';
import jobReducer from 'containers/ProjectJobDetails/reducer';
import projectDetailReducer from 'containers/ProjectDetail/reducer';
import authReducer from 'containers/Auth/reducer';

const rootReducers = combineReducers({
  app: appReducer,
  project: projectReducer,
  projectDetail: projectDetailReducer,
  auth: authReducer,
  job: jobReducer
});

export default rootReducers;
