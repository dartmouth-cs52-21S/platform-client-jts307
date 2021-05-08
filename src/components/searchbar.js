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
    this.inputReference = React.createRef();
  }

  // searching for posts using inputted tags
  search = (text) => {
    this.props.searchTags(text);
  }

  onInputChange = (event) => {
    this.setState({ searchterm: event.target.value });
    this.search(event.target.value);
  }

  // making clicking on the search icon put the search
  // input in focus
  handleSearchIconClick = () => {
    this.inputReference.focus();
  }

  // same with pressing enter on icon
  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.handleSearchIconClick();
    }
  }

  renderSearchBarOrError() {
    // making sure not to render search bar if an error occurs
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
          <input
            ref={(reference) => { this.inputReference = reference; }}
            onChange={this.onInputChange}
            value={this.state.searchterm}
            placeholder="Search Tags..."
          />
          <i
            className="fa fa-search"
            onClick={this.handleSearchIconClick}
            onKeyDown={this.handleKeyPress}
            role="button"
            tabIndex="0"
            aria-label="Search Tags"
          />
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
