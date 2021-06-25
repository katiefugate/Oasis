import React from 'react';
import Home from './pages/home';
import SwimmerHeader from './components/swimmer-header';
import HostHeader from './components/host-header';
import HostForm from './pages/host-form';
import parseRoute from './lib/parse-route';
import SwimmerSearch from './pages/swimmer-search-page';
import SwimmerNavbar from './components/swimmer-navbar';
import SwimmerSearchResults from './pages/swimmer-search-results';
import SwimmerPoolInfo from './pages/swimmer-pool-info';
import HostNavbar from './components/host-navbar';
import HostBookingRequests from './pages/host-booking-requests';
import SignUp from './pages/sign-up';
import SignIn from './pages/sign-in';
import decodeToken from './lib/decode-token';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.state = {
      route: parseRoute(window.location.hash),
      type: null,
      swimmerId: null,
      hostId: null,
      isAuthorizing: true,
      invalid: 'hidden'
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
    const token = window.localStorage.getItem('oasis-user');
    const user = token ? decodeToken(token) : null;
    if (!user) {
      window.location.hash = '#';
      this.setState({ isAuthorizing: false });
    } else if (user.type === 'swimmer') {
      this.setState({
        type: 'swimmer',
        swimmerId: user.userId,
        hostId: null,
        isAuthorizing: false
      });
    } else {
      this.setState({
        type: 'host',
        swimmerId: null,
        hostId: user.userId,
        isAuthorizing: false
      });
    }
  }

  handleSignUp(type, id) {
    if (type === 'swimmer') {
      this.setState({
        swimmerId: id,
        hostId: null
      });
    } else {
      this.setState({
        swimmerId: null,
        hostId: id
      });
    }
  }

  handleSignIn(type, result) {
    const { user, token } = result;
    if (result.error) {
      this.setState({ invalid: 'invalid' });
      return;
    }
    window.localStorage.setItem('oasis-user', token);
    if (type === 'swimmer') {
      this.setState({
        type: 'swimmer',
        swimmerId: user.userId,
        hostId: null,
        invalid: 'valid'
      });
    } else {
      this.setState({
        type: 'host',
        swimmerId: null,
        hostId: user.userId,
        invalid: 'valid'
      });
    }
  }

  handleSignOut() {
    window.localStorage.removeItem('oasis-user');
    this.setState({
      type: null,
      swimmerId: null,
      hostId: null
    });
    window.location.hash = '#';
  }

  renderPage() {
    const { path } = this.state.route;
    const { params } = this.state.route;
    const location = params.get('location');
    const poolId = params.get('poolId');
    if (path === '') {
      return < Home />;
    }
    if (path === 'sign-up') {
      return < SignUp onSignUp={this.handleSignUp} />;
    }
    if (path === 'sign-in') {
      return < SignIn onSignIn={this.handleSignIn} invalid={this.state.invalid}/>;
    }
    if (path === 'host-form') {
      return (
        <>
      < HostHeader onSignOut={this.handleSignOut}/>
      < HostForm hostId={this.state.hostId} />
      < HostNavbar />
      </>
      );
    }
    if (path === 'search') {
      return (
      <>
      < SwimmerHeader onSignOut={this.handleSignOut} />
      < SwimmerSearch />
      < SwimmerNavbar />
      </>
      );
    }
    if (path === 'search-results') {
      return (
        <>
        < SwimmerHeader onSignOut={this.handleSignOut} />
        < SwimmerSearchResults location={location} />
        < SwimmerNavbar />
        </>
      );
    }
    if (path === 'pool') {
      return (
        <>
        < SwimmerHeader onSignOut={this.handleSignOut}/>
        < SwimmerPoolInfo poolId={poolId} swimmerId={this.state.swimmerId} name={this.state.name}/>
        < SwimmerNavbar />
        </>
      );
    }
    if (path === 'host-bookings') {
      return (
        <>
        < HostHeader onSignOut={this.handleSignOut}/>
        < HostBookingRequests hostId={this.state.hostId} />
        < HostNavbar />
        </>
      );
    }
  }

  render() {
    if (this.state.isAuthorizing) return null;
    return (
      <>
      {this.renderPage()}
      </>
    );
  }
}
