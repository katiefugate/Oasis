import React from 'react';

class HostBookingRequests extends React.Component {
  constructor(props) {
    super(props);
    this.renderBookings = this.renderBookings.bind(this);
    this.state = {
      isLoading: true,
      bookings: null
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

  renderBookings() {
    const bookings = this.state.bookings.map(booking => {
      let start = `${booking.startTime[0]}${booking.startTime[1]}`;
      let end = `${booking.endTime[0]}${booking.endTime[1]}`;
      let startAmpm;
      let endAmpm;
      if (start === '12') {
        startAmpm = 'pm';
      } else if (start > 12) {
        start = start - 12;
        startAmpm = 'pm';
      } else {
        startAmpm = 'am';
      }
      if (end === '12') {
        endAmpm = 'pm';
      } else if (end > 12) {
        end = end - 12;
        endAmpm = 'pm';
      } else {
        endAmpm = 'am';
      }
      if (start[0] === '0') {
        start = start[1];
      }
      if (end[0] === '0') {
        end = end[1];
      }
      const dateSplit = booking.date.split('-');
      const date = `${dateSplit[1]}-${dateSplit[2]}-${dateSplit[0]}`;
      start = `${start}:${booking.startTime[3]}${booking.startTime[4]} ${startAmpm}`;
      end = `${end}:${booking.endTime[3]}${booking.endTime[4]} ${endAmpm}`;
      return (
        <div className='booking-container' key={booking.bookingId}>
          <p className='booking-info'>{booking.name}</p>
          <p className='booking-info'>{date}</p>
          <p className='booking-info'>{start} to {end}</p>
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
