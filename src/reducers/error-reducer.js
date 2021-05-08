import { ActionTypes } from '../actions';

const initialState = {
  status: null,
};

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
