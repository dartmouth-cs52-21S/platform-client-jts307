/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import TextareaAutosize from 'react-textarea-autosize';
import { isEmptyObject } from 'jquery';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/themes/theme-blue.css';
import { withRouter } from 'react-router-dom';
import { motion } from 'framer-motion';
import uploadImage from '../s3';
import {
  fetchPost, editPostLocally, resetCurrentPost, createPost, updatePost, deletePost,
} from '../actions';
import Error from './error';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false, // edit mode for already created posts
      // for disabling buttons after click so you cant spam the server with delete/create
      // requests *might not be neccesary after I added the page transitions*
      disableButton: false,
      displayWarning: 'none', // display warning when not all inputs are filled out
      displayImageWarning: 'none', // display warning if error occurs with image upload
      file: null,
      preview: 'https://cdn.pixabay.com/photo/2016/09/29/13/08/planet-1702788_960_720.jpg',
      useImageUpload: false,
    };
  }

  componentDidMount() {
    // shouldn't fetch a post when creating a new post
    if (this.props.match.path !== '/posts/new') {
      this.props.fetchPost(this.props.match.params.postID);
    }
  }

  // making the input field driven with the redux state
  // for content, title, coverUrl, and tags.
  onContentChange = (event) => {
    this.props.editPostLocally({ content: event.target.value });
  }

  onTitleChange = (event) => {
    this.props.editPostLocally({ title: event.target.value });
  }

  onTagsChange = (event) => {
    this.props.editPostLocally({ tags: event.target.value });
  }

  onCoverUrlChange = (event) => {
    this.props.editPostLocally({ coverUrl: event.target.value });
  }

  // s3 image uploading
  onImageUpload = (event) => {
    const file = event.target.files[0];
    // Handle null file
    // Get url of the file and set it to the src of preview
    if (file) {
      this.setState({ preview: window.URL.createObjectURL(file), file });
    }
  }

  // function returns true if post is valid, i.e. has only spaces in any input.
  // the regular expression in the if statement I got online at:
  // https://stackoverflow.com/questions/10261986/how-to-detect-string-which-contains-only-spaces/50971250
  // basically it replaces every space character with an empty string which allows me to check if each of the inputs
  // is empty.
  isValidInput = (post) => {
    return ((post.title?.replace(/\s/g, '').length) && (post.content?.replace(/\s/g, '').length)
    && (post.coverUrl?.replace(/\s/g, '').length) && (post.tags?.replace(/\s/g, '').length));
  }

  onConfirmPress = (event) => {
    let imageError = false;
    this.setState({ disableButton: true });
    if (this.state.file && this.state.useImageUpload) {
      uploadImage(this.state.file).then((url) => {
        // use url for content_url
        this.props.editPostLocally({ coverUrl: url });
      }).catch((error) => {
        // handle error by displaying a warning
        imageError = true;
        this.setState({ displayWarning: 'none' });
        this.setState({ displayImageWarning: 'inline' });
        this.setState({ disableButton: false });
      });
    }
    if (!imageError) {
      if (this.isValidInput(this.props.post)) {
        this.setState({ displayWarning: 'none' });
        // create new post
        if (this.props.match.path === '/posts/new') {
          this.props.createPost(this.props.post, this.props.history);
        // update existing post
        } else {
          this.setState({ editMode: false });
          this.props.updatePost(this.props.post);
          this.setState({ disableButton: false });
        }
      // display warning message if invalid input
      } else {
        this.setState({ displayImageWarning: 'none' });
        this.setState({ displayWarning: 'inline' });
        this.setState({ disableButton: false });
      }
    }
  }

  onEditPress = () => {
    if (this.props.auth) {
      this.setState({ editMode: true, preview: this.props.post.coverUrl });
    } else {
      this.props.history.push('/signin');
    }
  }

  onDeletePress = (event) => {
    this.setState({ disableButton: true });
    if (this.props.auth) {
      this.props.deletePost(this.props.post.id, this.props.history);
    } else {
      this.props.history.push('/signin');
    }
  }

  onCheckboxChange = (event) => {
    this.setState((prevState) => ({
      useImageUpload: !prevState.useImageUpload,
    }));
  }

  // shift+enter to submit while editing a Post
  // Did not just use "Enter" key, so that you
  // can still add new lines to post using enter key.
  handleEnterPress = (event) => {
    if (event.key === 'Enter' && event.shiftKey) {
      this.onConfirmPress();
    }
  }

  renderPostOrError() {
    // rendering error component if there was an error
    if (this.props.error != null && this.props.match.path !== '/posts/new') {
      return (
        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={this.props.variants}
          transition={this.props.transition}
        >
          <Error message="We had trouble processing the request involving this post. Sorry about that" />
        </motion.div>
      );
    // rendering editable post if user clicks "Edit" or navigated to the new post page
    } else if (this.state.editMode || this.props.match.path === '/posts/new') {
      return (
        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={this.props.variants}
          transition={this.props.transition}
          className="edit_post"
        >
          <h1>Title:</h1>
          <TextareaAutosize className="edit_input" onChange={this.onTitleChange} onKeyDown={this.handleEnterPress} value={this.props.post.title} />
          <h1>Post Cover Image:</h1>
          <p>Provide an image url:</p>
          <TextareaAutosize maxRows={4} className="edit_input" onChange={this.onCoverUrlChange} onKeyDown={this.handleEnterPress} value={this.props.post.coverUrl} />
          <p>Or upload an image:</p>
          <div className="image_upload_container">
            <div className="checkbox_container">
              <p>Check here to use uploaded image &#x2192;</p>
              <input type="checkbox" id="image_upload_checkbox" name="image_upload_check" value="Image" onChange={this.onCheckboxChange} />
            </div>
            <img id="preview" alt="preview" src={this.state.preview} />
            <input className="image_input" type="file" name="coverImage" onChange={this.onImageUpload} />
          </div>
          <h1>Content (supports Markdown):</h1>
          <TextareaAutosize className="edit_input" onChange={this.onContentChange} onKeyDown={this.handleEnterPress} value={this.props.post.content} />
          <h1>Tags:</h1>
          <TextareaAutosize className="edit_input" onChange={this.onTagsChange} onKeyDown={this.handleEnterPress} value={this.props.post.tags} />
          <AwesomeButton disabled={this.state.disableButton} onPress={this.onConfirmPress} className="button" ripple type="secondary">
            <div className="button">Confirm</div>
          </AwesomeButton>
          <div className="warning" style={{ display: `${this.state.displayWarning}` }}>Please fill out all fields.</div>
          <div className="warning" style={{ display: `${this.state.displayImageWarning}` }}>
            Something went wrong with the cover image you tried to upload. <br />
            Try again or try a different image.
          </div>
        </motion.div>
      );
    // rendering an empty div, mainly here to prevent a brief flash of an empty post
    // that happens when switching between posts and post
    } else if (isEmptyObject(this.props.post)) {
      return <div />;
    // else user navigated to a post's page so rendering the post in view mode
    } else {
      return (
        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={this.props.variants}
          transition={this.props.transition}
          className="view_post"
        >
          <div className="post_header">
            <img src={this.props.post.coverUrl} alt="Invalid Url" height="100px" width="100px" />
            <h1>{this.props.post.title}</h1>
          </div>
          <div className="post_author"><strong>author:</strong> {this.props.post.author?.username || 'anonymous'}</div>
          <div className="post_content"><ReactMarkdown>{this.props.post.content}</ReactMarkdown></div>
          <p><strong>tags</strong>: {this.props.post.tags}</p>
          <div className="post_buttons">
            <AwesomeButton onPress={this.onEditPress} className="button" ripple type="secondary"><div className="button">Edit</div></AwesomeButton>
            <AwesomeButton disabled={this.state.disableButton} onPress={this.onDeletePress} className="button" ripple type="primary"><div className="button">Delete</div></AwesomeButton>
          </div>
        </motion.div>
      );
    }
  }

  render() {
    return (
      <div className="post_container">{this.renderPostOrError()}</div>
    );
  }
}

const mapStateToProps = (state) => ({
  post: state.posts.current,
  error: state.error.status,
  auth: state.auth.authenticated,
});

export default withRouter(connect(mapStateToProps, {
  fetchPost, editPostLocally, resetCurrentPost, createPost, updatePost, deletePost,
})(Post));
