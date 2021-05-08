import { ActionTypes } from '../actions';

const initialState = {
  all: [],
  current: {},
};

const PostsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_POSTS:
      // reseting 'current' and updating 'all' with newly fetched posts
      return { current: { ...initialState.current }, all: action.payload };
    case ActionTypes.FETCH_POST:
      // updating 'current' with newly fetched post and reseting 'all'
      return { current: action.payload, all: [...initialState.all] };
    case ActionTypes.EDIT_POST_LOCALLY:
      // updating 'current' with passed in properties and keeping 'all' the same
      return { current: { ...state.current, ...action.payload }, all: [...state.all] };
    case ActionTypes.SEARCH_POSTS:
      // keeping 'current' the same and updating 'all' based on tag filtered posts
      return { current: { ...state.current }, all: action.payload };
    case ActionTypes.RESET_CURRENT_POST:
      // giving 'current' empty property values and keeping 'all' the same
      return { current: action.payload, all: [...state.all] };
    default:
      return state;
  }
};

export default PostsReducer;
