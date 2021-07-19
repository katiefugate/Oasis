import React from 'react';

class SwimmerNavbar extends React.Component {

  render() {
    return (
      <div className='navbar'>
        <a href='#search'><i className="fas fa-search search-icon"></i></a>
        <a href='#swimmer-bookings'><i className="fas fa-calendar-alt swimmer-bookings-icon"></i></a>
      </div>
    );
  }
}

export default SwimmerNavbar;
