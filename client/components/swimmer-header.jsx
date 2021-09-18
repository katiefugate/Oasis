import React from 'react';

class SwimmerHeader extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.toggleHandler = this.toggleHandler.bind(this);
    this.state = {
      type: 'swimmer'
    };
  }

  handleClick() {
    this.props.onSignOut();
  }

  toggleHandler() {
    if (this.state.type === 'host') {
      this.setState({ type: 'swimmer' });
      this.props.switchType('swimmer');
    } else {
      this.setState({ type: 'host' });
      this.props.switchType('host');
    }
  }

  render() {
    return (
    <div className='header'>
      <button onClick={this.handleClick} className='sign-out-button'>Sign out</button>
      <h1 className='header-title'>OASIS</h1>
        <div className='link-toggle-container'>
      <p className={`toggle-${this.state.type}`} onClick={this.toggleHandler}>
        {this.state.type}
        <span className={`circle ${this.state.type}`} onClick={this.toggleHandler}></span>
      </p>
      <span className='desktop-links'>
        <a className='search-link' href='#search'>Search</a>
        <a className='booking-requests-link swimmer' href='#swimmer-bookings'>Bookings</a>
      </span>
      </div>
    </div>
    );
  }
}

export default SwimmerHeader;
