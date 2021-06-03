import React from 'react';
import { format } from 'date-fns';

class HostBookingRequests extends React.Component {
  constructor(props) {
    super(props);
    this.renderBookings = this.renderBookings.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      isLoading: true,
      bookings: null,
      statusChanged: false
    };
  }

  componentDidMount() {
    fetch(`/api/host/booking-requests/${this.props.hostId}`)
      .then(res => res.json())
      .then(body => {
        this.setState({
          bookings: body,
          isLoading: false
        });
      });
  }

  handleClick(event) {
    const bookingId = event.target.parentElement.parentElement.id;
    let status = null;
    if (event.target.className === 'accept-button') {
      status = 'accepted';
    } else {
      status = 'declined';
    }
    const init = {
      method: 'PUT',
      body: JSON.stringify({ status }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    fetch(`/api/host/booking-status/${bookingId}`, init)
      .then(res => res.json());
  }

  renderBookings() {
    const bookings = this.state.bookings.map(booking => {
      const startD = format(new Date(booking.date + ' ' + booking.startTime), 'MM/dd/yyyy h:mm aaa');
      const endD = format(new Date(booking.date + ' ' + booking.endTime), 'MM/dd/yyyy h:mm aaa');
      const date = format(new Date(booking.date), 'MM/dd/yyyy');
      const start = startD.substring(11);
      const end = endD.substring(11);
      return (
        <div id={booking.bookingId} className='booking-container' key={booking.bookingId}>
          <div className='column-half'>
          <p className='booking-info'>{booking.name}</p>
          <p className='booking-info'>{date}</p>
          <p className='booking-info'>{start} to {end}</p>
          </div>
          <div className='column-half booking-request-buttons'>
          <button onClick={this.handleClick} className='accept-button'>Accept</button>
          <button onClick={this.handleClick} className='decline-button'>Decline</button>
          </div>
        </div>
      );
    });
    return bookings;
  }

  render() {
    return this.state.isLoading
      ? <p>Loading...</p>
      : (
        <>
          <h1 className='booking-title'>Booking Requests</h1>
          <div className='bookings-container'>
            {this.renderBookings()}
          </div>
        </>
        );
  }
}

export default HostBookingRequests;
