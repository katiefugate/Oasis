import React from 'react';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {

  }

  render() {
    return (
      <>
        <div className='header-home'>
          <h1 className='header-title'>OASIS</h1>
        </div>
        <div className='user-buttons-container'>
          <a className='swimmer-link' href='#search'>
            <button className='swimmer-button'>Swimmer</button>
          </a>
          <a className='host-link' href='#host/form'>
            <button className='host-button'>Host</button>
          </a>
        </div>
      </>
    );
  }
}

export default Home;
