import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import TextareaAutosize from 'react-textarea-autosize';
import { isEmptyObject } from 'jquery';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/themes/theme-blue.css';
import { withRouter } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  fetchPost, editPostLocally, resetCurrentPost, createPost, updatePost, deletePost,
} from '../actions';
import Error from './error';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      disableButton: false, // for disabling buttons after click so you cant spam the server with delete/create requests
      displayWarning: 'none', // display warning when not all inputs are filled out
    };
  }

  componentDidMount() {
    if (this.props.match.path !== '/posts/new') {
      this.props.fetchPost(this.props.match.params.postID);
    }
  }

  onContentChange = (event) => {
    this.props.editPostLocally({ content: event.target.value });
  }

  onTitleChange = (event) => {
    this.props.editPostLocally({ title: event.target.value });
  }

  onCoverUrlChange = (event) => {
    this.props.editPostLocally({ coverUrl: event.target.value });
  }

  onTagsChange = (event) => {
    this.props.editPostLocally({ tags: event.target.value });
  }

  // the regular expression in the if statement I got online at:
  // https://stackoverflow.com/questions/10261986/how-to-detect-string-which-contains-only-spaces/50971250
  // basically it replaces every space character with an empty string which allows me to check if each of the inputs
  // is empty. Returns true if post is invalid, i.e. has only spaces in any input.
  isInvalidInput = (post) => {
    let invalid = false;
    if ((post.title?.replace(/\s/g, '').length) && (post.content?.replace(/\s/g, '').length)
    && (post.coverUrl?.replace(/\s/g, '').length) && (post.tags?.replace(/\s/g, '').length)) {
      invalid = true;
    }
    return invalid;
  }

  onConfirmPress = (event) => {
    if (this.isInvalidInput(this.props.post)) {
      this.setState({ displayWarning: 'none' });
      if (this.props.match.path === '/posts/new') {
        this.setState({ disableButton: true });
        this.props.createPost(this.props.post, this.props.history);
      } else {
        this.setState({ editMode: false });
        this.props.updatePost(this.props.post);
      }
    } else {
      this.setState({ displayWarning: 'inline' });
    }
  }

  onEditPress = () => {
    this.setState({ editMode: true });
  }

  onDeletePress = (event) => {
    this.setState({ disableButton: true });
    this.props.deletePost(this.props.post.id, this.props.history);
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
          <p>Title:</p>
          <TextareaAutosize className="edit_input" onChange={this.onTitleChange} onKeyDown={this.handleEnterPress} value={this.props.post.title} />
          <p>Post Cover Image Url:</p>
          <TextareaAutosize maxRows={4} className="edit_input" onChange={this.onCoverUrlChange} onKeyDown={this.handleEnterPress} value={this.props.post.coverUrl} />
          <p>Content (supports Markdown):</p>
          <TextareaAutosize className="edit_input" onChange={this.onContentChange} onKeyDown={this.handleEnterPress} value={this.props.post.content} />
          <p>Tags:</p>
          <TextareaAutosize className="edit_input" onChange={this.onTagsChange} onKeyDown={this.handleEnterPress} value={this.props.post.tags} />
          <AwesomeButton disabled={this.state.disableButton} onPress={this.onConfirmPress} className="button" ripple type="secondary">
            <div className="button">Confirm</div>
          </AwesomeButton>
          <div id="warning" style={{ display: `${this.state.displayWarning}` }}>Please fill out all fields.</div>
        </motion.div>
      );
    } else if (isEmptyObject(this.props.post)) {
      return <div />;
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
});

export default withRouter(connect(mapStateToProps, {
  fetchPost, editPostLocally, resetCurrentPost, createPost, updatePost, deletePost,
})(Post));
