import React, { useEffect, useState } from 'react';

const EditPool = props => {
  const [location, setLocation] = useState(' ');
  const [price, setPrice] = useState(' ');
  const [description, setDescription] = useState(' ');
  const [rules, setRules] = useState(' ');
  const [amenities, setAmenities] = useState(' ');

  useEffect(() => {
    fetch(`/api/pool/${props.poolId}`)
      .then(response => response.json())
      .then(body => {
        setLocation(body.location);
        setPrice(body.price);
        setDescription(body.description);
        setRules(body.rules);
        setAmenities(body.amenities);
      });
  }, []);

  const handleChange = event => {
    const { name, value } = event.target;
    if (name === 'location') {
      setLocation(value);
    }
    if (name === 'price') {
      setPrice(value);
    }
    if (name === 'description') {
      setDescription(value);
    }
    if (name === 'rules') {
      setRules(value);
    }
    if (name === 'amenities') {
      setAmenities(value);
    }
  };

  const handleClick = event => {
    window.location.hash = `#host-pool?poolId=${props.poolId}`;
  };

  const handleSubmit = event => {
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
    fetch(`/api/edit-pool/${props.poolId}/${ifImage}`, init)
      .then(response => {
        window.location.hash = `#host-pool?poolId=${props.poolId}`;
      });
  };

  return (
      <div className='host-form-container'>
        <h1 className='host-form-title'>Edit your pool!</h1>
        <form onSubmit={handleSubmit}>
          <div className='row'>
            <div className='column'>
              <label htmlFor='location'>Location</label>
              <input onChange={handleChange} value={location} className='input' type='text' name='location'></input>
            </div>
            <div className='column price'>
              <label htmlFor='price'>Price per hour</label>
              <input onChange={handleChange} value={price} className='input' type='text' name='price'></input>
            </div>
          </div>
          <div className='row'>
            <div className='column'>
              <label htmlFor='description'>Description</label>
              <textarea onChange={handleChange} value={description} className='input' name='description'></textarea>
            </div>
            <div className='column'>
              <label htmlFor='amenities'>Amenities</label>
              <textarea onChange={handleChange} value={amenities} className='input' name='amenities'></textarea>
            </div>
          </div>
          <div className='column rules'>
            <label htmlFor='rules'>Rules</label>
            <textarea onChange={handleChange} value={rules} className='input' name='rules'></textarea>
          </div>
          <div className='column img'>
            <label className='image-label' htmlFor='image'>Image</label>
            <input className='fileInput' onChange={handleChange} type='file' name='image'></input>
          </div>
          <div className='edit-button-container'>
            <button className='edit-submit-button' type='submit'>SUBMIT</button>
            <button onClick={handleClick} className='edit-cancel-button' type='button'>CANCEL</button>
          </div>
        </form>
      </div>
  );
};

export default EditPool;
