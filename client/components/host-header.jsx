import React from 'react';

class HostHeader extends React.Component {
  render() {
    return (
      <div className='header'>
        <h1 className='header-title'>OASIS</h1>
        <span className='desktop-links'><a className='booking-requests-link' href='#host-bookings'>Booking Requests</a></span>
      </div>
    );
  }
}

export default HostHeader;
