import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { isEmptyObject } from 'jquery';
import { motion } from 'framer-motion';
import { fetchPosts } from '../actions';
import Error from './error';

class Posts extends Component {
  componentDidMount() {
    // fetching posts on page load
    this.props.fetchPosts();
  }

  renderPostsOrError() {
    // rendering error component if error
    if (this.props.error != null) {
      return <Error message="We had trouble getting the Posts from the database. Sorry about that" />;
    // rendering just the website title header if posts are empty
    } else if (isEmptyObject(this.props.posts)) {
      return (
        <div id="posts_list">
          <h1><i className="fas fa-poo" />Shiitake Posts</h1>
        </div>
      );
    // rendering the list of posts along with website title header
    } else {
      return (
        <div id="posts_list">
          <h1><i className="fas fa-poo" />Shiitake Posts</h1>
          <ul>
            {this.props.posts.map((post) => {
              return (
                <li key={post.id} id={post.id} className="post">
                  <Link to={`/posts/${post.id}`}>
                    <h2 className="title">{post.title}</h2>
                    <img src={post.coverUrl} alt="Invalid Post Cover Url" height="100px" width="100px" />
                    <p className="tags">tags: {post.tags}</p>
                    <p className="author">author: {post.author?.username || 'anonymous'}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
  }

  render() {
    return (
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={this.props.variants}
        transition={this.props.transition}
      >
        {this.renderPostsOrError()}
      </motion.div>
    );
  }
}

const mapStateToProps = (state) => ({
  posts: state.posts.all,
  error: state.error.status,
});

export default connect(mapStateToProps, { fetchPosts })(Posts);
