import { combineReducers } from 'redux';
import appReducer from 'containers/Main/reducer';

const rootReducers = combineReducers({
  app: appReducer,
});

export default rootReducers;
