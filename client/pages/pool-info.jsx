import React from 'react';

class PoolInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      poolId: this.props.poolId,
      info: null
    };
  }

  componentDidMount() {
    fetch(`api/pool/${this.state.poolId}`)
      .then(res => res.json())
      .then(body => {
        this.setState({
          info: body,
          isLoading: false
        });
      });
  }

  render() {
    return this.state.isLoading
      ? <p>Loading...</p>
      : (
        <div className='pool-info-container'>
          <div className='info-col'>
            <div className='pool-info-location'>{this.state.info.location}</div>
            <img className='pool-info-img' src={this.state.info.image}></img>
            <div className='pool-info-span'>
              <span>{`Hosted by ${this.state.info.name}`}</span>
              <span>{`${this.state.info.price}/hr`}</span>
            </div>
            <div>
              <h3 className='info-titles'>Description</h3>
              <p className='info-p'>{this.state.info.description}</p>
            </div>
          </div>
          <div className='info-col2'>
            <div>
              <h3 className='info-titles'>Rules</h3>
              <p className='info-p'>{this.state.info.rules}</p>
            </div>
            <div>
              <h3 className='info-titles'>Amenities</h3>
              <p className='info-p'>{this.state.info.amenities}</p>
            </div>
          </div>
        </div>
        );
  }
}

export default PoolInfo;
