import axios from 'axios';

// keys for actiontypes
export const ActionTypes = {
  FETCH_POSTS: 'FETCH_POSTS',
  FETCH_POST: 'FETCH_POST',
  ERROR_SET: 'ERROR_SET',
  ERROR_CLEAR: 'ERROR_CLEAR',
  EDIT_POST_LOCALLY: 'EDIT_POST_LOCALLY',
  RESET_CURRENT_POST: 'RESET_CURRENT_POST',
  SEARCH_POSTS: 'SEARCH_POSTS',
  AUTH_USER: 'AUTH_USER',
  DEAUTH_USER: 'DEAUTH_USER',
  AUTH_ERROR: 'AUTH_ERROR',
};

// urls used for fetching from servers
// export const ROOT_URL = 'https://platform.cs52.me/api';
// export const ROOT_URL = 'http://localhost:9090/api';
export const ROOT_URL = 'https://shiitakeposts.herokuapp.com/api';
export const API_KEY = '?key=jacob_werzinsky';

// used example from lab assignment page
export function fetchPosts() {
  return (dispatch) => {
    // getting list of posts from database
    axios.get(`${ROOT_URL}/posts${API_KEY}`)
      .then((response) => {
        // dispatching action with post data
        dispatch({ type: ActionTypes.FETCH_POSTS, payload: response.data });
      })
      .catch((error) => {
        // dispatching action with error data if failure
        dispatch({ type: ActionTypes.ERROR_SET, error });
      });
  };
}
export function createPost(post, history) {
  return (dispatch) => {
    // sending newly created post to server
    axios.post(`${ROOT_URL}/posts${API_KEY}`, post, { headers: { authorization: localStorage.getItem('token') } })
      .then((response) => {
        // going to home page and dispatching action with returned new post data
        history.push('/');
        dispatch({ type: ActionTypes.FETCH_POST, payload: response.data });
      })
      .catch((error) => {
        // dispatching action with error data if failure
        dispatch({ type: ActionTypes.ERROR_SET, error });
      });
  };
}
export function updatePost(post) {
  return (dispatch) => {
    // deleting author property because it causes issues if I leave it in
    const postWithoutAuthor = { ...post };
    delete postWithoutAuthor.author;
    // sending updated post to database for update
    axios.put(`${ROOT_URL}/posts/${post.id}${API_KEY}`, postWithoutAuthor, { headers: { authorization: localStorage.getItem('token') } })
      .then((response) => {
        // dispatching an action with returned updated post data
        dispatch({ type: ActionTypes.FETCH_POST, payload: response.data });
      })
      .catch((error) => {
        // dispatching action with error data if failure
        dispatch({ type: ActionTypes.ERROR_SET, error });
      });
  };
}
export function fetchPost(id) {
  return (dispatch) => {
    // getting data for a specific post from database
    axios.get(`${ROOT_URL}/posts/${id}${API_KEY}`)
      .then((response) => {
        // dispatching action with post data
        dispatch({ type: ActionTypes.FETCH_POST, payload: response.data });
      })
      .catch((error) => {
        // dispatching action with error data if failure
        dispatch({ type: ActionTypes.ERROR_SET, error });
      });
  };
}
export function deletePost(id, history) {
  return (dispatch) => {
    // sending a request to delete post from database
    axios.delete(`${ROOT_URL}/posts/${id}${API_KEY}`, { headers: { authorization: localStorage.getItem('token') } })
      .then((response) => {
        // going to home page and dispatching action with returned post data
        history.push('/');
        dispatch({ type: ActionTypes.FETCH_POST, payload: response.data });
      })
      .catch((error) => {
        // dispatching action with error data if failure
        dispatch({ type: ActionTypes.ERROR_SET, error });
      });
  };
}
export function editPostLocally(newPost) {
  // dispatching action with post data
  return { type: ActionTypes.EDIT_POST_LOCALLY, payload: newPost };
}
export function resetCurrentPost() {
  // dispatching action with empty post
  return {
    type: ActionTypes.RESET_CURRENT_POST,
    payload: {
      title: '', coverUrl: '', content: '', tags: '',
    },
  };
}
export function errorClear() {
  return { type: ActionTypes.ERROR_CLEAR };
}
// fetching list of posts from database and filtering it by a list of tags
// supplied by the user in the search bar
export function searchTags(tags) {
  return (dispatch) => {
    // getting updated list of posts data from database
    axios.get(`${ROOT_URL}/posts${API_KEY}`)
      .then((response) => {
        // getting the posts after the update
        let newPosts = response.data;
        // looping through searched tags word by word
        tags.split(' ').forEach((tag) => {
          if (tag !== '') {
            // filtering out all posts that do not contain each word
            newPosts = newPosts.filter((post) => {
              return post.tags.toLowerCase().includes(
                tag.trim().toLowerCase(),
              );
            });
          }
        });
        // dispatching an action with the filtered posts data
        dispatch({ type: ActionTypes.SEARCH_POSTS, payload: newPosts });
      })
      .catch((error) => {
        // dispatching action with error data if failure
        dispatch({ type: ActionTypes.ERROR_SET, error });
      });
  };
}

// trigger to deauth if there is error
// can also use in your error reducer if you have one to display an error message
// I moved the error message to my error component to be displayed
export function authError() {
  return {
    type: ActionTypes.AUTH_ERROR,
  };
}

export function signinUser({ email, password }, history) {
  // takes in an object with email and password (minimal user object)
  // returns a thunk method that takes dispatch as an argument (just like our create post method really)
  return (dispatch) => {
    // does an axios.post on the /signin endpoint
    axios.post(`${ROOT_URL}/signin${API_KEY}`, { email, password })
      // on success does:
      .then((response) => {
        history.push('/');
        dispatch({ type: ActionTypes.AUTH_USER });
        localStorage.setItem('token', response.data.token);
      })
      .catch((error) => {
        // dispatching action with error data if failure
        dispatch(authError());
        dispatch({ type: ActionTypes.ERROR_SET, error });
      });
  };
}

export function signupUser({ email, password, username }, history) {
  // takes in an object with email and password (minimal user object)
  // returns a thunk method that takes dispatch as an argument (just like our create post method really)
  return (dispatch) => {
    // does an axios.post on the /signup endpoint (only difference from above)
    axios.post(`${ROOT_URL}/signup${API_KEY}`, { email, password, username })
      // on success does:
      .then((response) => {
        history.push('/');
        dispatch({ type: ActionTypes.AUTH_USER });
        localStorage.setItem('token', response.data.token);
      })
      .catch((error) => {
        // dispatching action with error data if failure
        dispatch(authError());
        dispatch({ type: ActionTypes.ERROR_SET, error });
      });
  };
}

// deletes token from localstorage
// and deauths
export function signoutUser(history) {
  return (dispatch) => {
    history.push('/');
    localStorage.removeItem('token');
    dispatch({ type: ActionTypes.DEAUTH_USER });
  };
}
