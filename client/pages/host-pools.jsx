import React from 'react';

class HostPools extends React.Component {
  constructor(props) {
    super(props);
    this.renderPoolList = this.renderPoolList.bind(this);
    this.state = {
      hostId: this.props.hostId,
      poolList: null,
      isLoading: true
    };
  }

  componentDidMount() {
    const hostId = this.state.hostId;
    fetch(`/api/host/pools/${hostId}`)
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
          <img id={pool.poolId} className='pool-list-img' src={pool.image}></img>
          <div className='host-pool-location'>{pool.location}</div>
        </div>
      );
    });
    return poolList;
  }

  poolsExist() {
    if (!this.state.poolList[0]) {
      return <h1 className='no-pools'>You don&apos;t currently have a pool!</h1>;
    }
    return (
      <div>
        <h1 className='host-pools-header'>Your Pools</h1>
        <div className='pool-list-container'>
          {this.renderPoolList()}
        </div>
      </div>
    );
  }

  render() {
    return this.state.isLoading
      ? <p>Loading...</p>
      : (
        <>
          <a href='#host-form' className='add-pool-link'><button className='add-pool-button'>Add a pool</button></a>
          {this.poolsExist()}
        </>
        );
  }
}

export default HostPools;
