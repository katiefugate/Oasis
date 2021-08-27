import React from 'react';

class HostNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      read: this.props.isRead,
      isRead: 'hidden'
    };
  }

  componentDidMount() {
    if (this.state.isRead) {
      this.setState({ isRead: 'notification' });
    }
  }

  render() {
    return (
      <div className='navbar'>
        <a className='booking-a' href='#host-bookings'><i className={`fas fa-circle ${this.state.isRead}`}></i><i className="fas fa-calendar-plus host-bookings-icon"></i></a>
        <a href='#host-pools'><i className="fas fa-swimming-pool host-pools-icon"></i></a>
        <a href='#host-upcoming'><i className="fas fa-calendar-alt host-booked-icon"></i></a>
      </div>
    );
  }
}

export default HostNavbar;
