import { combineReducers } from 'redux';
import appReducer from 'containers/Main/reducer';
import projectReducer from 'containers/Projects/reducer';

const rootReducers = combineReducers({
  app: appReducer,
  project: projectReducer,
});

export default rootReducers;
