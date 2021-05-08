import React, { useEffect } from 'react';
import {
  Route, NavLink, Switch, withRouter,
} from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { connect } from 'react-redux';
import Posts from './posts';
import Post from './post';
import ScrollToTop from './scrollToTop';
import { resetCurrentPost } from '../actions';
import SearchBar from './searchbar';

// I watched this tutorial on framer-motion that teaches how to transition between
// react routes using the framer motion package:
// https://www.youtube.com/watch?v=qJt-FtzJ5fo&ab_channel=CodingwithSeth
// Then implemented my own animation based on its guidance in my app.
// The constants below are used to specify the animation that happens on page transition,
// pageVariants are a lot like keyframes from css animations
// pageTransitions are the time functions specifying how to animate from one keyframe to another.
// Each component that will be animated is given a motion.div container and these variables
// are passed to those containers to specify the animation.
const pageVariants = {
  // starting frame on entering
  initial: {
    opacity: 0,
    scaleX: 0,
  },
  // frame once entering is finished
  in: {
    opacity: 1,
    scaleX: 1,
  },
  // ending frame where exiting is finished
  out: {
    opacity: 0,
    scaleX: 0,
  },
};
const pageTransition = {
  type: 'spring',
  stiffness: 100,
  bounce: 1,
};

// component loads on switch to "/posts/new" route, its purpose
// is to reset the post state
const Reset = (props) => {
  useEffect(() => {
    props.resetCurrentPost();
  });
  return <div />;
};
const PostReset = connect(null, { resetCurrentPost })(Reset);

const Nav = (props) => {
  return (
    <nav>
      <ul>
        <li><NavLink exact to="/"><i className="fas fa-home" />Home Page</NavLink></li>
        <li><NavLink to="/posts/new">Create A Post<i className="fas fa-plus-square" /></NavLink></li>
      </ul>
    </nav>
  );
};

const App = (props) => {
  // Animate Presence and passing the location to the location/key
  // properties of the Switch are neccessary for the page transitions
  // to work.
  return (
    <div className="App">
      <div>
        <Nav />
        <AnimatePresence exitBeforeEnter>
          <Switch location={props.location} key={props.location.pathname}>
            <Route exact
              path="/"
              render={() => (
                <div>
                  <SearchBar variants={pageVariants} transition={pageTransition} />
                  <Posts variants={pageVariants} transition={pageTransition} />
                  <ScrollToTop />
                </div>
              )}
            />
            <Route path="/posts/new"
              render={() => (
                <div>
                  <PostReset />
                  <Post variants={pageVariants} transition={pageTransition} />
                </div>
              )}
            />
            <Route path="/posts/:postID"
              render={() => (
                <Post variants={pageVariants} transition={pageTransition} />
              )}
            />
            <Route render={() => (
              <motion.div
                id="fallback"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <h1><div className="emoji">&#129300;</div> Hmmmmm, the page you are looking for does not exist.</h1>
              </motion.div>
            )}
            />
          </Switch>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default withRouter(App);
