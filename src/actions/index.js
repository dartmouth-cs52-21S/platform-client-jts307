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

// used for fetching from server
const ROOT_URL = 'https://platform.cs52.me/api';
const API_KEY = '?key=jacob_werzinsky';

// example from lab assignment page
export function fetchPosts() {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/posts${API_KEY}`)
      .then((response) => {
        dispatch({ type: ActionTypes.FETCH_POSTS, payload: response.data });
      })
      .catch((error) => {
        dispatch({ type: ActionTypes.ERROR_SET, error });
      });
  };
}
export function createPost(post, history) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/posts${API_KEY}`, post)
      .then((response) => {
        history.push('/');
        dispatch({ type: ActionTypes.FETCH_POST, payload: response.data });
      })
      .catch((error) => {
        dispatch({ type: ActionTypes.ERROR_SET, error });
      });
  };
}
export function updatePost(post) {
  return (dispatch) => {
    axios.put(`${ROOT_URL}/posts/${post.id}${API_KEY}`, post)
      .then((response) => {
        dispatch({ type: ActionTypes.FETCH_POST, payload: response.data });
      })
      .catch((error) => {
        dispatch({ type: ActionTypes.ERROR_SET, error });
      });
  };
}
export function fetchPost(id) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/posts/${id}${API_KEY}`)
      .then((response) => {
        dispatch({ type: ActionTypes.FETCH_POST, payload: response.data });
      })
      .catch((error) => {
        dispatch({ type: ActionTypes.ERROR_SET, error });
      });
  };
}
export function deletePost(id, history) {
  return (dispatch) => {
    axios.delete(`${ROOT_URL}/posts/${id}${API_KEY}`)
      .then((response) => {
        history.push('/');
        dispatch({ type: ActionTypes.FETCH_POST, payload: response.data });
      })
      .catch((error) => {
        dispatch({ type: ActionTypes.ERROR_SET, error });
      });
  };
}
export function editPostLocally(newPost) {
  return { type: ActionTypes.EDIT_POST_LOCALLY, payload: newPost };
}
export function searchTags(tags) {
  return (dispatch, getState) => {
    axios.get(`${ROOT_URL}/posts${API_KEY}`)
      .then((response) => {
        dispatch({ type: ActionTypes.FETCH_POSTS, payload: response.data });
        let newPosts = getState().posts.all;
        console.log(newPosts);
        console.log('---------');
        tags.split(' ').forEach((tag) => {
          if (tag !== '') {
            newPosts = newPosts.filter((post) => {
              console.log(post.tags);
              console.log(post.tags.includes(tag.trim()));
              return post.tags.includes(tag.trim());
            });
          }
        });
        console.log(newPosts);
        dispatch({ type: ActionTypes.SEARCH_POSTS, payload: newPosts });
      })
      .catch((error) => {
        dispatch({ type: ActionTypes.ERROR_SET, error });
      });
  };
}
export function resetCurrentPost() {
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
