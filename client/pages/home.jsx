import React from 'react';

class Home extends React.Component {
  render() {
    return (
      <>
        <div className='header-home'>
          <h1 className='header-title'>OASIS</h1>
        </div>
        <div className='user-buttons-container'>
          <a className='swimmer-link' href='#swimmer'>
            <button className='swimmer-button'>Swimmer</button>
          </a>
          <a className='host-link' href='#host'>
            <button className='host-button'>Host</button>
          </a>
        </div>
      </>
    );
  }
}

export default Home;
