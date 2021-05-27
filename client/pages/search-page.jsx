import React from 'react';
import parseRoute from '../lib/parse-route';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  handleClick(event) {
    event.preventDefault();
    const location = event.target.search.value;
    window.location.hash = `#search-results?&location=${location}`;
    event.target.reset();
  }

  render() {
    return (
     <form onSubmit={this.handleClick} className='search-container'>
        <label className='search-label' htmlFor='search'>Where do you want to swim?</label>
        <input name='search' className='search-input' type='text'></input>
        <button type='submit' className='search-button'>Search</button>
      </form>
    );
  }
}

export default Search;
