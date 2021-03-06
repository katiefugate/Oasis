import React, { useEffect, useState } from 'react';
import { format, isBefore, parseISO } from 'date-fns';

function SwimmerBookings(props) {

  const [bookings, setBookings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState('accepted');
  const [acceptedActive, setAcceptedActive] = useState('active');
  const [pendingActive, setPendingActive] = useState('inactive');
  const [declinedActive, setDeclinedActive] = useState('inactive');
  const [cancelledActive, setCancelledActive] = useState('inactive');
  const [completedActive, setCompletedActive] = useState('completed');

  useEffect(() => {
    fetch(`/api/swimmer/booking-requests/${props.swimmerId}`)
      .then(response => response.json())
      .then(body => {
        setBookings(body);
        setIsLoading(false);
      });
  }, []);

  function handleClick(event) {
    if (!event.target.id) {
      return;
    }
    setTab(event.target.id);
    if (event.target.id === 'pending') {
      setPendingActive('active');
      setAcceptedActive('inactive');
      setDeclinedActive('inactive');
      setCancelledActive('inacitve');
    }
    if (event.target.id === 'accepted') {
      setPendingActive('inactive');
      setAcceptedActive('active');
      setDeclinedActive('inactive');
      setCancelledActive('inacitve');
    }
    if (event.target.id === 'declined') {
      setPendingActive('inactive');
      setAcceptedActive('inactive');
      setDeclinedActive('active');
      setCancelledActive('inacitve');
    }
    if (event.target.id === 'cancelled') {
      setPendingActive('inactive');
      setAcceptedActive('inactive');
      setDeclinedActive('inactive');
      setCancelledActive('active');
    }
    if (event.target.id === 'completed') {
      setCompletedActive('active');
      setPendingActive('inactive');
      setAcceptedActive('inactive');
      setDeclinedActive('inactive');
      setCancelledActive('inactive');
    }
  }

  function cancelClick(event) {
    const init = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'cancelled' })
    };
    fetch(`/api/host/booking-status/${event.target.id}`, init);
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
      let cancelButton;
      const today = new Date();
      const bookingDate = parseISO(booking.date);
      if (isBefore(bookingDate, today) && booking.status === 'accepted') {
        const init = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: 'completed' })
        };
        fetch(`/api/host/booking-status/${parseInt(booking.bookingId, 10)}`, init)
          .then(response => {
            booking.status = 'completed';
          });
      }
      if (booking.status === 'accepted' || booking.status === 'pending') {
        cancelButton = <button id={booking.bookingId} onClick={cancelClick} className='cancel-button'>CANCEL</button>;
      } else if (isBefore(bookingDate, today)) {
        cancelButton = null;
      } else {
        cancelButton = null;
      }
      if (booking.status === tab) {
        return (
          <div key={booking.bookingId} className='list-booking'>
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
            <div className='cancel-button-container'>
            {cancelButton}
            </div>
            <div className='line'></div>
          </div>
        );
      } else {
        return null;
      }
    });
    const newList = bookingsList.filter(booking => booking !== null);
    if (newList.length === 0) {
      return <h1 className='no-bookings'>{`You have no ${tab} requests.`}</h1>;
    }
    return bookingsList;
  }

  return isLoading
    ? <p>Loading...</p>
    : (
      <>
        <h1 className='booking-title'>Booking Requests</h1>
        <div onClick={handleClick} className='booking-tabs'>
          <span className={`booking-tab ${pendingActive}`} id='pending'>Pending</span>
          <span className={`booking-tab ${acceptedActive}`} id='accepted'>Accepted</span>
          <span className={`booking-tab ${declinedActive}`} id='declined'>Declined</span>
          <span className={`booking-tab ${cancelledActive}`} id='cancelled'>Cancelled</span>
          <span className={`booking-tab ${completedActive}`} id ='completed'>Completed</span>
        </div>
        <div className='pool-list-container'>
        {renderBookings()}
        </div>
      </>
      );
}

export default SwimmerBookings;
