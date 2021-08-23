import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

function UpcomingBookings(props) {
  const [bookings, setBookings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const hostId = props.hostId;
  useEffect(() => {
    fetch(`/api/host/upcoming-bookings/${hostId}`)
      .then(result => result.json())
      .then(body => {
        setBookings(body);
        setIsLoading(false);
      });
  }, []);

  const renderBookings = () => {
    const bookingsList = bookings.map(booking => {
      const re = /-/g;
      const newDate = booking.date.replace(re, '/');
      const startD = format(new Date(newDate + ' ' + booking.startTime), 'MM/dd/yyyy h:mm aaa');
      const endD = format(new Date(newDate + ' ' + booking.endTime), 'MM/dd/yyyy h:mm aaa');
      const date = format(new Date(newDate), 'MM/dd/yyyy');
      const start = startD.substring(11);
      const end = endD.substring(11);
      return (
        <div key={booking.bookingId} className='booking-container'>
          <h3 className='booking-location'>{booking.location}</h3>
          <img className='booking-img' src={booking.image}></img>
          <div className='name-date'>
            <p className='booking-info'>{booking.name}</p>
            <p className='booking-info'>{date}</p>
          </div>
          <p className='booking-info'>{start} to {end}</p>
        </div>
      );
    });
    return bookingsList;
  };
  return isLoading
    ? <p>Loading...</p>
    : (
    <>
    <h1 className='booking-title'>Upcoming Bookings</h1>
    <div className='bookings-container'>
      {renderBookings()}
    </div>
    </>
      );
}

export default UpcomingBookings;
