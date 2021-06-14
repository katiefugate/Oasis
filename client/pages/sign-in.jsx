import React from 'react';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      username: 'demo',
      password: 'mickeymouse'
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    if (event.target.user.value === 'host') {
      const init = {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      fetch('/api/host/sign-in', init)
        .then(response => response.json())
        .then(body => {
          this.props.onSignIn('host', body);
          if (body.error) {
            window.location.hash = '#sign-in';
          } else {
            window.location.hash = '#host-form';
          }
        });
    } else {
      const init = {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      fetch('/api/swimmer/sign-in', init)
        .then(response => response.json())
        .then(body => {
          this.props.onSignIn('swimmer', body);
          if (body.error) {
            window.location.hash = '#sign-in';
          } else {
            window.location.hash = '#search';
          }
        });
    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <div>
        <div className='header-sign-in'>
          <h1 className='header-name'>OASIS</h1>
        </div>
        <div className={this.props.invalid}>Invalid Login!</div>
        <form onSubmit={this.handleSubmit} className='sign-in-form'>
          <h1 className='auth-header'>Sign in to continue</h1>
          <div className='radio-container'>
            <input type='radio' name='user' id='swimmer' value='swimmer'></input>
            <label htmlFor='swimmer'>Swimmer</label>
            <input type='radio' name='user' id='host' value='host'></input>
            <label htmlFor="host">Host</label>
          </div>
          <div className='input-container'>
            <label className='sign-in-label' htmlFor='username'>Username</label>
            <input onChange={this.handleChange} className='sign-in-input' type='username' name='username' value={this.state.username}></input>
          </div>
          <div className='input-container'>
            <label className='sign-in-label' htmlFor="password">Password</label>
            <input onChange={this.handleChange} className='sign-in-input' type="password" name="password" value={this.state.password}></input>
          </div>
          <button className='sign-in-button' type='submit'>Sign in!</button>
        </form>
      </div>
    );
  }
}

export default SignIn;
