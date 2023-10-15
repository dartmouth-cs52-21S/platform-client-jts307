import React, { Component } from 'react';
import { connect } from 'react-redux';
import { errorClear } from '../actions';

class Error extends Component {
  componentWillUnmount() {
    // clearing error from redux state
    this.props.errorClear();
  }

  // rendering error page based on current error in redux state
  render() {
    return (
      <div id="error">
        <h1>{this.props.message}<div className="emoji">&#128517;</div></h1>
        <p>{this.props.error?.message}</p>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.error.status,
});

export default connect(mapStateToProps, { errorClear })(Error);
