import React from 'react';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {

  }

  render() {
    return (
      <div className='search-container'>
        <label className='search-label' htmlFor='search'>Where do you want to swim?</label>
        <input className='search-input' type='text'></input>
        <button className='search-button'>Search</button>
      </div>
    );
  }
}

export default Search;
