import React, { Component } from 'react';
import { connect } from 'react-redux';
import { motion } from 'framer-motion';
import debounce from 'lodash.debounce';
import { searchTags } from '../actions';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.search = debounce(this.search, 300);
    this.state = { searchterm: '' };
  }

  search = (text) => {
    this.props.searchTags(text);
  }

  onInputChange = (event) => {
    this.setState({ searchterm: event.target.value });
    this.search(event.target.value);
  }

  renderSearchBarOrError() {
    if (this.props.error != null) {
      return <div />;
    } else {
      return (
        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={this.props.variants}
          transition={this.props.transition}
          id="search_bar"
        >
          <i className="fa fa-search" />
          <input onChange={this.onInputChange} value={this.state.searchterm} placeholder="Search Tags" />
        </motion.div>
      );
    }
  }

  render() {
    return (
      <div id="search_bar_container">{this.renderSearchBarOrError()}</div>
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.error.status,
});

export default connect(mapStateToProps, { searchTags })(SearchBar);
