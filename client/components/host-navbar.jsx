import React from 'react';

class HostNavbar extends React.Component {

  render() {
    return (
      <div className='navbar'>
        <a href='#host-bookings'><i className="fas fa-calendar-plus host-bookings-icon"></i></a>
      </div>
    );
  }
}

export default HostNavbar;