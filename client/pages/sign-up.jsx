import React from 'react';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const name = event.target.name.value;
    const username = event.target.username.value;
    const password = event.target.password.value;
    const init = {
      method: 'POST',
      body: JSON.stringify({ name, username, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    fetch('/api/sign-up', init);
    window.location.hash = '#sign-in';
  }

  render() {
    return (
      <div>
        <div className='header-sign-up'>
          <h1 className='header-name'>OASIS</h1>
        </div>
        <div className='home-description'>Get away to your own private oasis. Rent a pool by the hour.</div>
        <p className='home-or'>OR</p>
        <div className='home-host'>Become a host and turn your splash into cash!</div>
        <form onSubmit={this.handleSubmit} className='sign-up-form'>
          <h1 className='auth-header'>Create an account to get started!</h1>
          <div className='input-container'>
            <label className='sign-up-label' htmlFor='name'>Name</label>
            <input className='sign-up-input' type='name' name='name'></input>
          </div>
          <div className='input-container'>
            <label className='sign-up-label' htmlFor='username'>Username</label>
            <input className='sign-up-input' type='username' name='username'></input>
          </div>
          <div className='input-container'>
            <label className='sign-up-label' htmlFor="password">Password</label>
            <input className='sign-up-input' type="password" name="password"></input>
          </div>
          <button className='sign-up-button' type='submit'>Sign Up</button>
        </form>
        <div className='sign'>Already have an account? <a className='sign-link' href='#sign-in'>Sign in!</a></div>
      </div>
    );
  }
}

export default SignUp;
