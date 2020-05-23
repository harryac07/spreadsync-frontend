import { combineReducers } from 'redux';
import appReducer from 'containers/Main/reducer';
import projectReducer from 'containers/Projects/reducer';
import projectDetailReducer from 'containers/ProjectDetail/reducer';

const rootReducers = combineReducers({
  app: appReducer,
  project: projectReducer,
  projectDetail: projectDetailReducer,
});

export default rootReducers;
