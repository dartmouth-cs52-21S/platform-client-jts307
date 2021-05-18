import { NavLink, withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AwesomeButton } from 'react-awesome-button';
import { signoutUser } from '../actions';
import 'react-awesome-button/dist/themes/theme-blue.css';

class Nav extends Component {
  onSignOutPress = (event) => {
    this.props.signoutUser(this.props.history);
  }

  renderRightNavBar() {
    if (this.props.auth) {
      return (
        <ul>
          <li className="sign_out">
            <AwesomeButton onPress={this.onSignOutPress} className="button" ripple type="primary">
              <div className="button">Sign Out</div>
            </AwesomeButton>
          </li>
          <li><NavLink to="/posts/new"><i className="fas fa-plus-square" /></NavLink></li>
        </ul>
      );
    } else {
      return (
        <ul>
          <li><NavLink to="/signup">Sign Up</NavLink></li>
          <li><NavLink to="/signin">Sign In</NavLink></li>
          <li><NavLink to="/posts/new"><i className="fas fa-plus-square" /></NavLink></li>
        </ul>
      );
    }
  }

  render() {
    return (
      <nav>
        <ul>
          <li><NavLink exact to="/"><i className="fas fa-home" />Home Page</NavLink></li>
          <li>
            {this.renderRightNavBar()}
          </li>
        </ul>
      </nav>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth.authenticated,
});

export default withRouter(connect(mapStateToProps, { signoutUser })(Nav));
