import { ActionTypes } from '../actions';

const initialState = {
  status: null,
};

// updating global state with error or clearing it accordingly
const ErrorReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ERROR_SET:
      return { status: action.error };
    case ActionTypes.ERROR_CLEAR:
      return { status: null };
    default:
      return state;
  }
};

export default ErrorReducer;
