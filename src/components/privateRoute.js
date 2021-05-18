/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Redirect } from 'react-router-dom';

// Router Wrapper
const PrivateRoute = ({ render: Child, ...props }) => {
// some stuff goes here
  return (
    <Route
      {...props}
      render={(routeProps) => (props.authenticated ? (
        <Child {...routeProps} />
      ) : (
        <Redirect to="/signin" />
      ))}
    />
  );
};

const mapStateToProps = (state) => ({
  authenticated: state.auth.authenticated,
});

export default withRouter(connect(mapStateToProps, null)(PrivateRoute));
