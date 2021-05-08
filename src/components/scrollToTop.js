import { Component } from 'react';
import { withRouter } from 'react-router-dom';

// a component used to force scroll to top of home page when its nav link is clicked.
// It only has this one job and does not render anything. This component
// is taken from: https://reactrouter.com/web/guides/scroll-restoration and
// https://stackoverflow.com/questions/36904185/react-router-scroll-to-top-on-every-transition
// They both recommended a similiar approach for force scrolling to the top in React.
// I just added the scroll transition.
class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  }

  render() {
    return null;
  }
}

export default withRouter(ScrollToTop);
