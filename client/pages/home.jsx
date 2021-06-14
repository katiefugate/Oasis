import React from 'react';

class Home extends React.Component {
  render() {
    return (
      <>
        <div className='header-home'>
          <h1 className='header-title'>OASIS</h1>
        </div>
        <div className='home-description'>Get away to your own private oasis. Rent a pool by the hour.</div>
        <p className='home-or'>OR</p>
        <div className='home-host'>Become a host and turn your splash into cash!</div>
        <div className='user-buttons-container'>
          <a className='sign-up-link' href='#sign-up'>
            <button className='home-button'>Sign Up</button>
          </a>
          <a className='sign-in-link' href='#sign-in'>
            <button className='home-button'>Sign in</button>
          </a>
        </div>
      </>
    );
  }
}

export default Home;
