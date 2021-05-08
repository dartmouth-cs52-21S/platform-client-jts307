import { ActionTypes } from '../actions';

const initialState = {
  all: [],
  current: {},
};

const PostsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_POSTS:
      return { current: { ...initialState.current }, all: action.payload };
    case ActionTypes.FETCH_POST:
      return { current: action.payload, all: [...initialState.all] };
    case ActionTypes.EDIT_POST_LOCALLY:
      return { current: { ...state.current, ...action.payload }, all: [...state.all] };
    case ActionTypes.SEARCH_POSTS:
      return { current: { ...state.current }, all: action.payload };
    case ActionTypes.RESET_CURRENT_POST:
      return { current: action.payload, all: [...state.all] };
    default:
      return state;
  }
};

export default PostsReducer;
