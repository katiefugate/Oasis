import React from 'react';

class EditPool extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      location: ' ',
      price: ' ',
      description: ' ',
      rules: ' ',
      amenities: ' ',
      image: ' '
    };
  }

  componentDidMount() {
    fetch(`/api/pool/${this.props.poolId}`)
      .then(response => response.json())
      .then(body => {
        this.setState({
          location: body.location,
          price: body.price,
          description: body.description,
          rules: body.rules,
          amenities: body.amenities,
          image: body.image
        });
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    let ifImage = true;
    const formInputs = new FormData(event.target);
    if (formInputs.get('image').name === '') {
      formInputs.delete('image');
      ifImage = false;
    }
    const init = {
      method: 'PUT',
      body: formInputs
    };
    fetch(`/api/edit-pool/${this.props.poolId}/${ifImage}`, init);
    window.location.hash = `#host-pool?poolId=${this.props.poolId}`;
  }

  handleClick(event) {
    window.location.hash = `#host-pool?poolId=${this.props.poolId}`;
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <div className='host-form-container'>
        <h1 className='host-form-title'>Add your pool!</h1>
        <form onSubmit={this.handleSubmit}>
          <div className='row'>
            <div className='column'>
              <label htmlFor='location'>Location</label>
              <input onChange={this.handleChange} value={this.state.location} className='input' type='text' name='location'></input>
            </div>
            <div className='column price'>
              <label htmlFor='price'>Price per hour</label>
              <input onChange={this.handleChange} value={this.state.price} className='input' type='text' name='price'></input>
            </div>
          </div>
          <div className='row'>
            <div className='column'>
              <label htmlFor='description'>Description</label>
              <textarea onChange={this.handleChange} value={this.state.description} className='input' name='description'></textarea>
            </div>
            <div className='column'>
              <label htmlFor='amenities'>Amenities</label>
              <textarea onChange={this.handleChange} value={this.state.amenities} className='input' name='amenities'></textarea>
            </div>
          </div>
          <div className='column rules'>
            <label htmlFor='rules'>Rules</label>
            <textarea onChange={this.handleChange} value={this.state.rules} className='input' name='rules'></textarea>
          </div>
          <div className='column img'>
            <label className='image-label' htmlFor='image'>Image</label>
            <input className='fileInput' onChange={this.handleChange} type='file' name='image'></input>
          </div>
          <div className='edit-button-container'>
            <button className='edit-submit-button' type='submit'>SUBMIT</button>
            <button onClick={this.handleClick} className='edit-cancel-button' type='button'>CANCEL</button>
          </div>
        </form>
      </div>
    );
  }
}

export default EditPool;
