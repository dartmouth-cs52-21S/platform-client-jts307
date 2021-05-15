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
};

// urls used for fetching from servers
// const ROOT_URL = 'https://platform.cs52.me/api';
// const ROOT_URL = 'http://localhost:9090/api';
const ROOT_URL = 'https://shiitakeposts.herokuapp.com/api';
const API_KEY = '?key=jacob_werzinsky';

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
    axios.post(`${ROOT_URL}/posts${API_KEY}`, post)
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
    // sending updated post to database for update
    axios.put(`${ROOT_URL}/posts/${post.id}${API_KEY}`, post)
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
    axios.delete(`${ROOT_URL}/posts/${id}${API_KEY}`)
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
      title: '', coverUrl: '', content: '', tags: '', id: '',
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
