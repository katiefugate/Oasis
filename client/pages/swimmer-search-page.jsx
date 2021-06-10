import React from 'react';

class SwimmerSearch extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = { location: '' };
  }

  handleChange(event) {
    this.setState({ location: event.target.value });
  }

  handleClick(event) {
    event.preventDefault();
    const location = this.state.location;
    window.location.hash = `#search-results?&location=${location}`;
    event.target.reset();
  }

  render() {
    return (
     <form onSubmit={this.handleClick} className='search-container'>
        <label className='search-label' htmlFor='search'>Where do you want to swim?</label>
        <input onChange={this.handleChange} name='search' className='search-input' type='text'></input>
        <button type='submit' className='search-button'>Search</button>
      </form>
    );
  }
}

export default SwimmerSearch;
