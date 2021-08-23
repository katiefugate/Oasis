import React from 'react';

class HostNavbar extends React.Component {

  render() {
    return (
      <div className='navbar'>
        <a href='#host-bookings'><i className="fas fa-calendar-plus host-bookings-icon"></i></a>
        <a href='#host-pools'><i className="fas fa-swimming-pool host-pools-icon"></i></a>
        <a href='#host-upcoming'><i className="fas fa-calendar-alt host-booked-icon"></i></a>
      </div>
    );
  }
}

export default HostNavbar;
