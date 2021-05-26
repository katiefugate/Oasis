import React from 'react';
import Home from './pages/home';
import Header from './components/header';
import HostForm from './pages/host-form';

export default class App extends React.Component {
  render() {
    return (
      <>
      < Header />
      <HostForm />
    <Home />
    </>
    );
  }
}
