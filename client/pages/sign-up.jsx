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
    if (event.target.user.value === 'host') {
      const init = {
        method: 'POST',
        body: JSON.stringify({ name, username, password }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      fetch('/api/host', init)
        .then(response => response.json())
        .then(body => {
          this.props.onSignUp('host', body.hostId);
        });
      window.location.hash = '#host-form';
    } else {
      const init = {
        method: 'POST',
        body: JSON.stringify({ name, username, password }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      fetch('/api/swimmer', init)
        .then(response => response.json())
        .then(body => {
          this.props.onSignUp('swimmer', body.swimmerId);
        });
      window.location.hash = '#search';
    }
  }

  render() {
    return (
      <div>
        <div className='header-sign-up'>
          <h1 className='header-name'>OASIS</h1>
        </div>
        <form onSubmit={this.handleSubmit} className='swimmer-login'>
          <div className='radio-container'>
            <input type='radio' name='user' id='swimmer' value='swimmer'></input>
            <label htmlFor='swimmer'>Swimmer</label>
            <input type='radio' name='user' id='host' value='host'></input>
            <label htmlFor="host">Host</label>
          </div>
          <label htmlFor='name'>Name</label>
          <input className='sign-up-input' type='name' name='name'></input>
          <label htmlFor='username'>Username</label>
          <input className='sign-up-input' type='username' name='username'></input>
          <label htmlFor="password">Password</label>
          <input className='sign-up-input' type="password" name="password"></input>
          <button className='login-button' type='submit'>LOGIN</button>
        </form>
      </div>
    );
  }
}

export default SignUp;
