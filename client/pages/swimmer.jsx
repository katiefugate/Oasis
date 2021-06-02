import React from 'react';

class Swimmer extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const name = event.target.name.value;
    const init = {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    fetch('/api/swimmer', init)
      .then(response => response.json())
      .then(body => {
        this.props.onSignIn(body.swimmerId, body.name);
      });
    window.location.hash = '#search';
  }

  render() {
    return (
      <div>
        <div className='header'>
          <h1 className='header-title'>OASIS</h1>
        </div>
        <form onSubmit={this.handleSubmit} className='swimmer-login'>
          <label htmlFor='name'>Name</label>
          <input className='swimmer-name' type='name' name='name'></input>
          <button className='login-button' type='submit'>LOGIN</button>
        </form>
      </div>
    );
  }
}

export default Swimmer;