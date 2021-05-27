import React from 'react';

class Header extends React.Component {
  render() {
    return (
  <div className='header'>
    <h1 className='header-title'>OASIS</h1>
        <span className='desktop-links'><a className='search-link' href='#search'>Search</a></span>
  </div>
    );
  }
}

export default Header;
