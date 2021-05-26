import React from 'react';

class HostForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const formInputs = new FormData(event.target);
    const init = {
      method: 'POST',
      body: formInputs
    };
    fetch('/api/hosts', init)
      .then(res => res.json())
      .catch(err => console.error(err));

    event.target.reset();
  }

  render() {
    return (
      <div className='host-form-container'>
        <h1 className='host-form-title'>Add your pool!</h1>
        <form onSubmit={this.handleSubmit}>
          <div className='row'>
            <div className='column'>
              <label htmlFor='name'>Name</label>
              <input className='input' type='text' name='name'></input>
            </div>
            <div className='column'>
              <label htmlFor='location'>Location</label>
              <input className='input' type='text' name='location'></input>
            </div>
            <div className='column'>
              <label htmlFor='price'>Price per hour</label>
              <input className='input' type='text' name='price'></input>
            </div>
          </div>
          <div className='row'>
            <div className='column'>
              <label htmlFor='description'>Description</label>
              <textarea className='input' name='description'></textarea>
            </div>
            <div className='column'>
              <label htmlFor='amenities'>Amenities</label>
              <textarea className='input' name='amenities'></textarea>
            </div>
          </div>
          <div className='column rules'>
            <label htmlFor='rules'>Rules</label>
            <textarea className='input' name='rules'></textarea>
          </div>
          <div className='column img'>
            <label className='image-label' htmlFor='image'>Image</label>
            <input className='fileInput' type='file' name='image'></input>
          </div>
          <div className='button-container'>
            <button className='host-submit-button' type='submit'>SUBMIT</button>
          </div>
        </form>
      </div>
    );
  }
}

export default HostForm;
