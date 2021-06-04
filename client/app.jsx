import React from 'react';
import Home from './pages/home';
import SwimmerHeader from './components/swimmer-header';
import HostHeader from './components/host-header';
import HostForm from './pages/host-form';
import parseRoute from './lib/parse-route';
import Search from './pages/search-page';
import Navbar from './components/navbar';
import SearchResults from './pages/search-results';
import PoolInfo from './pages/pool-info';
import HostNavbar from './components/host-navbar';
import HostBookingRequests from './pages/host-booking-requests';
import SignUp from './pages/sign-up';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state = {
      route: parseRoute(window.location.hash),
      type: null,
      swimmerId: null,
      hostId: null
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
  }

  handleSignUp(type, id) {
    if (type === 'swimmer') {
      this.setState({
        type: 'swimmer',
        swimmerId: id,
        hostId: null
      });
    } else {
      this.setState({
        type: 'host',
        swimmerId: null,
        hostId: id
      });
    }
  }

  renderPage() {
    const { path } = this.state.route;
    const { params } = this.state.route;
    const location = params.get('location');
    const poolId = params.get('poolId');
    if (path === '') {
      return <Home />;
    }
    if (path === 'sign-up') {
      return < SignUp onSignUp={this.handleSignUp} />;
    }
    if (path === 'host-form') {
      return (
        <>
      < HostHeader />
      < HostForm hostId={this.state.hostId} />
      < HostNavbar />
      </>
      );
    }
    if (path === 'search') {
      return (
      <>
      < SwimmerHeader />
      < Search />
      < Navbar />
      </>
      );
    }
    if (path === 'search-results') {
      return (
        <>
        < SwimmerHeader />
        < SearchResults location={location} />
        < Navbar />
        </>
      );
    }
    if (path === 'pool') {
      return (
        <>
        < SwimmerHeader />
        < PoolInfo poolId={poolId} swimmerId={this.state.swimmerId} name={this.state.name}/>
        < Navbar />
        </>
      );
    }
    if (path === 'host-bookings') {
      return (
        <>
        < HostHeader />
        < HostBookingRequests hostId={this.state.hostId} />
        <HostNavbar />
        </>
      );
    }
  }

  render() {
    return (
      <>
      {this.renderPage()}
      </>
    );
  }
}
