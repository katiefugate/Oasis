import React from 'react';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleHandler = this.toggleHandler.bind(this);
    this.state = {
      username: 'demo',
      password: 'mickeymouse',
      type: 'swimmer'
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    const type = event.target.user.value;
    const init = {
      method: 'POST',
      body: JSON.stringify({ username, password, type }),
      headers: {
        'Content-Type': 'application/json'
      }
    };

    fetch('/api/sign-in', init)
      .then(response => response.json())
      .then(body => {
        this.props.onSignIn(type, body);
        if (body.error) {
          window.location.hash = '#sign-in';
        } else if (type === 'swimmer') {
          window.location.hash = '#search';
        } else if (type === 'host') {
          window.location.hash = '#host-pools';
        }
      });
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  toggleHandler() {
    if (this.state.type === 'swimmer') {
      this.setState({ type: 'host' });
    } else {
      this.setState({ type: 'swimmer' });
    }
  }

  render() {
    return (
      <div>
        <div className='header-sign-in'>
          <h1 className='header-name'>OASIS</h1>
        </div>
        <div className='home-description'>Get away to your own private oasis. Rent a pool by the hour.</div>
        <p className='home-or'>OR</p>
        <div className='home-host'>Become a host and turn your splash into cash!</div>
        <div className={this.props.invalid}>Invalid Login!</div>
        <form onSubmit={this.handleSubmit} className='sign-in-form'>
          <h1 className='auth-header'>Sign in to continue</h1>
          <p className={`toggle-${this.state.type}`} onClick={this.toggleHandler}>
            {this.state.type}
            <span className={`circle ${this.state.type}`} onClick={this.toggleHandler}></span>
          </p>
          <input type='hidden' name='user' value={this.state.type} />
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
        <div className='sign'>Don&apos;t have an account? <a className='sign-link' href='#sign-up'>Sign up!</a></div>
      </div>
    );
  }
}

export default SignIn;
