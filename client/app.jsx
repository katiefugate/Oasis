import React from 'react';
import Home from './pages/home';
import Header from './components/header';
import HostForm from './pages/host-form';
import parseRoute from './lib/parse-route';
import Search from './pages/search-page';
import Navbar from './components/navbar';
import SearchResults from './pages/search-results';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
  }

  renderPage() {
    const { path } = this.state.route;
    if (path === '') {
      return <Home />;
    }
    if (path === 'host/form') {
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
        < SearchResults />
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
