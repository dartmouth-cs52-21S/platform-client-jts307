// the starting point for your redux store
// this defines what your store state will look like
import { combineReducers } from 'redux';
import ErrorReducer from './error-reducer';
import PostsReducer from './posts-reducer';

const rootReducer = combineReducers({
  posts: PostsReducer,
  error: ErrorReducer,
});

export default rootReducer;
