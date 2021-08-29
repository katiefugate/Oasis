import React from 'react';

class HostNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.notificationOff = this.notificationOff.bind(this);
    this.state = {
      read: this.props.isRead,
      isRead: 'hidden'
    };
  }

  componentDidMount() {
    if (!this.state.read) {
      this.setState({ isRead: 'notification' });
    }
  }

  notificationOff() {
    this.setState({ isRead: 'hidden' });
  }

  render() {
    return (
      <div className='navbar'>
        <a className='booking-a' href='#host-bookings' onClick={this.notificationOff}><i className={`fas fa-circle ${this.state.isRead}`}></i><i className="fas fa-calendar-plus host-bookings-icon"></i></a>
        <a href='#host-pools'><i className="fas fa-swimming-pool host-pools-icon"></i></a>
        <a href='#host-upcoming'><i className="fas fa-calendar-alt host-booked-icon"></i></a>
      </div>
    );
  }
}

export default HostNavbar;
