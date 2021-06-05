import React from 'react';

class HostHeader extends React.Component {
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
        <span className='desktop-links'><a className='booking-requests-link' href='#host-bookings'>Booking Requests</a></span>
      </div>
    );
  }
}

export default HostHeader;
