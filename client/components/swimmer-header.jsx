import React from 'react';

class SwimmerHeader extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onSignOut();
  }

  render() {
    return (
  <div className='header'>
    <button onClick={this.handleClick} className='sign-out-button'>Sign out</button>
    <h1 className='header-title'>OASIS</h1>
        <div className='desktop-links'><a className='search-link' href='#search'>Search</a></div>
  </div>
    );
  }
}

export default SwimmerHeader;
