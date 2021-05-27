import React from 'react';
import parseRoute from '../lib/parse-route';

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.renderPoolList = this.renderPoolList.bind(this);
    this.state = {
      route: parseRoute(window.location.hash),
      poolList: null,
      isLoading: true
    };
  }

  componentDidMount() {
    const { params } = this.state.route;
    const location = params.get('location');
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

  render() {
    return this.state.isLoading
      ? <p>Loading...</p>
      : (
      <div className='pool-list-container'>
        {this.renderPoolList()}
      </div>
        );
  }

}

export default SearchResults;
