import React from 'react';

class HostPoolInfo extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      info: null,
      isLoading: true
    };
  }

  componentDidMount() {
    fetch(`api/pool/${this.props.poolId}`)
      .then(res => res.json())
      .then(body => {
        this.setState({
          info: body,
          isLoading: false
        });
      });
  }

  handleClick(event) {
    window.location.hash = `#edit-pool?poolId=${this.props.poolId}`;
  }

  render() {
    return this.state.isLoading
      ? <p>Loading...</p>
      : (
          <div className='pool-info-container'>
            <div className='info-col'>
              <div className='location-book-container'>
                <span className='pool-info-location'>{this.state.info.location}</span>
                <i onClick={this.handleClick} className="fas fa-edit pool-info-edit"></i>
              </div>
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

export default HostPoolInfo;
