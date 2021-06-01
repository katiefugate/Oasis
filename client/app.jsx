import React from 'react';
import Home from './pages/home';
import Header from './components/header';
import HostForm from './pages/host-form';
import parseRoute from './lib/parse-route';
import Search from './pages/search-page';
import Navbar from './components/navbar';
import SearchResults from './pages/search-results';
import PoolInfo from './pages/pool-info';
import Swimmer from './pages/swimmer';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleSwimmerSignIn = this.handleSwimmerSignIn.bind(this);
    this.state = {
      route: parseRoute(window.location.hash),
      type: null,
      swimmerId: null
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
  }

  handleSwimmerSignIn(swimmerId, name) {
    this.setState({
      type: 'swimmer',
      swimmerId,
      name
    });
  }

  renderPage() {
    const { path } = this.state.route;
    const { params } = this.state.route;
    const location = params.get('location');
    const poolId = params.get('poolId');
    if (path === '') {
      return <Home />;
    }
    if (path === 'swimmer') {
      return (
        <>
        < Header />
        < Swimmer onSignIn={this.handleSwimmerSignIn} />
        </>
      );
    }
    if (path === 'host-form') {
      return (
        <>
      < Header />
      < HostForm />
      </>
      );
    }
    if (path === 'search') {
      return (
      <>
      < Header />
      < Search />
      < Navbar />
      </>
      );
    }
    if (path === 'search-results') {
      return (
        <>
        < Header />
        < SearchResults location={location} />
        < Navbar />
        </>
      );
    }
    if (path === 'pool') {
      return (
        <>
        < Header />
        < PoolInfo poolId={poolId} swimmerId={this.state.swimmerId} name={this.state.name}/>
        < Navbar />
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
