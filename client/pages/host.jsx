import React from 'react';

class Host extends React.Component {
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
    fetch('/api/host', init)
      .then(response => response.json())
      .then(body => {
        this.props.onSignIn(body.hostId);
      });
    window.location.hash = '#host-form';
  }

  render() {
    return (
      <>
        <div className='header'>
          <h1 className='header-title'>OASIS</h1>
        </div>
        <form onSubmit={this.handleSubmit} className='host-login'>
          <label htmlFor='name'>Name</label>
          <input className='host-name' type='name' name='name'></input>
          <button className='login-button' type='submit'>LOGIN</button>
        </form>
      </>
    );
  }
}

export default Host;
