import { isSameDay } from 'date-fns';
import { parseISO } from 'date-fns/esm';
import React from 'react';

class SwimmerPoolInfo extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.closeButton = this.closeButton.bind(this);
    this.state = {
      isLoading: true,
      info: null,
      modalClass: 'hidden',
      overlayClass: 'hidden',
      sameTime: false,
      available: 'available',
      confirmationModal: 'hidden',
      confirmationOverlay: 'hidden'
    };
  }

  componentDidMount() {
    fetch(`api/pool/${this.props.poolId}`)
      .then(res => res.json())
      .then(body => {
        this.setState({
          info: body,
          isLoading: false
        });
      });
  }

  handleClick() {
    this.setState({ modalClass: 'modal', overlayClass: 'overlay' });

  }

  handleSubmit(event) {
    event.preventDefault();
    const date = event.target.date.value;
    const startTime = event.target.startTime.value;
    const endTime = event.target.endTime.value;
    const poolId = this.props.poolId;
    const swimmerId = this.props.swimmerId;
    const name = this.props.name;

    fetch(`/api/bookings/pool/${poolId}`)
      .then(response => response.json())
      .then(body => {
        const requestedDate = parseISO(date);
        const sameDay = body.filter(booking => isSameDay(requestedDate, parseISO(booking.date)));
        const splitStart = startTime.split(':');
        const splitEnd = endTime.split(':');
        this.setState({ sameTime: false });
        for (let i = 0; i < sameDay.length; i++) {
          const splitStartEach = sameDay[i].startTime.split(':');
          const splitEndEach = sameDay[i].endTime.split(':');
          if (splitStart >= splitStartEach && splitStart <= splitEndEach) {
            this.setState({ sameTime: true });
          } else if (splitEnd <= splitEndEach && splitEnd >= splitStartEach) {
            this.setState({ sameTime: true });
          }
        }
        if (this.state.sameTime) {
          this.setState({ available: 'unavailable' });
        } else {
          const init = {
            method: 'POST',
            body: JSON.stringify({ swimmerId, poolId, name, date, startTime, endTime }),
            headers: {
              'Content-Type': 'application/json'
            }

          };
          fetch('/api/book', init)
            .then(response => response.json());
          this.setState({ modalClass: 'hidden', overlayClass: 'hidden' });
          this.setState({ confirmationModal: 'modal', confirmationOverlay: 'overlay', available: 'available' });
          event.target.reset();
        }
      });
  }

  handleCancel() {
    this.setState({ modalClass: 'hidden', overlayClass: 'hidden' });
  }

  closeButton() {
    this.setState({ confirmationModal: 'hidden', confirmationOverlay: 'hidden' });
  }

  render() {

    return this.state.isLoading
      ? <p>Loading...</p>
      : (
        <div className='pool-info-container'>
          <div className={this.state.confirmationOverlay}></div>
          <div className={this.state.confirmationModal}>
            <h1>Request sent!</h1>
            <button className='close-button' onClick={this.closeButton}>close</button>
          </div>
          <div className={this.state.overlayClass}></div>
          <div className={this.state.modalClass}>
            <div className={this.state.available}>That time is unavailable, please try another.</div>
            <form className='booking-form' onSubmit={this.handleSubmit}>
              <label htmlFor='date'>Date</label>
              <input className='booking-input' type='date' name='date'></input>
              <label htmlFor='start-time'>Start Time</label>
              <input className='booking-input' type='time' name='startTime'></input>
              <label htmlFor='end-time'>End Time</label>
              <input className='booking-input' type='time' name='endTime'></input>
              <div className='buttons-container'>
              <button className='booking-submit' type='submit'>BOOK</button>
              <button className='booking-cancel' type='reset' onClick={this.handleCancel}>CANCEL</button>
              </div>
            </form>
          </div>
          <div className='info-col'>
            <div className='location-book-container'>
            <span className='pool-info-location'>{this.state.info.location}</span>
            <button onClick={this.handleClick} className='book-button'>BOOK NOW!</button>
            </div>
            <img className='pool-info-img' src={this.state.info.image}></img>
            <div className='pool-info-span'>
              <span>{`Hosted by ${this.state.info.name}`}</span>
              <span>{`${this.state.info.price}/hr`}</span>
            </div>
            <div>
              <h3 className='info-titles'>Description</h3>
              <p className='info-p'>{this.state.info.description}</p>
            </div>
          </div>
          <div className='info-col2'>
            <div>
              <h3 className='info-titles'>Rules</h3>
              <p className='info-p'>{this.state.info.rules}</p>
            </div>
            <div>
              <h3 className='info-titles'>Amenities</h3>
              <p className='info-p'>{this.state.info.amenities}</p>
            </div>
          </div>
        </div>
        );
  }
}

export default SwimmerPoolInfo;
