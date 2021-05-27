import React from 'react';

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.renderPoolList = this.renderPoolList.bind(this);
    this.poolsExist = this.poolsExist.bind(this);
    this.state = {
      location: this.props.location,
      poolList: null,
      isLoading: true
    };
  }

  componentDidMount() {
    const location = this.state.location;
    fetch(`/api/pools/${location}`)
      .then(res => res.json())
      .then(body => {
        this.setState({
          poolList: body,
          isLoading: false
        });
      });
  }

  renderPoolList() {
    const poolList = this.state.poolList.map(pool => {
      return (
        <div className='list-pool' key={pool.poolId}>
          <img className='pool-list-img' src={pool.image}></img>
          <div className='pool-list-info'>
            <span className='pool-list-location'>{pool.location}</span>
            <span className='pool-list-price'>{`$${pool.price}/hr`}</span>
          </div>
        </div>
      );
    });
    return poolList;
  }

  poolsExist() {
    if (!this.state.poolList[0]) {
      return <h1 className='no-pools'>There are currently no pools in {this.state.location}!</h1>;
    }
    return (
      <div>
        <h1 className='search-result-header'>Pools in {this.state.location}</h1>
        <div className='pool-list-container'>
          {this.renderPoolList()}
        </div>
      </div>
    );
  }

  render() {
    return this.state.isLoading
      ? <p>Loading...</p>
      : this.poolsExist();
  }

}

export default SearchResults;
