import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/themes/theme-blue.css';
import { withRouter } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signinUser, signupUser } from '../actions';
import Error from './error';

class SignInAndUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disableButton: false, // for disabling buttons after click
      displayWarning: 'none', // display warning when not all inputs are filled out
      email: '',
      password: '',
      username: '',
    };
  }

  // making the input fields driven
  // for email and password
  onEmailChange = (event) => {
    this.setState({ email: event.target.value });
  }

  onPasswordChange = (event) => {
    this.setState({ password: event.target.value });
  }

  onUserNameChange = (event) => {
    this.setState({ username: event.target.value });
  }

  // function returns true if input fields are valid, i.e. they have something in them
  // the regular expression in the if statement I got online at:
  // https://stackoverflow.com/questions/10261986/how-to-detect-string-which-contains-only-spaces/50971250
  // basically it replaces every space character with an empty string which allows me to check if each of the inputs
  // is empty.
  isValidInput = (inputs) => {
    if ((inputs.email.replace(/\s/g, '').length) && (inputs.password.replace(/\s/g, '').length)) {
      if (this.props.match.path === '/signup') {
        return (inputs.username.replace(/\s/g, '').length);
      } else {
        return true;
      }
    }
    return false;
  }

  onConfirmPress = (event) => {
    const inputs = {
      email: this.state.email,
      password: this.state.password,
      username: this.state.username,
    };
    if (this.isValidInput(inputs)) {
      this.setState({ disableButton: true });
      this.setState({ displayWarning: 'none' });
      // sign in the user
      if (this.props.match.path === '/signin') {
        this.props.signinUser({ email: this.state.email, password: this.state.password }, this.props.history);
      // sign up the user
      } else {
        this.props.signupUser(inputs, this.props.history);
      }
      setTimeout(this.setState({ disableButton: false }), 1000);
    // display warning message
    } else {
      this.setState({ displayWarning: 'inline' });
    }
  }

  // shift+enter to submit while editing a Post
  // Did not just use "Enter" key, so that you
  // can still add new lines to post using enter key.
  handleEnterPress = (event) => {
    if (event.key === 'Enter' && event.shiftKey) {
      this.onConfirmPress();
    }
  }

  renderSignInOrUpOrError() {
    // rendering error component if there was a bad sign in
    if (this.props.error != null) {
      let errorMessage = '';
      if (this.props.match.path === '/signup') {
        errorMessage = 'Looks like there was an issue signing you up. Please Try Again With Different Sign Up Info';
      } else {
        errorMessage = 'Looks like there was an issue signing you in. Please Try Again';
      }
      return (
        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={this.props.variants}
          transition={this.props.transition}
        >
          <Error message={errorMessage} />
        </motion.div>
      );
    // rendering sign in page
    } else {
      let buttonText = '';
      let usernameField = 'none';
      if (this.props.match.path === '/signup') {
        buttonText = 'Sign Up';
        usernameField = 'inline';
      } else {
        buttonText = 'Sign In';
      }
      return (
        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={this.props.variants}
          transition={this.props.transition}
          className="sign_in_up_form"
        >
          <p>Email:</p>
          <TextareaAutosize className="form_input" onChange={this.onEmailChange} onKeyDown={this.handleEnterPress} value={this.state.email} />
          <p>Password:</p>
          <TextareaAutosize className="form_input" onChange={this.onPasswordChange} onKeyDown={this.handleEnterPress} value={this.state.password} />
          <p style={{ display: usernameField }}>User Name:</p>
          <TextareaAutosize style={{ display: usernameField }} className="form_input" onChange={this.onUserNameChange} onKeyDown={this.handleEnterPress} value={this.state.username} />
          <AwesomeButton size="small" disabled={this.state.disableButton} onPress={this.onConfirmPress} className="button" ripple type="secondary">
            <div className="button">{buttonText}</div>
          </AwesomeButton>
          <div id="warning" style={{ display: `${this.state.displayWarning}` }}>Please fill out all fields.</div>
        </motion.div>
      );
    }
  }

  render() {
    return (
      <div className="sign_in_up_container">{this.renderSignInOrUpOrError()}</div>
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.error.status,
});

export default withRouter(connect(mapStateToProps, {
  signinUser, signupUser,
})(SignInAndUp));
