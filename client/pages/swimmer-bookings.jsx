import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

function SwimmerBookings(props) {

  const [bookings, setBookings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState('accepted');
  const [acceptedActive, setAcceptedActive] = useState('active');
  const [pendingActive, setPendingActive] = useState('inactive');
  const [declinedActive, setDeclinedActive] = useState('inactive');

  useEffect(() => {
    fetch(`/api/swimmer/booking-requests/${props.swimmerId}`)
      .then(response => response.json())
      .then(body => {
        setBookings(body);
        setIsLoading(false);
      });
  }, []);

  function handleClick(event) {
    setTab(event.target.id);
    if (event.target.id === 'pending') {
      setPendingActive('active');
      setAcceptedActive('inactive');
      setDeclinedActive('inactive');
    }
    if (event.target.id === 'accepted') {
      setPendingActive('inactive');
      setAcceptedActive('active');
      setDeclinedActive('inactive');
    }
    if (event.target.id === 'declined') {
      setPendingActive('inactive');
      setAcceptedActive('inactive');
      setDeclinedActive('active');
    }
  }

  function renderBookings() {
    const bookingsList = bookings.map(booking => {
      const re = /-/g;
      const newDate = booking.date.replace(re, '/');
      const startD = format(new Date(newDate + ' ' + booking.startTime), 'MM/dd/yyyy h:mm aaa');
      const endD = format(new Date(newDate + ' ' + booking.endTime), 'MM/dd/yyyy h:mm aaa');
      const date = format(new Date(newDate), 'MM/dd/yyyy');
      const start = startD.substring(11);
      const end = endD.substring(11);
      if (booking.status === tab) {
        return (
          <div key={booking.bookingId}>
            <a href={`#pool?poolId=${booking.poolId}`}>
              <img src={booking.image} id={booking.poolId} className='pool-list-img'></img>
            </a>
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
      } else {
        return null;
      }
    });
    return bookingsList;
  }

  return isLoading
    ? <p>Loading...</p>
    : (
      <div className='pool-list-container'>
        <h1 className='booking-title'>Booking Requests</h1>
        <div onClick={handleClick} className='booking-tabs'>
          <span className={`booking-tab ${pendingActive}`} id='pending'>Pending</span>
          <span className={`booking-tab ${acceptedActive}`} id='accepted'>Accepted</span>
          <span className={`booking-tab ${declinedActive}`} id='declined'>Declined</span>
        </div>
        {renderBookings()}
      </div>
      );
}

export default SwimmerBookings;
