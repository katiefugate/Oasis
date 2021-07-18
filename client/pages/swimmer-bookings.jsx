import React, { useEffect, useState } from 'react';

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
      return (
        <div key={booking.bookingId}>
          <img src={booking.image}></img>
          <div>
            <span>{booking.location}</span>
            <span>{`$${booking.price}/hr`}</span>
          </div>
          <div>{booking.date}</div>
          <div>{`${booking.startTime} to ${booking.endTime}`}</div>
        </div>
      );
    });
    return bookingsList;
  }

  return isLoading
    ? <p>Loading...</p>
    : (
      <div>
        {renderBookings()}
      </div>
      );
}

export default SwimmerBookings;
