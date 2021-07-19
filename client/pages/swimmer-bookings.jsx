import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

function SwimmerBookings(props) {

  const [bookings, setBookings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetch(`/api/swimmer/booking-requests/${props.swimmerId}`)
      .then(response => response.json())
      .then(body => {
        setBookings(body);
        setIsLoading(false);
      });
  });

  function renderBookings() {
    const bookingsList = bookings.map(booking => {
      const re = /-/g;
      const newDate = booking.date.replace(re, '/');
      const startD = format(new Date(newDate + ' ' + booking.startTime), 'MM/dd/yyyy h:mm aaa');
      const endD = format(new Date(newDate + ' ' + booking.endTime), 'MM/dd/yyyy h:mm aaa');
      const date = format(new Date(newDate), 'MM/dd/yyyy');
      const start = startD.substring(11);
      const end = endD.substring(11);
      return (
        <div key={booking.bookingId}>
          <img src={booking.image} id={booking.poolId} className='pool-list-img'></img>
          <div className='pool-list-info'>
            <span className='pool-list-location'>{booking.location}</span>
            <span className='pool-list-price'>{`$${booking.price}/hr`}</span>
          </div>
          <div className='pool-list-info'>
          <span className='booking-info'>{date}</span>
          <span className='booking-info'>{`${start} to ${end}`}</span>
          </div>
          <div className='booking-info'>Status: {booking.status}</div>
        </div>
      );
    });
    return bookingsList;
  }

  return isLoading
    ? <p>Loading...</p>
    : (
      <div className='pool-list-container'>
        {renderBookings()}
      </div>
      );
}

export default SwimmerBookings;
